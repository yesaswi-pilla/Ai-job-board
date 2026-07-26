from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend import db
from backend.models.user import User
from backend.models.saved_job import SavedJob
from backend.models.application import Application

users_bp = Blueprint('users', __name__)

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify({'user': user.to_dict()}), 200

@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    user = User.query.get_or_404(user_id)

    if 'name' in data and data['name'].strip():
        user.name = data['name'].strip()
    if 'email' in data and data['email'].strip():
        new_email = data['email'].strip().lower()
        existing_user = User.query.filter_by(email=new_email).first()
        if existing_user and existing_user.id != user.id:
            return jsonify({'message': 'Email is already registered.'}), 409
        user.email = new_email
    if 'password' in data and data['password'].strip():
        user.set_password(data['password'])

    db.session.commit()
    return jsonify({'user': user.to_dict()}), 200

@users_bp.route('/saved', methods=['GET'])
@jwt_required()
def saved_jobs():
    user_id = get_jwt_identity()
    saved_jobs = SavedJob.query.filter_by(user_id=user_id).all()
    return jsonify({'saved_jobs': [saved_job.to_dict() for saved_job in saved_jobs]}), 200

@users_bp.route('/saved/<int:job_id>', methods=['POST'])
@jwt_required()
def save_job(job_id):
    user_id = get_jwt_identity()
    existing = SavedJob.query.filter_by(user_id=user_id, job_id=job_id).first()
    if existing:
        return jsonify({'message': 'Job already saved.'}), 409
    saved_job = SavedJob(user_id=user_id, job_id=job_id)
    db.session.add(saved_job)
    db.session.commit()
    return jsonify({'saved_job': saved_job.to_dict()}), 201

@users_bp.route('/saved/<int:job_id>', methods=['DELETE'])
@jwt_required()
def remove_saved_job(job_id):
    user_id = get_jwt_identity()
    saved_job = SavedJob.query.filter_by(user_id=user_id, job_id=job_id).first_or_404()
    db.session.delete(saved_job)
    db.session.commit()
    return jsonify({'message': 'Saved job removed.'}), 200
