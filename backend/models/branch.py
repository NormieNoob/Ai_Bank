from . import db

class Branch(db.Model):
    __tablename__ = 'branch'

    BranchID = db.Column(db.String(50), primary_key=True)
    BranchName = db.Column(db.String(100), nullable=False)
    Address = db.Column(db.String(200), nullable=False)
    PhoneNumber = db.Column(db.String(20))
    ManagerName = db.Column(db.String(100))
    BankID = db.Column(db.String(50), db.ForeignKey('bank.BankID'), nullable=False)

    # Relationships
    accounts = db.relationship('Account', backref='branch', lazy=True)
    transactions = db.relationship('Transaction', backref='branch', lazy=True)
    credit_cards = db.relationship('CreditCard', backref='branch', lazy=True)