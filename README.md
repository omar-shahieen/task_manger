# Task Manager (Technical Assessment)

A full-stack Task Management Application built with Node.js/Express (backend), React + Vite (frontend), PostgreSQL (database), and Tailwind CSS for styling.

## Quick Overview

- Backend: Express + PostgreSQL + JWT auth
- Frontend: Vite + React + Tailwind CSS

## Folder Structure

- `/backend` - Express API server
- `/frontend` - React app

---

## Setup

Prerequisites:

- Node.js (v16+)
- PostgreSQL

1. Clone repository and install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

2. Environment variables

- Copy `.env.example` to `.env` in `/backend` and update DB connection and JWT secret.

3. Database migration

- Either run the SQL file using `psql` or use the included migrate script:

```bash
# from backend folder
node migrate.js
```

4. Run services

Backend (dev):

```bash
cd backend
npm run dev
```

Frontend (dev):

```bash
cd frontend
npm run dev
```

---

## API Endpoints

- POST `/auth/register` - Register a new user
- POST `/auth/login` - Login and receive JWT
- GET `/tasks` - Get tasks for the logged-in user
- POST `/tasks` - Create a new task
- PUT `/tasks/:id` - Update a task (only if owner)
- DELETE `/tasks/:id` - Delete a task (only if owner)

See backend README for more details.

---

## Assumptions & Notes ⚠️

- Uses JWT for auth stored in `localStorage` on the client. (In production consider HttpOnly cookies.)
- Passwords are hashed with `bcrypt` and never returned from the API.
- Migrations are simple SQL files and executed by the included `migrate.js` script.
- Error messages are minimal for clarity (expand validation as needed).

---

## How to Test 🧪

1. Register a user via `/auth/register`.
2. Save the returned JWT token in the client (the frontend does this automatically in `localStorage`).
3. Use the Dashboard to create, update, and delete tasks. All changes are scoped to the logged-in user.

---

If you want, I can: add unit/integration tests, expand request validation, or add a Docker deployment. Let me know which you'd like next.

---

## Run & Verify ✅

1. Start PostgreSQL and ensure `DATABASE_URL` is set correctly in `backend/.env`.
2. Run migrations: `cd backend && npm run migrate`.
3. Start backend: `npm run dev` and frontend: `cd ../frontend && npm run dev`.
4. Open the frontend in your browser (Vite usually exposes it at `http://localhost:5173`).

If anything fails, check terminal logs (backend & frontend). Common fixes: ensure ports are free and DB credentials are correct.
