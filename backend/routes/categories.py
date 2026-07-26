from flask import Blueprint, jsonify
from backend.models.category import Category

categories_bp = Blueprint('categories', __name__)

@categories_bp.route('/', methods=['GET'])
def list_categories():
    categories = Category.query.order_by(Category.name.asc()).all()
    return jsonify({'categories': [category.to_dict() for category in categories]}), 200
