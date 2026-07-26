from backend import db
from datetime import datetime

class Job(db.Model):
    __tablename__ = 'jobs'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    responsibilities = db.Column(db.Text, nullable=False)
    skills = db.Column(db.Text, nullable=False)
    benefits = db.Column(db.Text, nullable=True)
    salary = db.Column(db.String(120), nullable=False)
    location = db.Column(db.String(150), nullable=False)
    experience = db.Column(db.String(80), nullable=False)
    employment_type = db.Column(db.String(80), nullable=False)
    remote = db.Column(db.Boolean, nullable=False, default=False)
    deadline = db.Column(db.Date, nullable=False)
    posted_date = db.Column(db.Date, default=datetime.utcnow)
    status = db.Column(db.String(60), nullable=False, default='open')
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)

    company = db.relationship('Company', back_populates='jobs', lazy=True)
    category = db.relationship('Category', back_populates='jobs', lazy=True)
    applications = db.relationship('Application', back_populates='job', lazy=True)
    saved_jobs = db.relationship('SavedJob', back_populates='job', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'responsibilities': self.responsibilities,
            'skills': self.skills.split(',') if self.skills else [],
            'benefits': self.benefits.split(',') if self.benefits else [],
            'salary': self.salary,
            'location': self.location,
            'experience': self.experience,
            'employment_type': self.employment_type,
            'remote': self.remote,
            'deadline': self.deadline.isoformat() if self.deadline else None,
            'posted_date': self.posted_date.isoformat() if self.posted_date else None,
            'status': self.status,
            'company': self.company.to_dict() if self.company else None,
            'category': self.category.to_dict() if self.category else None,
            'applicant_count': len(self.applications),
        }
