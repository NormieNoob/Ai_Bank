from flask_sqlalchemy import SQLAlchemy
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, 'database.db')

class Config:
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{DATABASE_PATH}'
