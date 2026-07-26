from flask import send_from_directory
from backend import app, db
from backend.routes.auth import auth_bp
from backend.routes.jobs import jobs_bp
from backend.routes.companies import companies_bp
from backend.routes.applications import applications_bp
from backend.routes.users import users_bp
from backend.routes.saved_jobs import saved_jobs_bp
from backend.routes.notifications import notifications_bp
from backend.routes.categories import categories_bp
from backend.routes.uploads import uploads_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
app.register_blueprint(companies_bp, url_prefix='/api/companies')
app.register_blueprint(applications_bp, url_prefix='/api/applications')
app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(saved_jobs_bp, url_prefix='/api/saved-jobs')
app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
app.register_blueprint(categories_bp, url_prefix='/api/categories')
app.register_blueprint(uploads_bp, url_prefix='/api/uploads')

@app.route('/uploads/<path:filename>', methods=['GET'])
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

with app.app_context():
    import backend.models
    from backend.models.category import Category
    from backend.models.company import Company
    from backend.models.job import Job
    from backend.models.user import User
    from backend.models.application import Application
    from backend.models.saved_job import SavedJob
    from backend.models.notification import Notification
    from datetime import date

    db.create_all()

    def remove_duplicate_jobs():
        duplicates = db.session.query(
            Job.title,
            Job.company_id,
            db.func.count(Job.id).label('count')
        ).group_by(Job.title, Job.company_id).having(db.func.count(Job.id) > 1).all()

        for title, company_id, _count in duplicates:
            duplicate_jobs = Job.query.filter_by(title=title, company_id=company_id).order_by(Job.id.asc()).all()
            jobs_to_remove = duplicate_jobs[1:]
            for duplicate_job in jobs_to_remove:
                db.session.delete(duplicate_job)
        if duplicates:
            db.session.commit()

    remove_duplicate_jobs()

    def seed_initial_data():
        existing_employer = User.query.filter_by(email='employer@aijobportal.com').first()
        existing_jobs = Job.query.count()
        if existing_employer and existing_jobs:
            return

        category_names = ['Artificial Intelligence', 'Product Management', 'Software Engineering', 'Data Science', 'Design']
        categories = []
        for name in category_names:
            category = Category.query.filter_by(name=name).first()
            if not category:
                category = Category(name=name)
                db.session.add(category)
            categories.append(category)
        db.session.commit()

        employer = existing_employer or User(name='AI Talent Scout', email='employer@aijobportal.com', role='employer')
        if not existing_employer:
            employer.set_password('Password123!')
            db.session.add(employer)

        candidate = User.query.filter_by(email='candidate@aijobportal.com').first()
        if not candidate:
            candidate = User(name='Priya Sharma', email='candidate@aijobportal.com', role='job_seeker')
            candidate.set_password('Password123!')
            db.session.add(candidate)

        db.session.commit()

        company = Company.query.filter_by(name='NexAI Labs').first()
        if not company:
            company = Company(
                name='NexAI Labs',
                description='Building intelligent systems that power enterprise AI workflows across customer engagement, automation, and insights.',
                industry='Artificial Intelligence',
                website='https://nexailabs.example.com',
                location='Bengaluru, India',
                logo_url='https://via.placeholder.com/120',
                employee_count=120,
                owner_id=employer.id,
            )
            db.session.add(company)
            db.session.commit()

        job_definitions = [
            {
                'title': 'AI Product Manager',
                'description': 'Lead product strategy for generative AI features across our hiring and talent workflows.',
                'responsibilities': 'Define product vision, prioritize roadmaps, and work cross-functionally with engineering, design, and growth teams.',
                'skills': 'product strategy,roadmapping,AI,stakeholder management',
                'benefits': 'Health insurance,Stock options,Flexible hours,Learning stipend',
                'salary': '₹25,00,000 - ₹35,00,000',
                'location': 'Bengaluru',
                'experience': '5+ years',
                'employment_type': 'Full-Time',
                'remote': False,
                'category_name': 'Artificial Intelligence',
            },
            {
                'title': 'Senior Machine Learning Engineer',
                'description': 'Build scalable ML pipelines and deliver production-ready models for recommendation and matching systems.',
                'responsibilities': 'Develop, deploy, and monitor ML models while collaborating with product and data teams to improve performance.',
                'skills': 'Python,TensorFlow,ML engineering,model deployment',
                'benefits': 'Remote-friendly,Performance bonus,Health coverage',
                'salary': '₹30,00,000 - ₹45,00,000',
                'location': 'Remote',
                'experience': '4+ years',
                'employment_type': 'Full-Time',
                'remote': True,
                'category_name': 'Data Science',
            },
            {
                'title': 'UX Designer - AI Experiences',
                'description': 'Design intuitive interfaces for AI-driven talent products, bridging human-centered design and data feedback loops.',
                'responsibilities': 'Create wireframes, prototypes, and user journeys while partnering with research and engineering teams.',
                'skills': 'UX design,prototyping,user research,Figma',
                'benefits': 'Flexible work,Wellness budget,Employee training',
                'salary': '₹18,00,000 - ₹24,00,000',
                'location': 'Mumbai',
                'experience': '3+ years',
                'employment_type': 'Full-Time',
                'remote': False,
                'category_name': 'Design',
            },
        ]

        for job_data in job_definitions:
            existing_job = Job.query.filter_by(title=job_data['title'], company_id=company.id).first()
            if existing_job:
                continue
            category = Category.query.filter_by(name=job_data['category_name']).first()
            if not category:
                continue
            job = Job(
                title=job_data['title'],
                description=job_data['description'],
                responsibilities=job_data['responsibilities'],
                skills=job_data['skills'],
                benefits=job_data['benefits'],
                salary=job_data['salary'],
                location=job_data['location'],
                experience=job_data['experience'],
                employment_type=job_data['employment_type'],
                remote=job_data['remote'],
                deadline=date.today(),
                company=company,
                category=category,
            )
            db.session.add(job)
        db.session.commit()

    seed_initial_data()

@app.errorhandler(404)
def not_found(error):
    return {'message': 'Resource not found'}, 404

@app.errorhandler(500)
def server_error(error):
    return {'message': 'Internal server error'}, 500

if __name__ == '__main__':
    app.run(debug=True)
