# AI Job Board Frontend

This frontend is a React + TypeScript + Vite single-page application for the AI Job Portal.

## Local development

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the frontend locally:
   ```bash
   npm run dev
   ```
3. Open in browser:
   - http://127.0.0.1:4173

## Lint and build

- Run ESLint: `npm run lint`
- Build production bundle: `npm run build`

## API backend

The frontend proxies `/api` requests to:
- http://127.0.0.1:5000

This is configured in `vite.config.ts`.
