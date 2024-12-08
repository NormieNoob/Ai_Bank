from flask import Blueprint, request, jsonify, session
from services.account_creation import AccountService
from models import db, User
accounts_bp = Blueprint('accounts', __name__)


@accounts_bp.route('/savings', methods=['GET', 'POST'])
def check_savings():
    print("savings")
    try:
        data = request.get_json()
        username = data['username']
        result, status_code = AccountService.checking_account_balance(username, "savings")
        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500