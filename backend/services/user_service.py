from models import db, User
import logging

logger = logging.getLogger(__name__)

class UserService:
    @staticmethod
    def get_user_details(username):
        try:
            user = User.query.filter_by(Username=username).first()
            if not user:
                return {"success": False, "message": "User not found"}, 404

            return {
                "success": True,
                "user": {
                    "username": user.Username,
                    "firstName": user.FirstName,
                    "lastName": user.LastName,
                    "email": user.Email,
                    "subscription": user.SubscriptionType
                }
            }, 200

        except Exception as e:
            logger.error(f"Error retrieving user details: {str(e)}")
            return {"success": False, "message": str(e)}, 500 