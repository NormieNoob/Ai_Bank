from . import db

class Bank(db.Model):
    __tablename__ = 'bank'

    BankID = db.Column(db.String(50), primary_key=True)
    BankName = db.Column(db.String(100), nullable=False)
    HeadquartersAddress = db.Column(db.String(200), nullable=False)
    EstablishedDate = db.Column(db.Date, nullable=False)
    ContactNumber = db.Column(db.String(20))
    Email = db.Column(db.String(100))

    # Relationships
    branches = db.relationship('Branch', backref='bank', lazy=True)