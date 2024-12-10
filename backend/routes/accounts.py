from flask import Blueprint, request, jsonify, session
from services.account_creation import AccountService
from models import db, User
from flask import Blueprint, request, jsonify
from models import db, Balance, Transaction, Account
from datetime import datetime
import uuid

accounts_bp = Blueprint('accounts', __name__)


@accounts_bp.route('/checking', methods=['GET'])
def checking_balance(username):
    try:
        result, status_code = AccountService.checking_account_balance(username, "checking")
        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@accounts_bp.route('/savings', methods=['GET'])
def savings_balance(username):
    try:
        result, status_code = AccountService.checking_account_balance(username, "savings")
        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@accounts_bp.route('/deposit', methods=['POST'])
def deposit_amount(username):
    try:
        # Parse JSON data from request
        data = request.get_json()

        account_type = data.get('accountType')  # "Checking" or "Savings"
        deposit_amount = data.get('depositAmount')
        account_type = account_type.lower()

        print(f"{deposit_amount} and {account_type}")

        # Validate the input
        if not account_type or not deposit_amount:
            return jsonify({"success": False, "message": "Account type and deposit amount are required."}), 400

        if deposit_amount <= 0:
            return jsonify({"success": False, "message": "Deposit amount must be greater than zero."}), 400

        if deposit_amount > 250000:
            return jsonify({"success": False, "message": "Deposit limit exceeded. Maximum is $250,000."}), 400

        # Find the account based on the username and account type
        user = User.query.filter_by(Username=username).first()
        account = Account.query.filter_by(
            UserID=user.UserID,
            AccountType=account_type
        ).first()

        print(f"Balance is {account.balance}")

        if not account:
            return jsonify({"success": False, "message": "Account not found for the specified user."}), 404

        print(f"Balance is {account.balance}")

        # Check if balance record exists for the account
        balance = Balance.query.filter_by(AccountID=account.AccountID).first()
        print(f"balance = {balance}")

        if not balance:
            # Create a new balance record if it doesn't exist
            balance = Balance(
                BalanceID=str(uuid.uuid4()),
                AccountID=account.AccountID,
                Amount=0.0
            )
            db.session.add(balance)

        # Update the balance
        balance.Amount += deposit_amount
        balance.LastUpdated = datetime.utcnow()

        # Create a new transaction record
        transaction = Transaction(
            TransactionID=str(uuid.uuid4()),
            FromAccountID=None,  # No "from" account for deposits
            ToAccountID=account.AccountID,
            Amount=deposit_amount,
            TransactionType="Deposit",
            TransactionDate=datetime.utcnow(),
        )
        db.session.add(transaction)

        # Commit the changes to the database
        db.session.commit()

        return jsonify({"success": True, "message": f"Successfully deposited ${deposit_amount} into {account_type} account."}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

