# routes/auth.py
from flask import Blueprint, request, jsonify
from services.auth_service import AuthService

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/createAccount', methods=['POST'])
def createAccount():
    try:
        data = request.get_json()
        result, status_code = AuthService.create_user(data)
        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@auth_bp.route('/signin', methods=['POST'])
def signin():
    try:
        data = request.get_json()
        print(data.get('email'))
        print(data.get('password'))

        result, status_code = AuthService.authenticate_user(
            data.get('email'),
            data.get('password')
        )
        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({"success": True, "message": "Logged out successfully"}), 200
