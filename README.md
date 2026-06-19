# Elevate Your English — Campus LMS

A full-stack Learning Management System (LMS) built as a portfolio project. It demonstrates role-based access control, nested resource management, an assessment engine with attempt tracking, and progress monitoring — all wired to a real REST API with no mocking.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Roles & Permissions](#roles--permissions)
- [User Journey](#user-journey)
- [Technical Highlights](#technical-highlights)
- [Project Structure](#project-structure)
- [Technical Decisions](#technical-decisions)
- [How to Run](#how-to-run)
- [Seed Credentials](#seed-credentials)
- [API Reference Summary](#api-reference-summary)

---

## Overview

Elevate Your English Campus is a platform for managing English-learning courses. It supports three user roles (admin, teacher, student), a full LMS content hierarchy (courses → units → lessons), an assessment engine per unit, and per-student progress tracking.

The project was built file by file, with each API contract verified against the live backend before implementation — no assumptions, no mocking.

---

## Architecture

```
┌────────────────────────────────────────────────────────────┐
│                        Browser                             │
│                                                            │
│  Next.js 16 (App Router) — React 19 — CSS Modules         │
│  Port 3000                                                 │
└────────────────────┬───────────────────────────────────────┘
                     │  HTTP / JSON  (Authorization: Bearer)
┌────────────────────▼───────────────────────────────────────┐
│                    Express API                             │
│                                                            │
│  Node.js — Express 4 — JWT — express-validator             │
│  Port 4000                                                 │
│                                                            │
│  Modules: auth · users · courses · units · lessons         │
│           enrollments · progress · assessments             │
│           bookings · availability                          │
└────────────────────┬───────────────────────────────────────┘
                     │  Mongoose ODM
┌────────────────────▼───────────────────────────────────────┐
│                    MongoDB                                 │
│  Collections: users · courses · units · lessons            │
│               enrollments · lessonProgress                 │
│               assessments · assessmentAttempts             │
└────────────────────────────────────────────────────────────┘
```

### Frontend layers

```
src/
├── app/
│   ├── (auth)/login/          — Public login page
│   └── (protected)/           — Route group with auth guard
│       ├── layout.js          — Sidebar + Navbar shell
│       ├── dashboard/
│       ├── courses/[id]/
│       │   └── units/[unitId]/lessons/[lessonId]/
│       ├── assessments/
│       ├── progress/
│       ├── enrollments/
│       └── users/
├── components/
│   ├── auth/LoginForm/
│   └── layout/Sidebar/ · Navbar/
├── core/context/AuthContext/  — Global auth state
├── hooks/
│   ├── useAuth.js             — Context consumer with guard
│   └── useProtectedRoute.js   — Client-side route protection
├── lib/
│   ├── api.js                 — Generic fetch wrapper
│   ├── resolvers.js           — Frontend join layer
│   └── services/              — One service file per resource
└── styles/                    — CSS Modules, one per component
```

---

## Roles & Permissions

| Capability | Admin | Teacher | Student |
|---|:---:|:---:|:---:|
| View all users | ✓ | — | — |
| Activate / deactivate users | ✓ | — | — |
| View all enrollments | ✓ | — | — |
| Activate / suspend enrollments | ✓ | — | — |
| View courses | ✓ | ✓ | ✓ (published only) |
| View units & lessons | ✓ | ✓ | ✓ |
| Access lesson content | ✓ | ✓ | ✓ (if not locked) |
| View assessments | ✓ | ✓ | ✓ (lessons must be completed) |
| Submit assessment attempt | — | — | ✓ |
| View progress overview | — | — | ✓ |
| Sidebar: Users link | ✓ | — | — |

Lessons for students are **sequentially locked** — a student cannot access lesson N+1 until lesson N is marked as completed. The assessment for a unit is only available after all its lessons are completed.

---

## User Journey

```
Login
  └─▶ Dashboard  (greeting + session summary)
        └─▶ Courses  (list of available courses)
              └─▶ Course Detail  (units + lessons per unit)
                    └─▶ Lesson Detail  (content or video)
                          │
                          ▼ (after all lessons in unit completed)
                    Assessment  (quiz with radio buttons)
                          └─▶ Result  (score + passed/failed)
                                └─▶ Previous Attempts  (history table)
                          │
                          ▼
                    Progress  (per-course progress bar + lesson count)
```

**Step by step:**

1. **Login** — student enters email + password. JWT is stored in React state (no localStorage). On success, redirected to `/dashboard`.
2. **Dashboard** — shows name, email, role. Quick summary cards.
3. **Courses** — table of courses with status badges (draft / published / archived). Click a course title to drill down.
4. **Course Detail** — lists units in order. Each unit expands its lessons. Lessons are rendered as clickable links.
5. **Lesson Detail** — shows title, type badge (text / video), order, unit ID, and content. Video lessons render an iframe.
6. **Assessment** — once lessons are completed, the student accesses the unit's exam. Radio-button quiz. Submit sends `{ answers: [idx, idx, ...] }`. Result shows score and pass/fail.
7. **Previous Attempts** — displayed below the exam form. Shows attempt number, score, result badge, and submission date. Once `maxAttempts` is reached, the form is disabled with a "Maximum attempts reached" notice.
8. **Progress** — card per enrolled course showing overall % bar, completed lessons count, and total lessons.

---

## Technical Highlights

### JWT Authentication

The backend issues a signed JWT on login (`POST /auth/login`). The frontend stores it in React state via `AuthContext` — no `localStorage`, no cookies. Every authenticated request sends `Authorization: Bearer <token>` via the generic `api.js` wrapper.

Session is lost on page refresh by design (stateless demo scope). A refresh-token flow or `sessionStorage` persistence would be the natural next step.

### Role-Based Access Control

RBAC is enforced at two levels:

- **Backend**: middleware (`adminOnly`, `verifyToken`) blocks unauthorized requests before they reach controllers.
- **Frontend**: `useProtectedRoute()` redirects unauthenticated users to `/login` on mount. The Sidebar conditionally renders the `Users` link only for `admin`. The `buildUserMap` resolver is only called when `user.role === 'admin'` (non-admins cannot access `GET /users`).

### Nested LMS Structure

Content is hierarchical: `Course → Unit → Lesson`. API routes reflect this nesting:

```
GET /courses/:courseId/units
GET /courses/:courseId/units/:unitId/lessons
GET /courses/:courseId/units/:unitId/lessons/:lessonId
GET /courses/:courseId/units/:unitId/assessment
POST /courses/:courseId/units/:unitId/assessment/attempts
```

The Course Detail page loads units first, then fires parallel `getLessonsByUnit` calls for all units simultaneously using `Promise.all`-equivalent fan-out in a `useEffect` triggered by the `units` state change.

### Assessment Engine with Attempts

Each unit has at most one assessment. The assessment stores questions with `correctIndex` server-side; the field is **excluded from the GET response** (students never see the answer). On `POST .../attempts`, the backend:

1. Verifies active enrollment.
2. Verifies all unit lessons are completed.
3. Checks `attemptCount < maxAttempts`.
4. Loads the assessment with `correctIndex` (internal only).
5. Scores each answer, computes `score = (correct / total) * 100`.
6. Persists an immutable `AssessmentAttempt` document.
7. Returns `{ attempt: { score, passed, attemptNumber } }`.

The submit payload is simply `{ answers: [0, 1, 0, ...] }` — one integer index per question in order.

### Progress Tracking

`GET /progress/overview` (student-only) returns:

```json
{
  "overview": [
    {
      "enrollmentId": "...",
      "courseId": "...",
      "overallProgress": 50,
      "completedLessons": 2,
      "totalLessons": 4
    }
  ]
}
```

`courseId` is a raw ObjectId — not joined server-side. The frontend resolves it via `buildCourseMap` (see Resolvers below).

---

## Project Structure

### Backend modules

```
src/modules/
├── auth/          — login, logout, token verification
├── users/         — CRUD + activate/deactivate
├── courses/       — CRUD + status lifecycle (draft → published → archived)
├── units/         — nested under courses
├── lessons/       — nested under units, sequential locking for students
├── enrollments/   — enroll, activate, suspend
├── progress/      — per-lesson completion + overview
├── assessments/   — quiz CRUD + attempt submission + attempt history
├── bookings/      — teacher session bookings (out of LMS scope)
└── availability/  — teacher availability slots (out of LMS scope)
```

Each module follows the same structure: `routes → controller → service → repository`.

### Frontend services

```
src/lib/services/
├── auth.service.js
├── courses.service.js
├── units.service.js
├── lessons.service.js
├── enrollments.service.js
├── progress.service.js
├── users.service.js
└── assessments.service.js
```

Each service is a plain object with methods that call `api.js`. No class instantiation, no state.

---

## Technical Decisions

### Generic API wrapper (`api.js`)

All HTTP calls go through a single `request()` function that:
- Attaches `Content-Type: application/json`.
- Attaches `Authorization: Bearer <token>` when provided.
- Parses the JSON response.
- Throws a typed `Error` with `data.message` on non-2xx responses.

This means every service is just a thin layer of named URLs — error handling and auth headers are not repeated.

### Resolvers layer (`lib/resolvers.js`)

The backend returns raw ObjectIds for cross-resource references (e.g., `courseId` in progress, `studentId` and `courseId` in enrollments). Rather than requesting population from the backend or duplicating fetch logic in each page, the frontend has two resolver functions:

```js
buildCourseMap(token)  // → { [courseId]: courseTitle }
buildUserMap(token)    // → { [userId]: "First Last" }
```

Pages that need human-readable names call these in parallel with their primary data fetch using `Promise.all`. If a resolver fails (e.g., insufficient role), the fallback displays the raw ID in grey monospace — no page crash.

### Handling inconsistent API contracts

During development, several API response shapes differed from expectations:

| Endpoint | Expected | Actual |
|---|---|---|
| `GET /courses` | `data.courses` | `data.docs` |
| `GET /users` | `data.docs` | `data.users` |
| `GET /assessments/attempts` | `data.attempts[].createdAt` | `data.attempts[].submittedAt` |
| Submit attempt payload | `{ answers: [{ questionId, selected }] }` | `{ answers: [index0, index1, ...] }` |
| Assessment route | `/assessments/:id` | `/courses/:courseId/units/:unitId/assessment` (no `:id`) |

Each was discovered by hitting the live backend with `Invoke-RestMethod` before writing the page — contract-first, no guessing.

### Client-side route protection

`useProtectedRoute()` runs a `useEffect` on mount. If `user` or `token` is null, it calls `router.replace('/login')` and returns `{ isAuthenticated: false }`. The protected layout renders `null` until authentication is confirmed, preventing a flash of protected content.

### Active sidebar link

The Sidebar uses `usePathname()` from `next/navigation` and applies `linkActive` when `pathname === href || pathname.startsWith(href + '/')`. This means navigating into `/courses/[id]/...` keeps the `Courses` link highlighted.

### Rate limiter awareness

The backend applies a 5-requests-per-15-minutes rate limit on `POST /auth/login` (in-memory, resets on server restart). During development this required managing login calls carefully. The seed data uses separate accounts per role to distribute test load.

---

## How to Run

### Prerequisites

- Node.js ≥ 18
- MongoDB running locally (default: `mongodb://localhost:27017`)

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/elevate_academy
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1h
```

Run the seed (required before first use):

```bash
npm run seed
```

Start the server:

```bash
npm run dev   # nodemon (development)
npm start     # node (production)
```

The API will be available at `http://localhost:4000/api`.

### 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`. The root redirects automatically to `/login`.

---

## Seed Credentials

After running `npm run seed` in the backend:

| Role | Email | Password |
|---|---|---|
| Admin | admin@test.com | Admin1234 |
| Teacher | teacher@test.com | Teacher1234 |
| Student | student1@test.com | Student1234 |
| Student | student2@test.com | Student1234 |
| Student | student3@test.com | Student1234 |

The seed also creates:
- 1 published course with 2 units and 2 lessons per unit.
- 1 assessment per unit with 2 questions each.
- Enrollments for student1 and student3 in the course.
- Lesson progress for student1 (lessons 1.1 and 1.2 completed).
- 1 completed assessment attempt for student1 (score: 100%, passed).

---

## API Reference Summary

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | — | Obtain JWT |
| POST | `/auth/logout` | Bearer | Invalidate session |
| GET | `/users` | Admin | List all users |
| PATCH | `/users/:id/activate` | Admin | Activate user |
| PATCH | `/users/:id/deactivate` | Admin | Deactivate user |
| GET | `/courses` | Bearer | List courses |
| GET | `/courses/:id` | Bearer | Course detail |
| GET | `/courses/:id/units` | Bearer | Units for a course |
| GET | `/courses/:id/units/:uid/lessons` | Bearer | Lessons for a unit |
| GET | `/courses/:id/units/:uid/lessons/:lid` | Bearer | Lesson detail (with content) |
| GET | `/enrollments` | Bearer | List enrollments |
| PATCH | `/enrollments/:id/activate` | Admin | Activate enrollment |
| PATCH | `/enrollments/:id/suspend` | Admin | Suspend enrollment |
| GET | `/progress/overview` | Student | Progress per enrolled course |
| GET | `/courses/:id/units/:uid/assessment` | Bearer | Assessment for a unit |
| POST | `/courses/:id/units/:uid/assessment/attempts` | Student | Submit attempt |
| GET | `/courses/:id/units/:uid/assessment/attempts` | Bearer | List attempts |

---

## Stack Summary

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | Next.js (App Router) | 16.2.9 |
| UI library | React | 19.2.4 |
| Styling | CSS Modules | — |
| Backend framework | Express | 4.19.2 |
| ODM | Mongoose | 8.5.1 |
| Auth | jsonwebtoken | 9.0.2 |
| Validation | express-validator | 7.1.0 |
| Rate limiting | express-rate-limit | 7.3.1 |
| Database | MongoDB | local |
