# Elevate Your English | Campus

REST API backend for a professional English academy LMS. Built as a portfolio project demonstrating layered architecture, domain-driven design, and security-first API development with Node.js, Express, and MongoDB.

---

## Overview

Elevate Your English Campus is a learning management system for a professional English academy. It supports three roles — **Admin**, **Teacher**, and **Student** — across a full academic lifecycle: course catalog, structured content delivery, lesson progress tracking, knowledge assessments, student enrollment management, and 1-on-1 class booking.

The backend exposes a RESTful API consumed by a separate frontend client. Every endpoint enforces JWT authentication and role-based access control.

**Stack:** Node.js · Express · MongoDB · Mongoose · bcryptjs · express-validator · jsonwebtoken

---

## Business Flow

```
Admin creates course (draft)
    └─ adds Units → Lessons → Assessment per unit
    └─ publishes course

Admin enrolls Student
    └─ system initialises LessonProgress for every lesson in the course

Student works through the course
    └─ completes lessons in order (sequential unlock per unit)
    └─ unlocks unit Assessment after completing all lessons in the unit
    └─ submits Assessment attempt → receives score
    └─ course marked completed automatically when overall progress reaches 100 %

Teacher monitors assigned students
    └─ views enrollment status and progress
    └─ reviews assessment attempt history (without seeing correct answers)

Admin manages 1-on-1 bookings between Students and their assigned Teachers
```

---

## Architecture

The API follows a strict layered architecture. Dependencies flow in one direction only — from the outermost layer inward.

```
HTTP Request
     ↓
[ Routes ]          — Declares endpoints, chains middlewares, delegates to controller
     ↓
[ Validators ]      — Sanitizes and validates input via express-validator schemas
     ↓
[ Middlewares ]     — Cross-cutting concerns: auth, role enforcement, active-user check
     ↓
[ Controllers ]     — Extracts data from req, calls service, returns HTTP response
     ↓
[ Services ]        — Business logic, domain rules, orchestration across repositories
     ↓
[ Repositories ]    — Data access only; no business logic; all queries isolated here
     ↓
[ Models ]          — Mongoose schemas, indexes, field constraints
     ↓
MongoDB
```

**Layer responsibilities:**

| Layer | Owns | Never contains |
|-------|------|----------------|
| **Controller** | HTTP interface — req/res handling, status codes | Business rules, database queries |
| **Service** | Domain logic — validations, orchestration, error semantics | HTTP concerns, direct model access |
| **Repository** | Query construction, pagination, field whitelisting | Business rules, HTTP concerns |
| **Model** | Schema definition, indexes, serialization transforms | Any logic beyond schema constraints |

**Cross-cutting patterns:**

- `asyncHandler` — wraps every controller in a unified promise rejection catcher, eliminating try/catch boilerplate
- `validate(schema)` — higher-order middleware that runs express-validator chains and converts failures to structured `ValidationError` responses
- `ApiError` hierarchy — typed errors (`NotFoundError`, `ConflictError`, `ForbiddenError`…) that the central `errorHandler` middleware serializes consistently
- `BaseRepository` — generic CRUD base class (`findAll`, `create`, `updateById` with `runValidators: true`) extended by every domain repository
- Soft delete — no `DELETE` at the database level; `isActive: false` is the only removal mechanism for user-facing records

---

## Domain Model

```
┌─────────────┐        ┌──────────────────┐        ┌──────────────┐
│    User     │───────▶│  TeacherProfile  │        │    Course    │
│  (admin /   │        │  (availability,  │        │  (units,     │
│  teacher /  │        │   bio, etc.)     │        │   lessons)   │
│  student)   │        └──────────────────┘        └──────┬───────┘
└──────┬──────┘                                           │
       │                                            ┌─────▼──────┐
       │  assigned                                  │    Unit    │
       │  teacher                                   └─────┬──────┘
       │                                                  │
       │                                           ┌──────▼──────┐
       │                                           │   Lesson    │
       │                                           └──────┬──────┘
       │                                                  │
       │         ┌──────────────┐           ┌────────────▼──────────┐
       └────────▶│  Enrollment  │           │    LessonProgress     │
                 │  (per course)│           │  (per student/lesson) │
                 └──────┬───────┘           └───────────────────────┘
                        │
                 ┌──────▼───────┐           ┌───────────────────────┐
                 │  Assessment  │──────────▶│  AssessmentAttempt    │
                 │  (per unit)  │           │  (answers + score)    │
                 └──────────────┘           └───────────────────────┘
```

**Key relationships:**

- A `User` with role `teacher` may have one `TeacherProfile` (bio, availability slots)
- A `User` with role `student` may be assigned to one `Teacher` via `assignedTeacherId`
- `Enrollment` is the join between a `Student` and a `Course` — it tracks overall status and progress percentage
- `LessonProgress` records each lesson a student has completed — append-only, never reversed
- `AssessmentAttempt` is immutable after submission — stores a snapshot of answers against the assessment at that point in time
- `passwordHash` is excluded from all serialization via `select: false` and `toJSON.transform`

---

## Project Structure

```
backend/
├── src/
│   ├── server.js                   # Entry point — connects DB, starts Express server
│   ├── app.js                      # Express setup — middleware stack, route mounting
│   │
│   ├── config/
│   │   ├── env.js                  # Validates required env vars, exports frozen config object
│   │   ├── database.js             # Mongoose connection with reconnect event handlers
│   │   └── constants.js            # Domain enums: ROLES, COURSE_STATUS, BOOKING_STATUS…
│   │
│   ├── middlewares/
│   │   ├── validate.js             # Higher-order fn: validate(schema) → [...chains, errorCollector]
│   │   ├── verifyToken.js          # JWT verification → populates req.user
│   │   ├── requireRole.js          # Role-based access control guard
│   │   ├── requireActiveUser.js    # DB check: user.isActive must be true
│   │   ├── errorHandler.js         # Central error serializer (ApiError, CastError, duplicate key)
│   │   ├── notFound.js             # 404 handler for unmatched routes
│   │   └── rateLimiter.js          # express-rate-limit — loginLimiter for auth endpoint
│   │
│   ├── models/                     # Mongoose schemas and indexes
│   │   ├── user.model.js
│   │   ├── course.model.js
│   │   ├── unit.model.js
│   │   ├── lesson.model.js
│   │   ├── lessonProgress.model.js
│   │   ├── enrollment.model.js
│   │   ├── assessment.model.js
│   │   ├── assessmentAttempt.model.js
│   │   ├── teacherProfile.model.js
│   │   └── classBooking.model.js
│   │
│   ├── repositories/
│   │   ├── base.repository.js      # Generic CRUD — extended by all domain repositories
│   │   └── [domain].repository.js  # One file per model; domain-specific queries only
│   │
│   ├── modules/                    # Feature modules — one directory per domain
│   │   ├── auth/                   # Login, logout, /me, change-password
│   │   ├── users/                  # User CRUD + activate/deactivate
│   │   ├── courses/                # Course catalog management and lifecycle
│   │   ├── units/                  # Unit management (nested under courses)
│   │   ├── lessons/                # Lesson content (nested under units)
│   │   ├── enrollments/            # Student enrollment lifecycle
│   │   ├── progress/               # LessonProgress tracking and snapshots
│   │   ├── assessments/            # Assessment definition and attempt submission
│   │   ├── bookings/               # 1-on-1 class booking (Phase 4)
│   │   └── availability/           # Teacher availability slot management (Phase 5)
│   │       └── [module]/
│   │           ├── *.controller.js
│   │           ├── *.service.js
│   │           ├── *.validator.js
│   │           └── *.routes.js
│   │
│   ├── utils/
│   │   ├── ApiError.js             # Typed error hierarchy (NotFoundError, ConflictError…)
│   │   ├── asyncHandler.js         # Wraps async controllers — routes errors to next()
│   │   ├── pagination.js           # build() and toMongoOptions() helpers
│   │   ├── logger.js               # Coloured console logger with log levels
│   │   ├── progressCalculator.js   # Stateless utility — aggregates lesson + assessment data
│   │   └── slotExpander.js         # Expands teacher availability rules into time slots
│   │
│   └── seeds/
│       ├── index.js                # Seed runner — clears collections, runs phases
│       └── phase1.seed.js          # Initial dataset: users, courses, units, lessons, enrollments
│
├── tests/
│   ├── validate.test.js
│   ├── user.validator.test.js
│   └── user.routes.test.js
│
├── .env.example
├── .gitignore
└── package.json
```

---

## Modules

| Module | Base path | Responsibility |
|--------|-----------|----------------|
| **Auth** | `/api/auth` | Login, token refresh, password change |
| **Users** | `/api/users` | User CRUD, activation / deactivation |
| **Courses** | `/api/courses` | Course catalog management and lifecycle |
| **Units** | `/api/courses/:courseId/units` | Unit management within a course |
| **Lessons** | `/api/courses/:courseId/units/:unitId/lessons` | Lesson content and ordering |
| **Progress** | `/api/progress` | Lesson completion tracking per student |
| **Enrollments** | `/api/enrollments` | Student enrollment lifecycle |
| **Assessments** | `/api/courses/:courseId/units/:unitId/assessment` | Assessment definition and submission |
| **Bookings** | `/api/bookings` | 1-on-1 class booking *(Phase 4)* |
| **Availability** | `/api/teachers` | Teacher availability slot management *(Phase 5)* |

### Auth

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/login` | Authenticate and receive JWT | Public |
| `POST` | `/api/auth/logout` | Invalidate session (client-side token discard) | Authenticated |
| `GET` | `/api/auth/me` | Get own profile from live DB | Authenticated |
| `PATCH` | `/api/auth/change-password` | Change own password | Authenticated |

### Users

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/users` | List users (paginated, filterable) | Admin, Teacher |
| `GET` | `/api/users/:id` | Get user detail | Admin, Teacher |
| `POST` | `/api/users` | Create user | Admin |
| `PATCH` | `/api/users/:id` | Update user profile | Admin |
| `PATCH` | `/api/users/:id/activate` | Activate user | Admin |
| `PATCH` | `/api/users/:id/deactivate` | Deactivate user | Admin |

### Courses

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/courses` | List courses | Admin, Teacher, Student |
| `GET` | `/api/courses/:id` | Get course detail | Admin, Teacher, Student |
| `POST` | `/api/courses` | Create course | Admin |
| `PATCH` | `/api/courses/:id` | Update course metadata | Admin |
| `PATCH` | `/api/courses/:id/publish` | Publish course (draft → published) | Admin |
| `PATCH` | `/api/courses/:id/archive` | Archive course | Admin |

### Units

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `…/units` | List units for a course | Admin, Teacher, Student |
| `GET` | `…/units/:id` | Get unit detail | Admin, Teacher, Student |
| `POST` | `…/units` | Create unit | Admin |
| `PATCH` | `…/units/reorder` | Reorder units within course | Admin |
| `PATCH` | `…/units/:id` | Update unit | Admin |
| `DELETE` | `…/units/:id` | Remove unit | Admin |

### Lessons

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `…/lessons` | List lessons for a unit | Admin, Teacher, Student |
| `GET` | `…/lessons/:id` | Get lesson content | Admin, Teacher, Student |
| `POST` | `…/lessons` | Create lesson | Admin |
| `PATCH` | `…/lessons/reorder` | Reorder lessons within unit | Admin |
| `PATCH` | `…/lessons/:id` | Update lesson | Admin |
| `DELETE` | `…/lessons/:id` | Remove lesson | Admin |

### Progress

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `PATCH` | `/api/progress/lessons/:lessonId/complete` | Mark lesson as completed | Student |
| `GET` | `/api/progress/courses/:courseId` | Own progress in a course | Student |
| `GET` | `/api/progress/overview` | Own overall progress across all courses | Student |
| `GET` | `/api/progress/students/:studentId/courses/:courseId` | Student progress (external view) | Admin, Teacher |
| `GET` | `/api/progress/students/:studentId` | Student overview (external view) | Admin, Teacher |

### Enrollments

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/enrollments` | List enrollments | Admin, Teacher, Student (own) |
| `GET` | `/api/enrollments/:id` | Get enrollment detail | Admin, Teacher, Student (own) |
| `POST` | `/api/enrollments` | Enroll a student in a course | Admin |
| `PATCH` | `/api/enrollments/:id/suspend` | Suspend enrollment | Admin |
| `PATCH` | `/api/enrollments/:id/activate` | Reactivate enrollment | Admin |

### Assessments

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `…/assessment` | Get unit assessment | Admin, Teacher, Student* |
| `POST` | `…/assessment` | Create assessment for a unit | Admin |
| `PATCH` | `…/assessment` | Update assessment definition | Admin |
| `DELETE` | `…/assessment` | Delete assessment (draft courses only) | Admin |
| `POST` | `…/assessment/attempts` | Submit an attempt | Student |
| `GET` | `…/assessment/attempts` | List all attempts | Admin, Teacher, Student (own) |

*Student access requires all unit lessons to be completed first.

---

## Business Rules

### Enrollment

- A student can only be enrolled in a `published` course; `draft` and `archived` courses reject enrollment.
- A student must be `isActive: true` at the time of enrollment.
- Duplicate enrollment (same student + course pair) is rejected at both the service and database layer (unique index).
- On enrollment creation, all `LessonProgress` records for the course are initialised in bulk with `status: not_started`.
- `status: completed` is **set by the system only** — it cannot be forced via the API.
- A `completed` enrollment is immutable; no further status changes are accepted.

### LessonProgress

- Records are created at enrollment time and never deleted — completion is irreversible.
- `completeLesson` is **idempotent**: calling it on an already-completed lesson returns the current state without side effects.
- Completing a lesson requires an `active` enrollment in the course at the time of the call.

### Sequential Unlock

- Controlled per unit by `unit.sequentialUnlock` (boolean flag).
- When enabled, a student cannot complete lesson `n` until lesson `n − 1` is `completed`.
- Unit access follows the same pattern: a unit is locked until the previous unit's assessment is passed (when one exists).

### Assessments

- Each unit may have at most one assessment; creating a second one raises a `ConflictError`.
- A student can only access or submit an assessment **after completing all lessons in the unit**.
- `correctAnswer` is excluded from all responses to Teachers and Students — only Admin receives it.
- An assessment can only be deleted while its course is in `draft` status; deleting it cascades to all related `AssessmentAttempt` records.

### Assessment Attempts

- Submission requires: active enrollment + all unit lessons completed + attempts remaining.
- A student who has already passed (`passed: true`) cannot submit further attempts.
- Exceeding `assessment.maxAttempts` is rejected before any scoring occurs.
- `score = floor((correct answers / total questions) × 100)`.
- `passed = score ≥ assessment.passingScore`.
- Every attempt is persisted as an immutable snapshot; the source assessment can evolve without corrupting historical scores.

### Course Completion

- Triggered automatically when `overallProgress` reaches `100 %` after a lesson is marked complete.
- Calls `EnrollmentService.markCompleted()` internally — there is no endpoint to force this state.

### Authorization Rules

| Action | Admin | Teacher | Student |
|--------|-------|---------|---------|
| Manage users / courses / units / lessons | ✅ | ✗ | ✗ |
| View any enrollment or progress | ✅ | Own students only | Own data only |
| Submit lesson completion / assessment | ✅ | ✗ | ✅ (own) |
| See `correctAnswer` | ✅ | ✗ | ✗ |
| Delete assessments | ✅ (draft only) | ✗ | ✗ |
| Force enrollment `completed` | ✗ | ✗ | ✗ (system only) |

---

## Security & Authorization

**Authentication**

All protected routes require a `Bearer` JWT in the `Authorization` header. `verifyToken` validates the signature, extracts `{ userId, role }`, and populates `req.user`. Missing or malformed tokens return `401 TOKEN_MISSING`. Expired or tampered tokens return `401 INVALID_TOKEN`.

**Role-based access control**

`requireRole(...roles)` runs after `verifyToken` and rejects any request whose `req.user.role` is not in the allowed list (`403 INSUFFICIENT_ROLE`).

**Active-user enforcement**

Write endpoints carry `requireActiveUser`, which performs a live DB lookup and rejects tokens belonging to deactivated accounts (`403 ACCOUNT_INACTIVE`). Read endpoints intentionally skip this check.

**Password security**

- Passwords are hashed with `bcryptjs` (10 rounds) before persistence.
- Input is capped at 72 characters in the validator, enforcing bcrypt's silent truncation limit.
- `passwordHash` is excluded from all query results via `select: false` on the Mongoose field and a `toJSON.transform` that strips it on serialization (double defence).
- `updateUserSchema` blocks `password` and `passwordHash` from the PATCH body; password changes go through the dedicated `PATCH /auth/change-password` endpoint.

**Sensitive field access**

- `correctAnswer` is never returned to Teachers or Students. Repository methods accept an explicit `includeCorrectAnswers` flag set to `true` only inside `submitAttempt`.

**Other protections**

- Whitelist updates in every repository — update objects are built field-by-field, preventing mass-assignment and NoSQL injection.
- CORS is restricted to the `CLIENT_URL` environment variable.
- Rate limiting (`loginLimiter`) is applied to `POST /api/auth/login` — 5 requests per 15 minutes per IP.

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB ≥ 6 running locally or a connection string (Atlas, etc.)

### Installation

```bash
git clone https://github.com/<your-username>/elevate-your-english-backend.git
cd elevate-your-english-backend
npm install
```

### Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Example | Description |
|----------|---------|-------------|
| `PORT` | `4000` | HTTP server port |
| `NODE_ENV` | `development` | `development` \| `production` \| `test` |
| `MONGODB_URI` | `mongodb://localhost:27017/elevate_campus` | MongoDB connection string |
| `JWT_SECRET` | `your-secret-min-32-chars` | Signing key for all JWT tokens |
| `JWT_TTL_ADMIN` | `8h` | Token expiry for admin users |
| `JWT_TTL_TEACHER` | `24h` | Token expiry for teachers |
| `JWT_TTL_STUDENT` | `7d` | Token expiry for students |
| `CLIENT_URL` | `http://localhost:3000` | CORS allowed origin |

The server exits at startup if any required variable is missing.

### Run

```bash
npm run dev     # nodemon — restarts on file changes
npm start       # standard node
```

---

## Seed Data

Populates the database with a representative initial dataset for local development and manual testing.

> **Warning:** the seed **drops and recreates** the following collections before inserting:
> `users`, `courses`, `units`, `lessons`, `assessments`, `enrollments`, `lessonprogresses`, `assessmentattempts`.

```bash
# NODE_ENV must be "development" — the seed refuses to run otherwise
npm run seed
```

The seed connects to MongoDB, clears the listed collections, runs `phase1.seed.js`, then disconnects. Seeded user credentials are printed to the console on completion.

---

## Testing

Tests run against in-memory structures only — no running MongoDB required.

```bash
npm test              # single run (jest --runInBand)
npm run test:watch    # interactive watch mode
```

**Current coverage:**

| Suite | Tests | What is covered |
|-------|-------|-----------------|
| `validate.test.js` | 6 | `validate()` middleware — pass-through, error shape, field accumulation |
| `user.validator.test.js` | 38 | All 4 schemas — required fields, format rules, blocklists, sanitizers |
| `user.routes.test.js` | 21 | Route count, method+path existence, no shadowing, middleware order, controller references |
| **Total** | **65** | **0 failures** |

All environment variables required by the app are set inline at the top of each test file — no `.env` file needed to run tests.

---

## Known Limitations

**Not yet implemented**

- **Bookings** (`/api/bookings`) — router is registered but empty. No routes, no logic.
- **Availability** (`/api/teachers`) — same: registered but empty.

**Testing gaps**

- Tests exist only for the Users module (65 tests across 3 suites).
- Auth, Courses, Units, Lessons, Enrollments, Progress, and Assessments have **zero automated tests**.
- No integration tests run against a real MongoDB instance — Mongoose index constraints and model-level validation are not exercised in the test suite.

**Other**

- No file upload — `avatarUrl` stores an externally hosted URL string only.
- `POST /api/auth/logout` is stateless: it acknowledges the request but does not blacklist the token. Token invalidation is the client's responsibility.
- Seed data covers Phase 1 entities only; booking and availability records are not seeded.

---

## Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| 0 | Infrastructure — Express, config, middlewares, error handling, base repository | ✅ Complete |
| 1 | Users — full CRUD, activate/deactivate, validators, routes, tests | ✅ Complete |
| 2 | Auth, Courses, Units, Lessons, Enrollments, Progress, Assessments — service + controller + validator + routes | ✅ Implemented |
| 3 | Test suites for all Phase 2 modules | 🔲 Pending |
| 4 | Bookings — 1-on-1 class booking lifecycle | 🔲 Pending |
| 5 | Availability — teacher slot templates and slot expansion | 🔲 Pending |
| 6 | Integration tests, seed expansion, deployment configuration | 🔲 Pending |

---

## Development Process

This project follows a strict **design → review → implement → validate** cycle. Each module is fully designed and reviewed before a single line of implementation is written. No module is considered complete until its tests pass at zero failures.

Layers are implemented in sequence — model → repository → service → controller → validator → routes — so that each layer can be tested in isolation before the next is built on top of it.

**AI-assisted development**

Architecture decisions, layer contracts, security constraints, and validator rules were developed with the support of an AI assistant (Claude), used as a technical reviewer and sounding board. Every design choice was reasoned through explicitly before being committed to code.

---

*Built with Node.js · Express · MongoDB · Mongoose*
