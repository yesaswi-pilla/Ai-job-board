from backend import db
from datetime import datetime

class Company(db.Model):
    __tablename__ = 'companies'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    industry = db.Column(db.String(120), nullable=False)
    website = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(150), nullable=False)
    logo_url = db.Column(db.String(255), nullable=True)
    employee_count = db.Column(db.Integer, nullable=False, default=1)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    owner = db.relationship('User', back_populates='companies', lazy=True)
    jobs = db.relationship('Job', back_populates='company', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'industry': self.industry,
            'website': self.website,
            'location': self.location,
            'logo_url': self.logo_url,
            'employee_count': self.employee_count,
            'owner_id': self.owner_id,
        }
