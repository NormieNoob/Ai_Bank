# bank_app/app.py
from flask import Flask, request, jsonify, session
from models import db, User
from config import Config
import uuid

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

# Initialize the database
with app.app_context():
    db.create_all()

# Sign-up route
@app.route('/createAccount', methods=['POST'])
def createAccount():
    data = request.get_json()
    email = data.get('email')

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already exists"}), 400

    password = data.get('password') #Have to implement password hash conversion later
    firstName = data.get('FirstName')
    lastName = data.get('LastName')
    address = data.get('Address')
    phoneNumber = data.get('PhoneNumber')
    dateOfBirth = data.get('DateOfBirth')

    user_id = str(uuid.uuid4())
    new_user = User(
        UserID=user_id,
        FirstName=firstName,
        LastName=lastName,
        Address=address,
        Email=email,
        PhoneNumber=phoneNumber,
        DateOfBirth=dateOfBirth,
        Password=password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# Sign-in route
@app.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(Email=email).first()
    if user and user.Password == password:
        return jsonify({"message": "Logged in successfully"}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 400

# Logout route
@app.route('/logout', methods=['POST'])
def logout():
    return jsonify({"message": "Logged out successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)

