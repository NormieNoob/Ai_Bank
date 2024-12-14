from . import db
from datetime import datetime

class Transaction(db.Model):
    __tablename__ = 'transaction'

    TransactionID = db.Column(db.String(50), primary_key=True)
    FromAccountID = db.Column(db.String(50), db.ForeignKey('account.AccountID'))
    ToAccountID = db.Column(db.String(50), db.ForeignKey('account.AccountID'))
    Amount = db.Column(db.Float, nullable=False)
    TransactionType = db.Column(db.String(50), nullable=False)
    TransactionDate = db.Column(db.DateTime, default=datetime.utcnow)
    # BranchID = db.Column(db.String(50), db.ForeignKey('branch.BranchID'), nullable=False)

    def to_dict(self):
        """Convert transaction object to dictionary"""
        return {
            'TransactionID': self.TransactionID,
            'FromAccountID': self.FromAccountID,
            'ToAccountID': self.ToAccountID,
            'Amount': self.Amount,
            'TransactionType': self.TransactionType,
            'TransactionDate': self.TransactionDate.isoformat()
        }
