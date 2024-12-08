from . import db
from datetime import datetime

class Account(db.Model):
    __tablename__ = 'account'

    AccountID = db.Column(db.String(50), primary_key=True)
    AccountType = db.Column(db.String(50), nullable=False)
    InterestRate = db.Column(db.Float)
    DateCreated = db.Column(db.Date, default=datetime.utcnow)
    UserID = db.Column(db.String(50), db.ForeignKey('user.UserID'), nullable=False)
    # BranchID = db.Column(db.String(50), db.ForeignKey('branch.BranchID'), nullable=False)

    # Relationships
    balance = db.relationship('Balance', backref='account', uselist=False, lazy=True)
    # outgoing_transactions = db.relationship('Transaction',
    #                                      foreign_keys='Transaction.FromAccountID',
    #                                      backref='from_account', lazy=True)
    # incoming_transactions = db.relationship('Transaction',
    #                                      foreign_keys='Transaction.ToAccountID',
    #                                      backref='to_account', lazy=True)
    # credit_cards_billing = db.relationship('CreditCard',
    #                                      backref='billing_account', lazy=True)