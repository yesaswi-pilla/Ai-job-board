import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'super-secret')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///dev.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', 'uploads')

# Allow API endpoints to work with and without trailing slashes.
app.url_map.strict_slashes = False

frontend_origin = os.getenv('FRONTEND_ORIGIN', 'http://127.0.0.1:4173')
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": frontend_origin}, r"/uploads/*": {"origins": frontend_origin}})
jwt = JWTManager(app)
db = SQLAlchemy(app)
