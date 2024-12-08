# routes/auth.py
from flask import Blueprint, request, jsonify, session
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
        result, status_code = AuthService.authenticate_user(
            data.get('username'),
            data.get('password')
        )
        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@auth_bp.route('/logout', methods=['POST'])
def logout():
    # data = request.get_json()
    # print("request data = ", f"{data.get}")
    print("In logout route - Session contents:", dict(session))  # Add this
    return AuthService.logout()


@auth_bp.route('/test-session', methods=['GET'])
def test_session():
    username = request.cookies.get('username')
    return jsonify({
        "logged_in": username is not None,
        "username": username
    })