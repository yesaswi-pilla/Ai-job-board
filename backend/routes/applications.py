from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend import db
from backend.models.application import Application
from backend.models.job import Job
from backend.models.user import User
from backend.models.notification import Notification

applications_bp = Blueprint('applications', __name__)

@applications_bp.route('/', methods=['POST'])
@jwt_required()
def create_application():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    if user.role != 'job_seeker':
        return jsonify({'message': 'Only candidates can submit applications.'}), 403

    data = request.get_json() or {}
    job_id = data.get('job_id')
    resume_url = data.get('resume_url', '').strip()
    cover_letter = data.get('cover_letter', '').strip()

    if not job_id or not resume_url or not cover_letter:
        return jsonify({'message': 'Job, resume and cover letter are required.'}), 400

    job = Job.query.get(job_id)
    if not job:
        return jsonify({'message': 'Job not found.'}), 404

    existing = Application.query.filter_by(candidate_id=user_id, job_id=job_id).first()
    if existing:
        return jsonify({'message': 'Application already submitted for this job.'}), 409

    application = Application(candidate_id=user_id, job_id=job_id, resume_url=resume_url, cover_letter=cover_letter)
    db.session.add(application)
    db.session.commit()

    notification = Notification(user_id=job.company.owner_id, message=f'New applicant for {job.title}')
    db.session.add(notification)
    db.session.commit()

    return jsonify({'application': application.to_dict()}), 201

@applications_bp.route('/user', methods=['GET'])
@jwt_required()
def list_user_applications():
    user_id = get_jwt_identity()
    applications = Application.query.filter_by(candidate_id=user_id).all()
    return jsonify({'applications': [application.to_dict() for application in applications]}), 200

@applications_bp.route('/job/<int:job_id>', methods=['GET'])
@jwt_required()
def list_job_applications(job_id):
    user_id = get_jwt_identity()
    job = Job.query.get_or_404(job_id)
    if job.company.owner_id != user_id:
        return jsonify({'message': 'You are not authorized to view these applications.'}), 403
    applications = Application.query.filter_by(job_id=job_id).all()
    return jsonify({'applications': [application.to_dict() for application in applications]}), 200

@applications_bp.route('/<int:application_id>', methods=['PUT'])
@jwt_required()
def update_application(application_id):
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    application = Application.query.get_or_404(application_id)

    job = Job.query.get_or_404(application.job_id)
    data = request.get_json() or {}

    if 'status' in data:
        if job.company.owner_id != user_id:
            return jsonify({'message': 'Only the employer can update application status.'}), 403
        application.status = data['status']
    if 'cover_letter' in data:
        if application.candidate_id != user_id:
            return jsonify({'message': 'Only the applicant can update the cover letter.'}), 403
        application.cover_letter = data['cover_letter']

    db.session.commit()
    return jsonify({'application': application.to_dict()}), 200

@applications_bp.route('/<int:application_id>', methods=['DELETE'])
@jwt_required()
def delete_application(application_id):
    user_id = get_jwt_identity()
    application = Application.query.get_or_404(application_id)
    if application.candidate_id != user_id:
        return jsonify({'message': 'Only the candidate can withdraw this application.'}), 403
    db.session.delete(application)
    db.session.commit()
    return jsonify({'message': 'Application withdrawn.'}), 200
