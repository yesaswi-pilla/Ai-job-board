from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models.job import Job
from backend.models.category import Category
from backend.models.company import Company
from backend import db
from datetime import datetime

jobs_bp = Blueprint('jobs', __name__)

@jobs_bp.route('/', methods=['GET'])
def list_jobs():
    query = Job.query.filter_by(status='open')
    keyword = request.args.get('keyword', '').strip()
    company = request.args.get('company', '').strip()
    company_id = request.args.get('company_id', '').strip()
    owner_id = request.args.get('owner_id', '').strip()
    location = request.args.get('location', '').strip()
    category = request.args.get('category', '').strip()
    experience = request.args.get('experience', '').strip()
    employment_type = request.args.get('employment_type', '').strip()
    remote = request.args.get('remote', '').strip()
    min_salary = request.args.get('min_salary', '').strip()
    max_salary = request.args.get('max_salary', '').strip()
    sort = request.args.get('sort', 'newest')
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 12))

    if keyword:
        query = query.outerjoin(Company).outerjoin(Category).filter(
            Job.title.ilike(f'%{keyword}%') |
            Job.description.ilike(f'%{keyword}%') |
            Job.responsibilities.ilike(f'%{keyword}%') |
            Job.skills.ilike(f'%{keyword}%') |
            Job.location.ilike(f'%{keyword}%') |
            Job.experience.ilike(f'%{keyword}%') |
            Job.employment_type.ilike(f'%{keyword}%') |
            Company.name.ilike(f'%{keyword}%') |
            Category.name.ilike(f'%{keyword}%')
        )
    if company:
        query = query.join(Company).filter(Company.name.ilike(f'%{company}%'))
    if company_id and company_id.isdigit():
        query = query.filter(Job.company_id == int(company_id))
    if owner_id and owner_id.isdigit():
        query = query.join(Company).filter(Company.owner_id == int(owner_id))
    if location:
        query = query.filter(Job.location.ilike(f'%{location}%'))
    if category:
        query = query.join(Category).filter(Category.name.ilike(f'%{category}%'))
    if experience:
        query = query.filter(Job.experience.ilike(f'%{experience}%'))
    if employment_type:
        query = query.filter(Job.employment_type.ilike(f'%{employment_type}%'))
    if remote:
        if remote.lower() == 'remote':
            query = query.filter_by(remote=True)
        elif remote.lower() == 'onsite':
            query = query.filter_by(remote=False)
        elif remote.lower() == 'hybrid':
            query = query.filter(Job.employment_type.ilike('%hybrid%'))
    if min_salary or max_salary:
        def salary_value(salary_text):
            try:
                numeric = ''.join([c for c in salary_text if c.isdigit() or c == '.'])
                return float(numeric) if numeric else 0
            except Exception:
                return 0

        salary_jobs = []
        for job in query.all():
            value = salary_value(job.salary)
            if min_salary and value < float(min_salary):
                continue
            if max_salary and value > float(max_salary):
                continue
            salary_jobs.append(job)
        query = db.session.query(Job).filter(Job.id.in_([job.id for job in salary_jobs]))

    if sort == 'salary':
        query = query.order_by(Job.salary.asc())
    elif sort == 'alphabetical':
        query = query.order_by(Job.title.asc())
    else:
        query = query.order_by(Job.posted_date.desc())

    total = query.count()
    jobs = query.offset((page - 1) * page_size).limit(page_size).all()
    return jsonify({
        'jobs': [job.to_dict() for job in jobs],
        'pagination': {
            'page': page,
            'page_size': page_size,
            'total': total,
        }
    }), 200

@jobs_bp.route('/<int:job_id>', methods=['GET'])
def get_job(job_id):
    job = Job.query.get_or_404(job_id)
    return jsonify({'job': job.to_dict()}), 200

@jobs_bp.route('/', methods=['POST'])
@jwt_required()
def create_job():
    user_id = get_jwt_identity()
    company_id = request.json.get('company_id')
    company = Company.query.get(company_id)
    if not company:
        return jsonify({'message': 'Invalid company selected.'}), 400
    if company.owner_id != user_id:
        return jsonify({'message': 'You are not authorized to post jobs for this company.'}), 403

    data = request.get_json() or {}
    required_fields = ['title', 'description', 'responsibilities', 'skills', 'salary', 'location', 'experience', 'employment_type', 'deadline', 'company_id', 'category_id']

    missing = [field for field in required_fields if not data.get(field)]
    if missing:
        return jsonify({'message': f'Missing required fields: {", ".join(missing)}'}), 400

    category = Category.query.get(data['category_id'])
    if not category:
        return jsonify({'message': 'Invalid category.'}), 400

    job = Job(
        title=data['title'].strip(),
        description=data['description'].strip(),
        responsibilities=data['responsibilities'].strip(),
        skills=','.join([skill.strip() for skill in data['skills']]) if isinstance(data['skills'], list) else data['skills'],
        benefits=','.join([benefit.strip() for benefit in data.get('benefits', [])]) if isinstance(data.get('benefits', []), list) else data.get('benefits', ''),
        salary=data['salary'].strip(),
        location=data['location'].strip(),
        experience=data['experience'].strip(),
        employment_type=data['employment_type'].strip(),
        remote=data.get('remote', False),
        deadline=datetime.fromisoformat(data['deadline']).date(),
        company=company,
        category=category,
    )

    db.session.add(job)
    db.session.commit()
    return jsonify({'job': job.to_dict()}), 201

@jobs_bp.route('/<int:job_id>', methods=['PUT'])
@jwt_required()
def update_job(job_id):
    user_id = get_jwt_identity()
    job = Job.query.get_or_404(job_id)
    if job.company.owner_id != user_id:
        return jsonify({'message': 'You are not authorized to update this job.'}), 403

    data = request.get_json() or {}
    for field in ['title', 'description', 'responsibilities', 'skills', 'benefits', 'salary', 'location', 'experience', 'employment_type', 'remote', 'status']:
        if field in data:
            setattr(job, field, ','.join(data[field]) if field in ['skills', 'benefits'] and isinstance(data[field], list) else data[field])
    if 'deadline' in data:
        job.deadline = datetime.fromisoformat(data['deadline']).date()
    if 'company_id' in data:
        company = Company.query.get(data['company_id'])
        if company and company.owner_id == user_id:
            job.company = company
        else:
            return jsonify({'message': 'Invalid or unauthorized company selection.'}), 403
    if 'category_id' in data:
        category = Category.query.get(data['category_id'])
        if category:
            job.category = category
        else:
            return jsonify({'message': 'Invalid category selection.'}), 400

    db.session.commit()
    return jsonify({'job': job.to_dict()}), 200

@jobs_bp.route('/<int:job_id>', methods=['DELETE'])
@jwt_required()
def delete_job(job_id):
    user_id = get_jwt_identity()
    job = Job.query.get_or_404(job_id)
    if job.company.owner_id != user_id:
        return jsonify({'message': 'You are not authorized to delete this job.'}), 403
    db.session.delete(job)
    db.session.commit()
    return jsonify({'message': 'Job removed successfully.'}), 200
