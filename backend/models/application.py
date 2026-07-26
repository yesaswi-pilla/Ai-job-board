from backend import db
from datetime import datetime

class Application(db.Model):
    __tablename__ = 'applications'

    id = db.Column(db.Integer, primary_key=True)
    cover_letter = db.Column(db.Text, nullable=False)
    resume_url = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(80), nullable=False, default='pending')
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)
    candidate_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)

    candidate = db.relationship('User', back_populates='applications', lazy=True)
    job = db.relationship('Job', back_populates='applications', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'cover_letter': self.cover_letter,
            'resume_url': self.resume_url,
            'status': self.status,
            'applied_at': self.applied_at.isoformat(),
            'candidate': self.candidate.to_dict() if self.candidate else None,
            'job': self.job.to_dict() if self.job else None,
        }
