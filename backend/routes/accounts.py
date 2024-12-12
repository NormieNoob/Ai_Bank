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

        if account is None:
            return jsonify({"success": False, "message": f"{account_type} Account does not exist."}), 400

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


@accounts_bp.route('/transfer', methods=['POST'])
def transfer_funds(username):
    try:
        # Parse JSON data from request
        data = request.get_json()
        from_account_type = data.get('fromAccountType')  # "Checking" or "Savings"
        to_username = data.get('toUsername')  # Recipient's username
        transfer_amount = data.get('transferAmount')
        from_account_type = from_account_type.lower()

        # Validate inputs
        if not from_account_type or not to_username or not transfer_amount:
            return jsonify({"success": False, "message": "All fields are required."}), 400

        if transfer_amount <= 0:
            return jsonify({"success": False, "message": "Transfer amount must be greater than zero."}), 400

        # Find sender's user and account
        sender_user = User.query.filter_by(Username=username).first()
        if not sender_user:
            return jsonify({"success": False, "message": "Sender not found."}), 404

        sender_account = Account.query.filter_by(
            UserID=sender_user.UserID,
            AccountType=from_account_type
        ).first()
        if not sender_account:
            return jsonify({"success": False, "message": f"Sender {from_account_type} account not found."}), 404

        # Fetch sender's balance
        sender_balance = Balance.query.filter_by(AccountID=sender_account.AccountID).first()
        if not sender_balance or sender_balance.Amount < transfer_amount:
            return jsonify({"success": False, "message": "Insufficient balance for transfer."}), 400

        # Find recipient's user and account
        recipient_user = User.query.filter_by(Username=to_username).first()
        if not recipient_user:
            return jsonify({"success": False, "message": "Recipient not found."}), 404

        recipient_account = Account.query.filter_by(
            UserID=recipient_user.UserID,
            AccountType=from_account_type
        ).first()
        if not recipient_account:
            return jsonify({"success": False, "message": f"Recipient {from_account_type} account not found."}), 404

        # Fetch recipient's balance or create a new balance record
        recipient_balance = Balance.query.filter_by(AccountID=recipient_account.AccountID).first()
        if not recipient_balance:
            recipient_balance = Balance(
                BalanceID=str(uuid.uuid4()),
                AccountID=recipient_account.AccountID,
                Amount=0.0
            )
            db.session.add(recipient_balance)

        # Perform transfer: deduct from sender and add to recipient
        sender_balance.Amount -= transfer_amount
        sender_balance.LastUpdated = datetime.utcnow()

        recipient_balance.Amount += transfer_amount
        recipient_balance.LastUpdated = datetime.utcnow()

        # Create transaction records for both sender and recipient
        transaction = Transaction(
            TransactionID=str(uuid.uuid4()),
            FromAccountID=sender_account.AccountID,
            ToAccountID=recipient_account.AccountID,
            Amount=transfer_amount,
            TransactionType="Transfer",
            TransactionDate=datetime.utcnow(),
        )
        db.session.add(transaction)

        # Commit the changes to the database
        db.session.commit()

        return jsonify({
            "success": True,
            "message": f"Successfully transferred ${transfer_amount} from {username}'s {from_account_type} account to {to_username}'s {from_account_type} account.",
            "from_balance": sender_balance.Amount,
            "to_balance": recipient_balance.Amount
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

@accounts_bp.route('/withdraw', methods=['POST'])
def withdraw_amount(username):
    try:
        # Parse JSON data from request
        data = request.get_json()

        account_type = data.get('accountType')  # "Checking" or "Savings"
        withdraw_amount = data.get('withdrawAmount')
        account_type = account_type.lower()

        print(f"{withdraw_amount} and {account_type}")

        # Validate the input
        if not account_type or not withdraw_amount:
            return jsonify({"success": False, "message": "Account type and withdrawal amount are required."}), 400

        if withdraw_amount <= 0:
            return jsonify({"success": False, "message": "Withdrawal amount must be greater than zero."}), 400

        # Find the account based on the username and account type
        user = User.query.filter_by(Username=username).first()
        account = Account.query.filter_by(
            UserID=user.UserID,
            AccountType=account_type
        ).first()

        if not account:
            return jsonify({"success": False, "message": f" {account_type} account not found for the specified user."}), 400

        # Check if balance record exists for the account
        balance = Balance.query.filter_by(AccountID=account.AccountID).first()
        if not balance or balance.Amount is None:
            return jsonify({"success": False, "message": "No balance record found for this account."}), 404

        # Validate sufficient funds
        if withdraw_amount > balance.Amount:
            return jsonify({"success": False, "message": "Insufficient funds in the account for this withdrawal."}), 400

        # Deduct the amount from the balance
        balance.Amount -= withdraw_amount
        balance.LastUpdated = datetime.utcnow()

        # Create a new transaction record
        transaction = Transaction(
            TransactionID=str(uuid.uuid4()),
            FromAccountID=account.AccountID,
            ToAccountID=None,  # No "to" account for withdrawals
            Amount=withdraw_amount,
            TransactionType="Withdrawal",
            TransactionDate=datetime.utcnow(),
        )
        db.session.add(transaction)

        # Commit the changes to the database
        db.session.commit()

        return jsonify({"success": True, "message": f"Successfully withdrew ${withdraw_amount} from {account_type} account."}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

@accounts_bp.route('/create', methods=['POST'])
def createAccount(username):
    try:
        data = request.get_json()
        account_type = data.get('accountType')
        user = User.query.filter_by(Username=username).first()
        if not user:
            return jsonify({"success": False, "message": f" {account_type} account not found for the specified user."}), 400

        result, status_code = AccountService.create_accounts_for_user(user.UserID, account_type)
        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


