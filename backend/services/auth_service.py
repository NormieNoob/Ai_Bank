from models import db, User
import uuid
from flask_bcrypt import Bcrypt
import logging
from datetime import datetime
from flask import session

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

            # Validate required fields
            required_fields = ['email', 'password', 'FirstName', 'LastName',
                               'Address', 'PhoneNumber', 'DateOfBirth']

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
                    Address=data.get('Address'),
                    Email=data.get('email'),
                    PhoneNumber=data.get('PhoneNumber'),
                    DateOfBirth=date_of_birth,  # Use converted date
                    Password=hashed_password
                )

                db.session.add(new_user)
                db.session.commit()

                logger.info(f"User created successfully: {user_id}")
                return {
                    "success": True,
                    "message": "User registered successfully",
                    "user_id": user_id
                }, 201

            except Exception as e:
                db.session.rollback()
                logger.error(f"Database error: {str(e)}")
                return {"success": False, "message": f"Error creating user: {str(e)}"}, 500

        except Exception as e:
            logger.error(f"Unexpected error in create_user: {str(e)}")
            return {"success": False, "message": f"An unexpected error occurred: {str(e)}"}, 500

    @staticmethod
    def authenticate_user(email, password):
        try:
            user = User.query.filter_by(Email=email).first()
            if not user:
                return {"success": False, "message": "Invalid email or password"}, 401

            if bcrypt.check_password_hash(user.Password, password):
                # Session
                session['user_id'] = user.UserID
                session['email'] = user.Email

                return {
                    "success": True,
                    "message": "Logged in successfully"
                }, 200

            return {"success": False, "message": "Invalid email or password"}, 401

        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return {"success": False, "message": str(e)}, 500

    @staticmethod
    def logout():
        try:
            session.clear()
            return {"success": True, "message": "Logged out successfully"}, 200
        except Exception as e:
            return {"success": False, "message": str(e)}, 500
