from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
from models import db
from routes import auth_bp
from config import Config

bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Configure Flask-Session
    app.config['SESSION_TYPE'] = 'filesystem'
    Session(app)

    # CORS configuration with specific origin and credentials support
    CORS(app,
         resources={
             r"/auth/*": {
                 "origins": ["http://localhost:3000"],  # Your Next.js frontend origin
                 "supports_credentials": True,
                 "allow_headers": ["Content-Type", "Authorization"],
                 "methods": ["GET", "POST", "OPTIONS"]
             }
         })

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')

    # Initialize the database
    with app.app_context():
        db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)