from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend import db
from backend.models.saved_job import SavedJob

saved_jobs_bp = Blueprint('saved_jobs', __name__)

@saved_jobs_bp.route('/', methods=['GET'])
@jwt_required()
def list_saved_jobs():
    user_id = get_jwt_identity()
    saved_jobs = SavedJob.query.filter_by(user_id=user_id).all()
    return jsonify({'saved_jobs': [saved_job.to_dict() for saved_job in saved_jobs]}), 200
