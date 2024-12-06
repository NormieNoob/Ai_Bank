from . import db
from datetime import datetime

class Balance(db.Model):
    __tablename__ = 'balance'

    BalanceID = db.Column(db.String(50), primary_key=True)
    AccountID = db.Column(db.String(50), db.ForeignKey('account.AccountID'), unique=True, nullable=False)
    Amount = db.Column(db.Float, nullable=False)
    LastUpdated = db.Column(db.DateTime, default=datetime.utcnow)