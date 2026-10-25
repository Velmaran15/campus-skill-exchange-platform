# 🎓 Campus Skill Exchange Platform

A peer-to-peer skill sharing platform for campus students. Students can register as tutors or learners, list skills they want to teach or learn, request sessions, and chat in real time.

## Overview

Campus Skill Exchange connects students who want to teach a skill with students who want to learn it. Tutors create skill listings, learners browse and request sessions, tutors accept or reject requests, and both parties can complete and rate sessions. Real-time chat is available between conversation participants.

## Key Features

- **User registration & authentication** — JWT-based auth with role selection (tutor/learner)
- **Skill marketplace** — Tutors list skills; learners search and filter
- **Session requests** — Learners request sessions; tutors accept/reject; both mark complete
- **Ratings & reviews** — Completed sessions can be rated
- **Real-time chat** — Socket.IO-powered messaging between conversation participants, with JWT authentication and participant-only room access
- **Email notifications** — Nodemailer integration for registration and session updates
- **File uploads** — Multer-based profile and chat attachment uploads

## Technology Stack

### Backend (`backend/`)
- Express 5 + TypeScript
- MongoDB + Mongoose
- Socket.IO (real-time chat)
- JWT (jsonwebtoken) for authentication
- bcryptjs for password hashing
- Multer for file uploads
- Nodemailer for email

### Frontend (`cse-v4/`)
- React 18 + TypeScript + Vite
- Tailwind CSS
- Zustand (state management)
- Axios (HTTP client with JWT interceptor)
- React Router v6
- Socket.IO client
- Lucide React (icons)

## Repository Structure

```
skill-platform/
├── README.md                          <- this file
├── .gitignore
├── backend/                           <- Express + TypeScript API
│   ├── .env.example                   <- env variable template (copy to .env)
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── config/db.ts               <- MongoDB connection
│   │   ├── controllers/               <- route handlers
│   │   ├── middleware/                <- auth, upload, error handling
│   │   ├── models/                    <- Mongoose schemas
│   │   ├── routers/                   <- Express routes
│   │   ├── services/                  <- email service, templates
│   │   ├── socket/                    <- Socket.IO setup
│   │   ├── server.ts                  <- app entry point
│   │   └── utils/
│   └── uploads/                       <- user-uploaded files (gitignored)
├── cse-v4/                            <- React + Vite frontend
│   ├── README.md                      <- frontend-specific docs
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── api/                       <- Axios client + services
│       ├── components/
│       ├── pages/
│       ├── store/                     <- Zustand auth store
│       ├── types/
│       └── utils/
```

## Prerequisites

- Node.js (v18 or later recommended)
- npm
- MongoDB (local `mongodb://127.0.0.1:27017` or MongoDB Atlas)

## Local Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, email credentials, etc.
npm run dev        # ts-node-dev --respawn --transpile-only src/server.ts
```

The backend runs on `http://localhost:5000` by default.

### Frontend

```bash
cd cse-v4
npm install
npm run dev        # vite (http://localhost:5173, proxies /api to :5000)
npm run build      # tsc && vite build
```

The frontend proxies `/api` to `http://localhost:5000` via `vite.config.ts`.

## Environment Variables (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/your_db_name` |
| `JWT_SECRET` | Secret for signing JWT tokens | A long random string |
| `EMAIL_USER` | SMTP email username | `your_email@example.com` |
| `EMAIL_PASS` | SMTP email password | Your email password/app token |
| `CLIENT_URL` | Frontend URL (for email links) | `http://localhost:5173` |

A template is provided at `backend/.env.example`. Copy it to `.env` and fill in your values. **Never commit `.env`** — it is gitignored.

## MongoDB Configuration

- **Local development:** `mongodb://127.0.0.1:27017/your_db_name`
- **MongoDB Atlas:** Provide your Atlas connection string in `MONGO_URI`

The backend connects via Mongoose in `backend/src/config/db.ts`.

## Available Scripts

### Backend (`backend/package.json`)
- `npm run dev` — Start with `ts-node-dev` (auto-reload)

### Frontend (`cse-v4/package.json`)
- `npm run dev` — Start Vite dev server
- `npm run build` — TypeScript check + Vite production build
- `npm run preview` — Preview production build

**Note:** No test suite is configured in either package.json. There are no `test` scripts.

## Authentication & Socket.IO Security

- JWT tokens are issued on login/register and stored in `localStorage` (frontend) as `cse_token`
- Axios attaches `Authorization: Bearer <token>` to every API request
- Socket.IO connections require `auth.token` in the handshake; the server verifies the JWT before allowing connection
- `join_conversation` is restricted to conversation participants (tutor or learner) only
- Non-participants, invalid tokens, missing tokens, malformed IDs, and nonexistent conversations are all rejected
- The server derives user identity from the JWT, not from client-supplied payloads, preventing impersonation

## Current Limitations

- No automated test suite exists (no `test` scripts in either package.json)
- Frontend `tsc --noEmit` reports `TS5103: Invalid value for '--ignoreDeprecations'` due to a tsconfig value incompatible with the installed TypeScript version (pre-existing; `vite build` may still work)
- 24 user-uploaded image files were previously tracked in git history; they are now removed from tracking but remain in earlier commits
- Described as a functional prototype, not production-ready