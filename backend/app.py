from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from models import db
from routes import auth_bp, accounts_bp, user_bp
from config import Config

bcrypt = Bcrypt()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # CORS configuration
    CORS(app, resources={r"/*": {
        "origins": ["http://localhost:3000"],
        "supports_credentials": True,
        "allow_headers": ["Content-Type", "Authorization"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "expose_headers": ["Set-Cookie"],
        "allow_credentials": True
    }})

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(accounts_bp, url_prefix='/<username>/accounts/')
    app.register_blueprint(user_bp, url_prefix='/<username>/user/')

    # Initialize the database
    with app.app_context():
         db.create_all()

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)