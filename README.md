# School Management System — Clone & Run Guide

This repository is a full-stack Student Management System (Node/Express backend + React/Vite frontend).

Minimum requirements
- Node.js 18+ and npm
- MySQL server (local or remote)

Quick start — clone and run
1. Clone the repository:

```bash
git clone https://github.com/Jake-Ab/school-management-system.git
cd school-management-system
```

2. Backend

```bash
cd backend
npm install
# Create a `.env` in the backend folder (example below)
# Start the backend (uses nodemon):
npm run start
```

Create `backend/.env` with at minimum the following values (adjust for your environment):

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=school_management
PORT=8081
JWT_SECRET=replace_with_a_secure_secret
```

The backend will initialize the database and create the necessary tables automatically on first run.

Seed an admin user
1. In a separate terminal (while backend is running):

```bash
cd backend
node create-admin.js
```

This posts to the `/api/auth/register` endpoint and attempts to create an `admin` user with password `password123`.

3. Frontend

```bash
cd frontend/frontend
npm install
npm run dev
```

Open the URL printed by Vite (typically `http://localhost:5173`).

Common ports
- Backend: `http://localhost:8081` (configurable via `PORT` in `backend/.env`)
- Frontend: `http://localhost:5173` (Vite default)

Auth & testing notes
- Log in using the seeded credentials: username `admin`, password `password123`.
- Many endpoints require the JWT Bearer token returned by `/api/auth/login`.
- Use Postman/Thunder Client/cURL for API testing at `http://localhost:8081/api/...`.

Troubleshooting
- If the backend reports database connection errors, ensure MySQL is running and your `backend/.env` credentials are correct.
- To reset the schema: drop the `school_management` database from your MySQL server and restart the backend — the server recreates the schema.



