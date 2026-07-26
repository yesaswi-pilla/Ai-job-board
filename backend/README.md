# AI Job Board Backend

This backend is a Flask API supporting authentication, jobs, companies, applications, saved jobs, and uploads.

## Local development

1. Create a Python environment and activate it.
2. Install dependencies:
   ```bash
   cd backend
   python -m pip install -r requirements.txt
   ```
3. Create or update `.env` from `.env.example`.
4. Start the backend locally:
   ```bash
   python -m backend.app
   ```
5. Open the API root at:
   - http://127.0.0.1:5000

## Environment variables

Required variables in `.env`:

- `SECRET_KEY`
- `JWT_SECRET_KEY`
- `DATABASE_URL`
- `UPLOAD_FOLDER` (optional, defaults to `uploads`)

## Local hosts used by the project

- Frontend: http://127.0.0.1:4173
- Backend API: http://127.0.0.1:5000

## Notes

The frontend is configured to proxy `/api` requests to the Flask backend.
