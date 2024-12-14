from flask import Blueprint, jsonify, request
from models import db, User
from services.user_service import UserService

user_bp = Blueprint('user', __name__)

@user_bp.route('/info', methods=['GET'])
def get_user_info(username):
    try:
        user = User.query.filter_by(Username=username).first()
        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        return jsonify({
            "success": True,
            "user": {
                "username": user.Username,
                "firstName": user.FirstName,
                "lastName": user.LastName,
                "email": user.Email,
                "subscription": user.SubscriptionType
            }
        }), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@user_bp.route('/upgrade-subscription', methods=['POST'])
def upgrade_subscription(username):
    try:
        user = User.query.filter_by(Username=username).first()
        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        # Update subscription to premium
        user.SubscriptionType = 'premium'
        db.session.commit()

        return jsonify({
            "success": True,
            "user": {
                "username": user.Username,
                "firstName": user.FirstName,
                "lastName": user.LastName,
                "email": user.Email,
                "subscription": user.SubscriptionType
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500 