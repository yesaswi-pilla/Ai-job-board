# AI Job Portal Documentation

## Project Overview

This repository contains an AI Job Portal application implemented as a monorepo with:

- `frontend/` — React + TypeScript + Vite SPA
- `backend/` — Flask + SQLite REST API
- `.github/workflows/deploy.yml` — GitHub Actions workflow for frontend CI/CD and Vercel deployment

The app supports:

- Candidate job browsing and saved jobs
- Employer job posting and company management
- User authentication via JWT
- Resume upload and application submission

## Local Hosts

- Frontend local URL: `http://127.0.0.1:4173`
- Backend API local URL: `http://127.0.0.1:5000`

## Frontend Setup

1. Navigate to `frontend`
2. Install packages:
   ```bash
   cd frontend
   npm install
   ```
3. Start frontend dev server:
   ```bash
   npm run dev
   ```
4. Run lint:
   ```bash
   npm run lint
   ```
5. Build for production:
   ```bash
   npm run build
   ```

## Backend Setup

1. Navigate to `backend`
2. Install Python dependencies:
   ```bash
   cd backend
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and customize secrets.
4. Start backend:
   ```bash
   python -m backend.app
   ```

## GitHub CI/CD Pipeline

The GitHub Actions workflow defined in `.github/workflows/deploy.yml` does the following on push to `main` or `master`:

- Checks out the repository
- Sets up Node.js and installs frontend dependencies
- Runs ESLint on `frontend/`
- Builds the frontend bundle
- Sets up Python and installs backend dependencies
- Validates backend Python files with `py_compile`
- Deploys the frontend to Vercel with the Vercel Action

### Required GitHub Secrets

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Vercel Deployment

This project deploys the frontend from the `frontend/` directory. The Vercel project should be configured with:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

If you want the backend to be available as a deployed API, you should migrate it to a hosted backend environment or connect it to a dedicated cloud service. Currently, this repository deploys the frontend only.

## Notes on Current Code

- The frontend proxy routes `/api` to `http://127.0.0.1:5000` for local development.
- The backend uses SQLite for development and seeds sample categories, users, companies, and jobs.
- `frontend/.eslintrc.cjs` provides lint configuration for React + TypeScript.
- `frontend/vercel.json` defines static build settings for Vercel.
