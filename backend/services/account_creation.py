# account_service.py
from models import db, User, Account, Balance
import uuid
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class AccountService:
    ACCOUNT_TYPES = {
        'checking': {
            'interest_rate': 0.001  # 0.1% interest rate
        },
        'savings': {
            'interest_rate': 0.02  # 2% interest rate
        }
    }

    @staticmethod
    def create_accounts_for_user(user_id, account_type):
        try:
            accounts = []
            account_id = str(uuid.uuid4())

            # Create the account
            new_account = Account(
                AccountID=account_id,
                AccountType=account_type,
                InterestRate=AccountService.ACCOUNT_TYPES[account_type]['interest_rate'],
                DateCreated=datetime.utcnow().date(),
                UserID=user_id
            )

            # Create initial balance record
            initial_balance = Balance(
                BalanceID=str(uuid.uuid4()),
                AccountID=account_id,
                Amount=0.0,
                LastUpdated=datetime.utcnow()
            )

            db.session.add(new_account)
            db.session.add(initial_balance)
            accounts.append({
                'account_id': account_id,
                'account_type': account_type
            })

            db.session.commit()
            logger.info(f"Created checking and savings accounts for user {user_id}")
            return {"success": True, "accounts": accounts}, 201

        except Exception as e:
            db.session.rollback()
            logger.error(f"Error creating accounts: {str(e)}")
            return {"success": False, "message": f"Error creating accounts: {str(e)}"}, 500

    @staticmethod
    def get_user_accounts(user_id):
        """Retrieves all accounts for a given user with their current balances."""
        try:
            accounts = Account.query.filter_by(UserID=user_id).all()
            accounts_data = []

            for account in accounts:
                accounts_data.append({
                    'account_id': account.AccountID,
                    'account_type': account.AccountType,
                    'interest_rate': account.InterestRate,
                    'balance': account.balance.Amount if account.balance else 0.0,
                    'last_updated': account.balance.LastUpdated.isoformat() if account.balance else None
                })

            return {"success": True, "accounts": accounts_data}, 200

        except Exception as e:
            logger.error(f"Error retrieving accounts: {str(e)}")
            return {"success": False, "message": f"Error retrieving accounts: {str(e)}"}, 500

    def checking_account_balance(username, account_type):
        """Helper function to get user_id from username."""
        try:
            user = User.query.filter_by(Username=username).first()
            print(user.FirstName)
            account = Account.query.filter_by(
                UserID=user.UserID,
                AccountType=account_type
            ).first()
            if account is None:
                return {
                    "success": False,
                    "status": "accountNotFound",
                    "message": f" {account_type} Account does not exist"
                }, 200
            balance = account.balance
            return {
                "success": True,
                "account_type": account_type,
                "balance": balance.Amount,
                "last_updated": balance.LastUpdated.isoformat(),
                "account_id": account.AccountID,
                "interest_rate": account.InterestRate
            }, 200
        except Exception as e:
            return {
                "success": False,
                "message": f"Error fetching the account : {str(e)}"
            }, 404

