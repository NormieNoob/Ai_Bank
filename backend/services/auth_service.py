from models import db, User
import uuid
from flask_bcrypt import Bcrypt
import logging
from datetime import datetime
from flask import session
from .account_creation import AccountService

bcrypt = Bcrypt()
logger = logging.getLogger(__name__)


class AuthService:
    @staticmethod
    def create_user(data):
        try:
            # Log the incoming data (remove in production)
            logger.debug(f"Creating user with data: {data}")

            # Check if email exists
            existing_user = User.query.filter_by(Email=data.get('email')).first()
            if existing_user:
                return {"success": False, "message": "Email already exists"}, 400

            # Checking if the username exists
            existing_user = User.query.filter_by(Username=data.get('username')).first()
            if existing_user:
                return {"success": False, "message": "Username already exists"}, 400

            # Validate required fields
            required_fields = ['email', 'password', 'FirstName', 'LastName',
                               'Address', 'PhoneNumber', 'DateOfBirth', 'username']

            missing_fields = [field for field in required_fields if not data.get(field)]
            if missing_fields:
                return {
                    "success": False,
                    "message": f"Missing required fields: {', '.join(missing_fields)}"
                }, 400

            try:
                # Convert date string to date object
                date_of_birth = datetime.strptime(data.get('DateOfBirth'), '%Y-%m-%d').date()
            except Exception as e:
                logger.error(f"Date conversion error: {str(e)}")
                return {"success": False, "message": "Invalid date format. Use YYYY-MM-DD"}, 400

            try:
                # Hash password
                hashed_password = bcrypt.generate_password_hash(
                    data.get('password')
                ).decode('utf-8')
            except Exception as e:
                logger.error(f"Password hashing error: {str(e)}")
                return {"success": False, "message": "Error processing password"}, 500

            try:
                # Create new user
                user_id = str(uuid.uuid4())
                new_user = User(
                    UserID=user_id,
                    FirstName=data.get('FirstName'),
                    LastName=data.get('LastName'),
                    Username=data.get('username'),
                    Address=data.get('Address'),
                    Email=data.get('email'),
                    PhoneNumber=data.get('PhoneNumber'),
                    DateOfBirth=date_of_birth,
                    Password=hashed_password
                )

                db.session.add(new_user)
                db.session.commit()

                # Create checking and savings accounts for the new user
                accounts_result, status_code = AccountService.create_accounts_for_user(user_id)

                if not accounts_result["success"]:
                    # If account creation fails, roll back the user creation
                    db.session.rollback()
                    logger.error(f"Failed to create accounts for user {user_id}")
                    return accounts_result, status_code

                logger.info(f"User created successfully with accounts: {user_id}")
                return {
                    "success": True,
                    "message": "User registered successfully with checking and savings accounts",
                    "user_id": user_id,
                    "accounts": accounts_result["accounts"]
                }, 201

            except Exception as e:
                db.session.rollback()
                logger.error(f"Database error: {str(e)}")
                return {"success": False, "message": f"Error creating user: {str(e)}"}, 500

        except Exception as e:
            logger.error(f"Unexpected error in create_user: {str(e)}")
            return {"success": False, "message": f"An unexpected error occurred: {str(e)}"}, 500

    @staticmethod
    def authenticate_user(username, password):
        try:
            user = User.query.filter_by(Username=username).first()
            if not user:
                return {"success": False, "message": "Invalid username or password"}, 401

            if bcrypt.check_password_hash(user.Password, password):
                session.clear()
                session.permanent = True
                session['username'] = user.Username
                session['user_id'] = user.UserID  # Added to store user_id in session
                session.modified = True

                # Get user's accounts
                accounts_result, _ = AccountService.get_user_accounts(user.UserID)

                return {
                    "success": True,
                    "message": "Logged in successfully",
                    "username": user.Username,
                    "user_id": user.UserID,
                    "accounts": accounts_result.get("accounts", []) if accounts_result["success"] else []
                }, 200

            return {"success": False, "message": "Invalid username or password"}, 401

        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return {"success": False, "message": str(e)}, 500

    @staticmethod
    def logout():
        try:
            # if 'username' not in session:
            # return {"success": False, "message": "User not logged in"}, 401

            logger.debug("Before clearing the session:", dict(session))
            session.clear()
            logger.debug("After clearing session:", dict(session))

            return {
                "success": True,
                "message": "Logged out successfully"
            }, 200

        except Exception as e:
            logger.error(f"Logout error: {str(e)}")
            return {"success": False, "message": str(e)}, 500

    @staticmethod
    def get_current_user():
        try:
            if 'username' not in session:
                return {"success": False, "message": "User not logged in"}, 401

            user = User.query.filter_by(Username=session['username']).first()
            if not user:
                session.clear()
                return {"success": False, "message": "User not found"}, 404

            # Get user's accounts
            accounts_result, _ = AccountService.get_user_accounts(user.UserID)

            return {
                "success": True,
                "user": {
                    "user_id": user.UserID,
                    "username": user.Username,
                    "email": user.Email,
                    "first_name": user.FirstName,
                    "last_name": user.LastName,
                    "accounts": accounts_result.get("accounts", []) if accounts_result["success"] else []
                }
            }, 200

        except Exception as e:
            logger.error(f"Error getting current user: {str(e)}")
            return {"success": False, "message": str(e)}, 500