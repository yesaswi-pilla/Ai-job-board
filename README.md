# AI Job Portal

A full-stack AI Job Portal that enables employers to post jobs and candidates to discover and apply for opportunities through a modern web interface. The application is designed with a production-style architecture using a React frontend, Flask REST API backend, PostgreSQL database, and cloud deployment.

---

## Live Demo

**Frontend (Vercel)**

```
[text](https://ai-job-board-73lre1b4z-yesaswi1.vercel.app/)
```

**Backend API (Render)**

```
[text](https://ai-job-board-kmw0.onrender.com)
```

**GIT URL**

```
[text](https://github.com/yesaswi-pilla/Ai-job-board.git)
```
---

# Project Overview

The AI Job Portal simulates a real-world recruitment platform where:

* Employers can register and manage job listings.
* Candidates can browse available positions.
* Users can authenticate securely.
* Candidates can apply for jobs using uploaded resumes.
* Companies and job categories are managed through REST APIs.
* Data is stored in PostgreSQL.

The project demonstrates modern full-stack development practices including authentication, REST API design, database integration, deployment, and responsive UI development.

---

# Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Role-based Access

### Candidate Features

* Browse Jobs
* Search Opportunities
* View Job Details
* Upload Resume
* Apply for Jobs
* Candidate Dashboard

### Employer Features

* Employer Dashboard
* Create Company
* Post Jobs
* Manage Job Listings

### Public Features

* Home Page
* Featured Jobs
* Company Profiles
* Job Categories

---

# Tech Stack

## Frontend

* React
* TypeScript
* Vite
* React Router
* Axios
* Tailwind CSS
* vercel

## Backend

* Python
* Flask
* Flask-JWT-Extended
* SQLAlchemy
* Render

## Database

* PostgreSQL

## Deployment

Frontend:

* Vercel

Backend:

* Render

---

# Project Structure

```
ai-job-board/

├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│
├── backend/
│   ├── app/
│   ├── routes/
│   ├── models/
│   ├── migrations/
│   ├── config.py
│   └── app.py
│
├── README.md
└── requirements.txt
```

---

# System Architecture

```
React (Vercel)

        │

        ▼

Flask REST API (Render)

        │

        ▼

PostgreSQL Database
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>

cd ai-job-board
```

---

## Backend

```bash
cd backend

python -m venv venv

source venv/bin/activate
```

Windows

```bash
venv\Scripts\activate
```

Install packages

```bash
pip install -r requirements.txt
```

Run

```bash
python app.py
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# Environment Variables

## Backend (.env)

```env
DATABASE_URL=your_database_url

JWT_SECRET_KEY=your_secret_key

FLASK_ENV=production
```

## Frontend (.env)

```env
VITE_API_URL=https://ai-job-board-kmw0.onrender.com
```

---

# REST API

## Authentication

```
POST /api/auth/register

POST /api/auth/login
```

## Jobs

```
GET /api/jobs

GET /api/jobs/:id

POST /api/jobs
```

## Companies

```
GET /api/companies

POST /api/companies
```

## Categories

```
GET /api/categories
```

---

# Deployment

## Frontend

Hosted on **Vercel**.

The frontend communicates with the deployed Flask backend through environment variables.

---

## Backend

Hosted on **Render**.

The backend exposes REST APIs consumed by the React frontend.


# Future Improvements

* Email Notifications
* Advanced Job Search
* Resume Parsing
* AI Job Recommendations
* Interview Scheduling
* Company Verification
* Saved Searches
* Admin Dashboard

---


# License

This project was developed as part of a technical assessment and is intended for educational and evaluation purposes.
