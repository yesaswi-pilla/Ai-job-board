from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from backend.utils import allowed_file, save_resume
import os

uploads_bp = Blueprint('uploads', __name__)

@uploads_bp.route('/resume', methods=['POST'])
@jwt_required()
def upload_resume():
    if 'resume' not in request.files:
        return jsonify({'message': 'No resume file provided.'}), 400

    resume = request.files['resume']
    if resume.filename == '':
        return jsonify({'message': 'No selected file.'}), 400

    if not allowed_file(resume.filename):
        return jsonify({'message': 'Only PDF files are allowed.'}), 400

    upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
    filename = save_resume(resume, upload_folder)
    resume_url = f"/uploads/{filename}"
    return jsonify({'resume_url': resume_url}), 201
