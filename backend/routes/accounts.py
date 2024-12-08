from flask import Blueprint, request, jsonify, session
from services.account_creation import AccountService
from models import db, User
accounts_bp = Blueprint('accounts', __name__)


@accounts_bp.route('/checking', methods=['GET'])
def check_savings(username):
    try:
        result, status_code = AccountService.checking_account_balance(username, "checking")
        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500