# AI Job Board

A simple AI-powered business app combining a jobs board and social feed. Built with Next.js for fast Vercel deployment and GitHub Actions-based CI/CD.

## Contents

- `app/` — Next.js app router pages and styles
- `.github/workflows/deploy.yml` — GitHub Actions workflow for build and Vercel deployment
- `README.md` — project overview and deployment instructions

## Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000

## GitHub CI/CD

The workflow in `.github/workflows/deploy.yml` runs on every push to `main` and does the following:

1. Installs dependencies
2. Builds the app
3. Deploys to Vercel using the official Vercel Action

## Vercel Deployment Setup

Create GitHub repository and add the following secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `VERCEL_PROJECT_NAME`

Then push the code to GitHub.

## Improvements

- Add a real backend or database
- Expand AI resume matching, candidate profiles, and chat features
- Share posts with comments and likes
