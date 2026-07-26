from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from backend import db
from backend.models.user import User
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    role = data.get('role', 'job_seeker')

    if not name or not email or not password:
        return jsonify({'message': 'Name, email and password are required.'}), 400

    if role not in ['job_seeker', 'employer']:
        return jsonify({'message': 'Invalid role selected.'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'Email is already registered.'}), 409

    user = User(name=name, email=email, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=7))
    return jsonify({'user': user.to_dict(), 'access_token': access_token}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'message': 'Email and password are required.'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid email or password.'}), 401

    access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=7))
    return jsonify({'user': user.to_dict(), 'access_token': access_token}), 200
