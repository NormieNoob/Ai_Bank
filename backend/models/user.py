from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'

    UserID = db.Column(db.String(50), primary_key=True)
    FirstName = db.Column(db.String(100), nullable=False)
    LastName = db.Column(db.String(100), nullable=False)
    Address = db.Column(db.String(200), nullable=False)
    Email = db.Column(db.String(120), unique=True, nullable=False)
    PhoneNumber = db.Column(db.String(20), nullable=False)
    DateOfBirth = db.Column(db.Date, nullable=False)
    Password = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f'<User {self.Email}>'