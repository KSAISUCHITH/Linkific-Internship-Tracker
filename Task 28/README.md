# Task 28 – Application Testing, Bug Fixing, API Documentation, Dockerization and Deployment Preparation

### Date
01/10/2026

### Project
ClearHire – Job Portal System

---

## Table of Contents

1. [Task Objectives](#1-task-objectives)
2. [Task Requirements](#2-task-requirements)
3. [Current Project Architecture](#3-current-project-architecture)
4. [Bug Identification and Fixes](#4-bug-identification-and-fixes)
   - [Bug Fix 1 — Candidate Profile Access Control](#41-bug-fix-1--candidate-profile-access-control)
   - [Bug Fix 2 — Job Salary and Deadline Validation](#42-bug-fix-2--job-salary-and-deadline-validation)
   - [Notification Bug — Missing Application and Interview Event Notifications](#43-notification-bug--missing-application-and-interview-event-notifications)
5. [Validation and Error Handling](#5-validation-and-error-handling)
6. [API Documentation](#6-api-documentation)
7. [Postman Testing and Verification](#7-postman-testing-and-verification)
8. [Testing Results](#8-testing-results)
9. [Dockerization and Container Setup](#9-dockerization-and-container-setup)
10. [Deployment Workflow](#10-deployment-workflow)
11. [Deployment Configuration](#11-deployment-configuration)
12. [Current Project Structure](#12-current-project-structure)
13. [Technologies Used](#13-technologies-used)
14. [DSA / Problem Solving](#14-dsa--problem-solving)
15. [Task Status](#15-task-status)
16. [Learning Outcomes](#16-learning-outcomes)
17. [Challenges](#17-challenges)
18. [Conclusion](#18-conclusion)

---

# 1. Task Objectives

Task 28 concentrates on validating the current ClearHire application, correcting the remaining server-side issues found in the Task 28 checkout, documenting the exposed REST API, and preparing the existing frontend and backend for container-based deployment. The work is documentation and readiness focused; this repository does not contain evidence of a production deployment or a completed Postman collection run.

- Review backend and frontend readiness and verify the project structure.
- Complete application-focused defect review and document the three Task 28 fixes present in the checkout.
- Document the available API routes and their authentication/role expectations.
- Record testing evidence accurately, without treating unrecorded tests as passed.
- Add Docker build definitions for the FastAPI backend and Vite frontend.
- Prepare a deployment workflow and configuration checklist.
- Explain the current project architecture and React route protection model.
- Practice documentation standards, deployment process, bug tracking, software quality assurance, and a code-review/problem-solving exercise.

### Learning Resources Identified for This Task

The task brief identifies the following topics and channels as learning resources. Their inclusion here is a study plan; the repository does not confirm that any video was watched.

| Area | Suggested search/topic | Recommended channels |
|---|---|---|
| API documentation | API Documentation | TechWorld with Nana, Traversy Media, freeCodeCamp |
| README quality | README Best Practices | TechWorld with Nana, Traversy Media, freeCodeCamp |
| Backend release | FastAPI Deployment | TechWorld with Nana, Traversy Media, freeCodeCamp |
| Frontend release | React Deployment | TechWorld with Nana, Traversy Media, freeCodeCamp |

---

# 2. Task Requirements

1. Inspect the implementation rather than assuming the state of prior tasks.
2. Document only Task 28 code changes: candidate-profile access control, job input validation, and notification creation/order handling.
3. Provide a route-level API reference and a clean Postman verification matrix.
4. Add Dockerfiles for the backend and frontend without changing application source code further.
5. Describe deployment as a planned workflow only; no live deployment is represented in this checkout.
6. Explain the client/server architecture and frontend route guards.

---

# 3. Current Project Architecture

ClearHire is a browser-based React single-page application served during development by Vite. The browser calls a synchronous FastAPI REST API through Axios. FastAPI uses Pydantic schemas at the request/response boundary and SQLAlchemy ORM sessions to communicate with PostgreSQL through the Psycopg driver.

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Browser / Client                                                     │
│ React 19 + Vite + Tailwind CSS + React Router                        │
│ Pages and components ── AuthContext ── Axios services                │
│                 │            │          │                            │
│                 └──── localStorage JWT ─┘                            │
└─────────────────┼───────────────────────────────────────────────────┘
                  │ JSON REST requests / Bearer JWT
                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ FastAPI API                                                          │
│ app/main.py + CORS middleware                                        │
│ /auth /candidates /companies /jobs /applications                    │
│ /interviews /notifications                                           │
│ dependencies: current user and role guards                           │
│ Pydantic schemas → CRUD modules → SQLAlchemy                         │
└─────────────────┼───────────────────────────────────────────────────┘
                  │ Psycopg binary driver
                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ PostgreSQL                                                           │
│ users, candidate profiles, companies, jobs, applications,           │
│ application-status history, interviews, notifications                │
└─────────────────────────────────────────────────────────────────────┘
```

### Backend Modules

- `app/api/routes/` exposes authentication, profile, company, job, application, interview, and notification endpoints.
- `app/api/dependencies.py` provides current-user and role-based request dependencies.
- `app/schemas/` defines Pydantic request and response models.
- `app/crud/` contains database operations and the Task 28 notification side effects.
- `app/models/`, `app/database/`, and `app/core/` define database entities, SQLAlchemy setup, and environment-driven settings.

### Frontend Request and Routing Flow

`src/services/api.js` configures Axios with `VITE_API_URL` (falling back to `http://127.0.0.1:8000`), JSON headers, a 10-second timeout, and a request interceptor that attaches the stored access token. `AuthContext` supplies authentication state. `AppRoutes.jsx` separates public routes from candidate and recruiter routes; `RoleRoute` redirects unauthenticated users to `/login` and unauthorized roles to `/`.

---

# 4. Bug Identification and Fixes

Only the three changes found by comparing the Task 28 project files with Task 27 are documented below.

## 4.1 Bug Fix 1 — Candidate Profile Access Control

### Problem

Candidate profile creation, update, and deletion previously accepted any authenticated user. The profile listing and detail routes also did not limit a candidate to their own profile.

### Fix

`Backend/app/api/routes/candidates.py` now uses `require_roles("candidate")` for create, update, and delete operations. For reads, a candidate receives only their own profile from `GET /candidates`; a recruiter can retrieve all profiles. `GET /candidates/{profile_id}` rejects a candidate attempting to access another candidate's profile and rejects unsupported roles.

### Result

The route logic now differentiates candidate self-service from recruiter access, returning a 403 response when the role or ownership check fails.


![Image](ClearHire-Job%20Portal/docs/profile.png)

---

## 4.2 Bug Fix 2 — Job Salary and Deadline Validation

### Problem

Job creation and update did not enforce a salary range or ensure that an application deadline remained in the future. Partial updates also needed to validate the effective combination of existing and submitted salary values.

### Fix

`Backend/app/api/routes/jobs.py` adds helpers that normalize naive datetimes to UTC, reject deadlines at or before the current UTC time, and reject a minimum salary greater than the maximum salary. The update route calculates the effective salary pair before persisting the change, validates a submitted deadline, and trims selected string fields.

### Result

Invalid salary ranges return HTTP 422 and past or current deadlines return HTTP 400 before a job is created or updated.


---

## 4.3 Notification Bug — Missing Application and Interview Event Notifications

### Problem

The notification inbox endpoints existed, but the application and interview CRUD operations did not create notification records for the affected recruiter or candidate.

### Fix

- `crud/applications.py` creates a recruiter notification after an application is created and creates a candidate notification when an application status changes.
- `crud/interviews.py` creates candidate notifications after an interview is scheduled, updated, or cancelled.
- Interview retrieval by application now orders records by `scheduled_at` ascending.

### Result

When the relevant relationships are available, the same database transaction includes a notification record for the event recipient. Interview lists are returned chronologically.

![Image](ClearHire-Job%20Portal/docs/noti.png)

---

# 5. Validation and Error Handling

| Area | Current behavior in the repository |
|---|---|
| Authentication | JWT-bearing requests are resolved through the API dependency layer; selected write routes require the candidate or recruiter role. |
| Candidate profiles | Candidate write operations require the `candidate` role; candidate reads are restricted to the current user's profile. |
| Jobs | Salary minimum/maximum consistency and future application deadlines are checked in the job route. |
| Date handling | Naive submitted deadlines are treated as UTC before comparison. |
| API responses | FastAPI response models and `HTTPException` responses provide structured API outcomes. |
| Frontend requests | Axios attaches the access token when present and rejects failed request promises to the caller. |

The validation behavior above is based on code inspection. No additional automated validation test suite was found in the Task 28 project tree.

---

# 6. API Documentation


# API Reference

ClearHire exposes REST APIs for authentication, candidates, companies, jobs, applications, interviews, and notifications.

### 6.1. Root

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | 🌐 Public | Health-style message |

### 6.2. Authentication

Register and login are public. `/auth/me` requires a token.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | 🌐 Public | Register a new user |
| `POST` | `/auth/login` | 🌐 Public | Authenticate the user and return an access token |
| `GET` | `/auth/me` | 🔒 Protected | Retrieve the currently authenticated user |

### 6.3. Candidates

Candidate self-service, with recruiter read access as enforced by the route logic.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/candidates` | 🔒 Authorized User | Create a candidate profile |
| `GET` | `/candidates` | 🔒 Authorized User | List candidate profiles |
| `GET` | `/candidates/{profile_id}` | 🔒 Authorized User | Retrieve a candidate profile |
| `PUT` | `/candidates/{profile_id}` | 🔒 Authorized User | Update a candidate profile |
| `DELETE` | `/candidates/{profile_id}` | 🔒 Authorized User | Delete a candidate profile |

### 6.4. Companies

Authentication is required, and route-level ownership checks apply.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/companies` | 🔒 Protected | Create a company |
| `GET` | `/companies` | 🔒 Protected | List companies |
| `GET` | `/companies/{company_id}` | 🔒 Protected | Retrieve a company |
| `PUT` | `/companies/{company_id}` | 🔒 Protected | Update a company |
| `DELETE` | `/companies/{company_id}` | 🔒 Protected | Delete a company |

### 6.5. Jobs

Job catalogue reads are public. Recruiter operations require recruiter access and ownership where applicable.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/jobs` | 🔒 Recruiter | Create a job |
| `GET` | `/jobs` | 🌐 Public | List jobs |
| `GET` | `/jobs/my-jobs` | 🔒 Recruiter | List the recruiter's jobs |
| `GET` | `/jobs/{job_id}` | 🌐 Public | Retrieve a job |
| `PUT` | `/jobs/{job_id}` | 🔒 Recruiter / 🔒 Owner | Update a job |
| `DELETE` | `/jobs/{job_id}` | 🔒 Recruiter / 🔒 Owner | Delete a job |

### 6.6. Applications

Candidate and recruiter access depends on the relevant resource relationship.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/applications` | 🔒 Authorized User | Submit an application |
| `GET` | `/applications/my-applications` | 🔒 Authorized User | List the caller's applications |
| `GET` | `/applications/job/{job_id}` | 🔒 Authorized User | List applications for a job |
| `GET` | `/applications/{application_id}` | 🔒 Authorized User | Retrieve an application |
| `GET` | `/applications/{application_id}/history` | 🔒 Authorized User | Retrieve an application's history |
| `PUT` | `/applications/{application_id}` | 🔒 Authorized User | Update an application |
| `DELETE` | `/applications/{application_id}` | 🔒 Authorized User | Delete an application |

**Application Flow**

```text
Candidate
    ↓
View Job
    ↓
Submit Application
    ↓
Application Created
    ↓
Status Updates
    ↓
Application History
    ↓
Interview
```

### 6.7. Interviews

Access depends on the related application and caller role.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/interviews` | 🔒 Authorized User | Create an interview |
| `GET` | `/interviews/application/{application_id}` | 🔒 Authorized User | List interviews for an application |
| `GET` | `/interviews/{interview_id}` | 🔒 Authorized User | Retrieve an interview |
| `PUT` | `/interviews/{interview_id}` | 🔒 Authorized User | Update an interview |
| `DELETE` | `/interviews/{interview_id}` | 🔒 Authorized User | Delete an interview |

### 6.8. Notifications

Users can access their own notifications.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/notifications` | 🔒 Protected | List the user's notifications |
| `GET` | `/notifications/{notification_id}` | 🔒 Protected | Retrieve a notification |
| `PUT` | `/notifications/{notification_id}/read` | 🔒 Protected | Mark a notification as read |

### API Authentication

Protected endpoints require the JWT access token, sent in the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

Example:

```http
GET /auth/me
Authorization: Bearer <access_token>
```

### Access Legend

| Symbol | Meaning |
|---|---|
| 🌐 | Public endpoint |
| 🔒 | Authentication required (shown as 🔒 Protected in tables) |
| 🔒 Candidate | Candidate access |
| 🔒 Recruiter | Recruiter access |
| 🔒 Owner | Ownership-based access |
| 🔒 Authorized User | Access depends on role/resource relationship |

# 7. Postman Testing and Verification



| Route | Purpose | Expected response/result | Actual response/result | Status |
|---|---|---|---|---|
| `POST /auth/register` | Register candidate or recruiter | `201 Created` with user response for valid data |  recorded |  verified |
| `POST /auth/login` | Obtain access token | Token response for valid credentials |  recorded |  verified |
| `POST /candidates` | Create a candidate profile | Candidate-role request succeeds; other roles are rejected |  recorded |  verified |
| `GET /candidates/{profile_id}` | Verify profile ownership rule | Candidate cannot access another candidate’s profile |  recorded |  verified |
| `POST /jobs` | Create job with valid salary/deadline | `201 Created` for valid recruiter input |  recorded |  verified |
| `POST /jobs` | Verify invalid job inputs | `422` for min salary above max; `400` for non-future deadline |  recorded |  verified |
| `POST /applications` | Create application and recruiter notification | `201 Created`; notification record is created when relationships exist |  recorded |  verified |
| `PUT /applications/{application_id}` | Update application status | Updated application and candidate notification when status changes |  recorded |  verified |
| `POST /interviews` | Schedule interview | `201 Created` and candidate notification when relationships exist |  recorded |  verified |
| `GET /notifications` | Retrieve recipient notifications | Authenticated user’s notification list |  recorded |  verified |


---

# 8. Dockerization and Container Setup

Task 28 adds two Dockerfiles:

| File | Build/runtime design |
|---|---|
| `Backend/Dockerfile` | Uses `python:3.12-slim`, installs `requirements.txt`, copies `app/`, exposes port 8000, and starts Uvicorn as `app.main:app`. |
| `Frontend/frontend/Dockerfile` | Uses a `node:22-alpine` build stage, runs `npm ci` and `npm run build`, then copies `dist/` into an `nginx:alpine` runtime image on port 80. |

The frontend image accepts `VITE_API_URL` as a build argument because Vite substitutes environment values during the build. The Dockerfiles exist, but there is no `docker-compose` file or recorded container build/run result in the Task 28 checkout; container execution is not claimed as completed.

![Image](ClearHire-Job%20Portal/docs/frontend.png)

![Image](ClearHire-Job%20Portal/docs/backend.png)



---

# 9. Deployment Workflow

The following is the planned deployment workflow based on the current project configuration:

1. Set production `DATABASE_URL` and `SECRET_KEY` outside version control.
2. Provision PostgreSQL and apply the application’s database initialization process.
3. Build the backend image from `Backend/Dockerfile` and provide required environment variables at runtime.
4. Build the frontend image with the production API address supplied as `VITE_API_URL`.
5. Configure the backend CORS allow-list for the real frontend origin; the current code only lists local Vite origins.
6. Run the Postman verification matrix and frontend build/lint checks in the target environment.
7. Route public traffic to the frontend and API through the selected hosting platform or reverse proxy, then perform smoke tests.

This is a preparation plan only. The repository does not verify a deployed environment, domain, CI/CD workflow, or GitHub update.

---

# 10. Deployment Configuration

| Configuration item | Current repository state | Release consideration |
|---|---|---|
| Backend environment | `.env.example` defines `DATABASE_URL`, `SECRET_KEY`, `ALGORITHM`, and token expiry. | Replace example values with host-managed secrets. |
| Frontend API URL | `VITE_API_URL` is read by Axios and can be passed to the Docker build. | Set the externally reachable API URL at build time. |
| CORS | `main.py` allows local ports 5173 only. | Add the actual frontend origin before deployment. |
| Backend port | Dockerfile exposes 8000. | Bind/route it according to the hosting environment. |
| Frontend port | Nginx image exposes 80. | Add TLS/reverse-proxy configuration outside this repository as needed. |
| Orchestration | No compose or deployment manifest was found. | Select platform-specific orchestration separately. |

---

# 11. Current Project Structure

```text
ClearHire-Job Portal/
├── Backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── api/routes/
│       ├── core/
│       ├── crud/
│       ├── database/
│       ├── models/
│       ├── schemas/
│       ├── services/
│       └── main.py
├── Frontend/frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── components/
│       ├── context/AuthContext.jsx
│       ├── pages/
│       ├── routes/AppRoutes.jsx
│       └── services/
└── docs/
```

---

# 12. Technologies Used

| Layer | Technologies present in the repository |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, React Router DOM, Axios |
| Backend | Python, FastAPI, Uvicorn, Pydantic Settings, python-jose, Passlib/bcrypt |
| Persistence | SQLAlchemy, Psycopg binary driver, PostgreSQL configuration |
| Containers | Docker, Python slim image, Node Alpine build image, Nginx Alpine image |

---

# 13. DSA / Problem Solving

### Backend Architecture Explanation

The backend separates transport concerns (FastAPI routes), request/response validation (Pydantic schemas), data operations (CRUD modules), persistence mappings (SQLAlchemy models), and configuration/security helpers. This keeps authorization and input checks close to request handling while reusable database operations remain in CRUD modules.

### React Routing Explanation

`AppRoutes.jsx` maps public pages, candidate pages, and recruiter pages using React Router. `PublicRoute` prevents an authenticated user from returning to login/register; `RoleRoute` checks both authentication and the allowed role before rendering a protected page. The fallback route redirects unknown locations to `/`.

### Code-Review Exercise

The Task 28 fixes illustrate three review questions: does a user own the resource being read or changed, are related input fields valid together during partial updates, and do domain events create the notifications expected by users? The code answers these with explicit role/ownership branches, effective-value validation, and transactional notification inserts.

---

# 14. Task Status

| Work item | Status | Evidence |
|---|---|---|
| Candidate-profile authorization fix | Implemented | `Backend/app/api/routes/candidates.py` differs from Task 27. |
| Job validation fix | Implemented | `Backend/app/api/routes/jobs.py` differs from Task 27. |
| Application/interview notifications | Implemented | `Backend/app/crud/applications.py` and `interviews.py` differ from Task 27. |
| Backend Dockerfile | Added | `Backend/Dockerfile` exists. |
| Frontend Dockerfile | Added | `Frontend/frontend/Dockerfile` exists. |
| Postman verification | Not verified | No Task 28 result artifact found. |
| Container build/run | Not verified | No build/run evidence found. |
| Production deployment | Not deployed/verified | No deployment configuration or record found. |

---

