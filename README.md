# AI Job Board

This repository contains a monorepo implementation of an AI Job Portal with a React + TypeScript frontend and a Flask backend.

## Contents

- `frontend/` — React + TypeScript + Vite frontend application
- `backend/` — Flask REST API backend with SQLite and JWT authentication
- `.github/workflows/deploy.yml` — GitHub Actions workflow for frontend CI/CD and Vercel deployment
- `AI_DOCUMENTATION.md` — project documentation generated for this AI task

## Local development

### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start frontend:
   ```bash
   npm run dev
   ```
3. Open:
   - http://127.0.0.1:4173

### Backend
1. Install Python dependencies:
   ```bash
   cd backend
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   ```
2. Copy `.env.example` to `.env` and set your secret values.
3. Start backend:
   ```bash
   python -m backend.app
   ```
4. API base URL:
   - http://127.0.0.1:5000

## Local hosts

- Frontend: `http://127.0.0.1:4173`
- Backend API: `http://127.0.0.1:5000`

## GitHub CI/CD

The workflow in `.github/workflows/deploy.yml` runs on pushes and pull requests to `main` and `master`. It:

1. Installs frontend dependencies
2. Lints and builds the frontend
3. Installs backend dependencies
4. Validates backend Python files
5. Deploys the frontend to Vercel using `amondnet/vercel-action`

## Vercel Deployment

The frontend deploys from the `frontend/` directory. Configure Vercel with:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

## Required GitHub secrets

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Notes

- The frontend proxies `/api` requests to `http://127.0.0.1:5000` in development.
- The backend runs on Flask and uses SQLite for the local database.
