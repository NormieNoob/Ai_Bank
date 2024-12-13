from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from datetime import timedelta
import os
import redis

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, 'database.db')


class Config:
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{DATABASE_PATH}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
<<<<<<< HEAD
    SECRET_KEY = 'secret-key-here'

    # Simple session configuration
    SESSION_TYPE = None  # Use Flask's default session handling
    SESSION_COOKIE_SECURE = False
=======
    SECRET_KEY = 'lorem-ipsum'
    SESSION_TYPE = 'filesystem'
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    SESSION_COOKIE_SECURE = True  # For HTTPS
>>>>>>> 07d8364fabf3c11a5a76c240243a5809fbcd5b6f
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'