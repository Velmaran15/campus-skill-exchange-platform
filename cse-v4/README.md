# 🎓 Campus Skill Exchange — Frontend

A peer-to-peer skill sharing platform for campus students. Built with **React + TypeScript + Vite + Tailwind CSS + Zustand + Axios**.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
cd campus-skill-exchange
npm install
```

### 2. Configure API base URL
The Vite dev server proxies `/api` → `http://localhost:5000`.
If your backend runs on a different port, edit `vite.config.ts`:
```ts
proxy: {
  '/api': {
    target: 'http://localhost:YOUR_PORT',
    changeOrigin: true,
  },
},
```

### 3. Run the dev server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### 4. Build for production
```bash
npm run build
npm run preview
```

---

## 📁 Folder Structure

```
src/
├── api/
│   ├── client.ts          # Axios instance with JWT interceptor
│   └── services.ts        # All API service functions (auth, skills, tutors, sessions)
│
├── components/
│   ├── common/
│   │   ├── index.tsx      # Badge, Avatar, StarRating, Spinner, Empty, Card, Toast
│   │   └── Button.tsx     # Reusable button (primary / secondary / ghost / danger)
│   │   └── Input.tsx      # Input, Select, Textarea
│   ├── layout/
│   │   ├── Navbar.tsx     # Sticky top nav with auth state
│   │   └── ProtectedRoute.tsx  # Role-aware route guard
│   ├── tutor/
│   │   ├── TutorCard.tsx  # Skill card shown in search results
│   │   └── AddSkillModal.tsx   # Modal for tutors to add skills
│   ├── session/
│   │   └── SessionCard.tsx  # Session card with action buttons
│   └── rating/
│       └── RatingModal.tsx  # Star rating + feedback modal
│
├── pages/
│   ├── HomePage.tsx        # Landing page with hero + features
│   ├── LoginPage.tsx       # Login form
│   ├── RegisterPage.tsx    # Register form with role selector
│   ├── SearchPage.tsx      # Skill search with filters
│   ├── TutorProfilePage.tsx  # Tutor detail: skills + reviews
│   ├── TutorDashboard.tsx  # Tutor: manage session requests
│   ├── LearnerDashboard.tsx  # Learner: view & rate sessions
│   ├── TopTutorsPage.tsx   # Leaderboard of top 10 tutors
│   └── NotFoundPage.tsx    # 404
│
├── store/
│   └── authStore.ts        # Zustand auth store (token + user)
│
├── types/
│   └── index.ts            # All TypeScript interfaces
│
└── utils/
    └── helpers.ts          # formatDate, levelColor, statusColor, getInitials
```

---

## 🔌 API Endpoints Used

| Feature | Method | Endpoint |
|---------|--------|----------|
| Register | POST | `/api/auth/register` |
| Login | POST | `/api/auth/login` |
| Search skills | GET | `/api/skills/search` |
| Add skill | POST | `/api/skills` |
| Tutor profile | GET | `/api/tutors/:id` |
| Top tutors | GET | `/api/tutors/top` |
| Request session | POST | `/api/sessions/request` |
| Tutor sessions | GET | `/api/sessions/tutor` |
| Learner sessions | GET | `/api/sessions/learner` |
| Accept session | PATCH | `/api/sessions/:id/accept` |
| Reject session | PATCH | `/api/sessions/:id/reject` |
| Complete session | PATCH | `/api/sessions/:id/complete` |
| Rate session | POST | `/api/sessions/:id/rate` |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Font Display | Syne (headings, bold UI) |
| Font Body | DM Sans (body text) |
| Font Mono | JetBrains Mono (labels) |
| Primary | `#0D0D0D` (ink-900) |
| Accent | `#F5A623` (amber) |
| Success | `#2ECC71` (jade) |
| Danger | `#E74C3C` (coral) |

---

## 🔑 Auth Flow

1. User registers/logs in → receives JWT token + user object
2. Token stored in `localStorage` via Zustand (`cse_token`)
3. Axios interceptor attaches `Authorization: Bearer <token>` to every request
4. On 401 response → auto-logout + redirect to `/login`
5. `ProtectedRoute` guards dashboard pages by role

---

## 📦 Tech Stack

- **React 18** + **TypeScript**
- **Vite** — fast dev/build tooling
- **Tailwind CSS** — utility-first styling
- **Zustand** — lightweight global state
- **Axios** — HTTP client with interceptors
- **React Router v6** — client-side routing
- **Lucide React** — icon library
