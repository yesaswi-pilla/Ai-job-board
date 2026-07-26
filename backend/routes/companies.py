from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend import db
from backend.models.company import Company
from backend.models.job import Job
from backend.models.user import User

companies_bp = Blueprint('companies', __name__)

@companies_bp.route('/', methods=['GET'])
def list_companies():
    companies = Company.query.all()
    return jsonify({'companies': [company.to_dict() for company in companies]}), 200

@companies_bp.route('/mine', methods=['GET'])
@jwt_required()
def list_my_companies():
    user_id = get_jwt_identity()
    companies = Company.query.filter_by(owner_id=user_id).all()
    return jsonify({'companies': [company.to_dict() for company in companies]}), 200

@companies_bp.route('/<int:company_id>', methods=['GET'])
def get_company(company_id):
    company = Company.query.get_or_404(company_id)
    jobs = Job.query.filter_by(company_id=company.id, status='open').all()
    return jsonify({'company': company.to_dict(), 'jobs': [job.to_dict() for job in jobs]}), 200

@companies_bp.route('/', methods=['POST'])
@jwt_required()
def create_company():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    if user.role != 'employer':
        return jsonify({'message': 'Only employer accounts can create companies.'}), 403

    data = request.get_json() or {}
    required_fields = ['name', 'description', 'industry', 'website', 'location', 'employee_count']
    missing = [field for field in required_fields if not data.get(field)]
    if missing:
        return jsonify({'message': f"Missing required fields: {', '.join(missing)}"}), 400

    company = Company(
        name=data['name'].strip(),
        description=data['description'].strip(),
        industry=data['industry'].strip(),
        website=data['website'].strip(),
        location=data['location'].strip(),
        logo_url=data.get('logo_url', '').strip(),
        employee_count=int(data['employee_count']),
        owner_id=user.id,
    )
    db.session.add(company)
    db.session.commit()
    return jsonify({'company': company.to_dict()}), 201
