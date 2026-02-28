# AI Agent Instructions for Blog CMS

This file gives concise, actionable guidance for AI coding agents working in this repository.

## Project Summary
- Full-stack Blog CMS: `frontend/` (Angular 17) and `backend/` (NestJS, TypeScript).
- Containerized via `docker-compose.yml` (frontend:4200, backend:3000).

## Code Style
- TypeScript with standard project layout. Follow patterns in `backend/src/` and `frontend/src/`.
- Prefer explicit types and small, focused functions. Match existing naming (e.g., `PostsService`, `DashboardComponent`).
- Keep changes minimal and local when possible; do not reformat unrelated files.

## Architecture
- `backend/src` contains modules: `auth/`, `posts/`, `categories/`. `main.ts` configures CORS and starts Nest.
- `frontend/src` uses Angular standalone components under `app/pages` and services in `app/services`.
- Data is in-memory (TypeScript `Map`) — persistence is intentionally omitted for development.

## Build & Run (commands agents will attempt)
- Start both services with Docker Compose:
  - `docker-compose up -d --build`
- Backend local run:
  - `cd backend && npm install && npm run start:dev` (port 3000)
- Frontend local run:
  - `cd frontend && npm install && npm start` (port 4200)

## Project Conventions
- Endpoints return an object: `{ success: boolean, data?: any, message?: string }`.
- Use `ApiService` in the frontend for fetch calls — it expects JSON and stores JWT in `localStorage`.
- Keep CORS changes in `backend/src/main.ts` and expose `FRONTEND_URLS` via env.

## Integration Points
- Docker Compose coordinates frontend and backend. See `docker-compose.yml` for env vars and health checks.
- JWT auth uses `POST /auth/login` (body: `{ username, password }`). There is no GET login route.

## Security Notes
- Default admin credentials are `admin` / `admin` for development only.
- Secrets live in `backend/.env` (not checked into version control in production). Do not hardcode new secrets.

## When Editing
- Run tests or start both services locally to verify behavior when you change endpoints or CORS.
- If you modify a public API shape, update both backend controller responses and any frontend calls in `ApiService`.

If anything here is unclear or you need additional conventions, ask and I will update this file.
