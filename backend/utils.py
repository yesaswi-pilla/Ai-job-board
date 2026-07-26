import os
from werkzeug.utils import secure_filename
from uuid import uuid4

ALLOWED_EXTENSIONS = {'pdf'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def save_resume(file_storage, upload_folder):
    filename = secure_filename(file_storage.filename)
    unique_name = f"{uuid4().hex}_{filename}"
    os.makedirs(upload_folder, exist_ok=True)
    path = os.path.join(upload_folder, unique_name)
    file_storage.save(path)
    return unique_name
