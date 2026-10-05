# Task 29 — Final Quality Review, Project Verification, Documentation and Submission Preparation

## Live Demo:- https://linkific-internship-tracker-fronten.vercel.app/

### Date
05/10/2026

### Project
ClearHire – Job Portal System


# ClearHire – Job Portal System

![ClearHire Banner](https://img.shields.io/badge/ClearHire-Recruitment%20Platform-blue?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)

> **Modern, transparent, role-based recruitment platform bringing clarity, real-time application tracking, and structured communication to candidates and recruiters.**

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Problem Statement](#2-problem-statement)
- [3. Objectives](#3-objectives)
- [4. Key Features](#4-key-features)
- [5. User Roles](#5-user-roles)
- [6. Complete Application Workflow](#6-complete-application-workflow)
- [7. System Architecture](#7-system-architecture)
- [8. Frontend Architecture](#8-frontend-architecture)
- [9. Backend Architecture](#9-backend-architecture)
- [10. Database Architecture](#10-database-architecture)
- [11. Authentication and Authorization](#11-authentication-and-authorization)
- [12. Validation and Error Handling](#12-validation-and-error-handling)
- [13. Bug Fixes / Quality Improvements](#13-bug-fixes--quality-improvements)
- [14. Complete API Documentation](#14-complete-api-documentation)
- [15. API Authentication](#15-api-authentication)
- [16. Detailed API Endpoint Specifications](#16-detailed-api-endpoint-specifications)
- [17. API Request / Response Examples](#17-api-request--response-examples)
- [18. HTTP Status Code Reference](#18-http-status-code-reference)
- [19. API Documentation Workflow](#19-api-documentation-workflow)
- [20. API Testing & Postman Verification](#20-api-testing--postman-verification)
- [21. Deployment Architecture](#21-deployment-architecture)
- [22. Deployment Workflow](#22-deployment-workflow)
- [23. Docker Configuration](#23-docker-configuration)
- [24. Environment Configuration](#24-environment-configuration)
- [25. Project Structure](#25-project-structure)
- [26. Technology Stack](#26-technology-stack)
- [27. DSA / Problem Solving](#27-dsa--problem-solving)
- [28. Scalability Considerations](#28-scalability-considerations)
- [29. Local Setup and Installation](#29-local-setup-and-installation)
- [30. Running the Application](#30-running-the-application)
- [31. Git / GitHub Workflow](#31-git--github-workflow)
- [32. Final Project Verification](#32-final-project-verification)
- [33. Final Submission Package](#33-final-submission-package)
- [34. Learning Outcomes](#34-learning-outcomes)
- [35. Challenges and Solutions](#35-challenges-and-solutions)
- [36. Future Improvements](#36-future-improvements)
- [37. Conclusion](#37-conclusion)

---

# 1. Project Overview

**ClearHire** is an enterprise-grade, full-stack recruitment portal engineered to address the communication opacity that plagues modern job searches. Traditional job boards act merely as bulletin boards; once an applicant clicks "Apply", their submission enters a black box with zero visibility into reviewer activity, status changes, or interview timelines.

ClearHire bridges this gap by establishing an interactive, structured platform where:
- **Candidates** can discover openings, build tailored professional profiles, submit applications, track application stages with audit trails, view expected response timelines, review scheduled interviews, and receive timely notifications.
- **Recruiters** can establish verified company identities, publish and manage job requisitions, filter and review incoming applicant pools, transition candidate statuses with clear accountability, schedule structured interviews with video links, and trigger automated candidate alerts.

ClearHire is implemented with a modern decoupled stack: a reactive single-page frontend using **React 19**, **Vite**, and **Tailwind CSS**, communicating via **Axios** with a high-performance **FastAPI** REST backend backed by **PostgreSQL** via **SQLAlchemy 2.0**.

---

# 2. Problem Statement

Job seekers across technical and non-technical industries face systemic hurdles during the hiring lifecycle:
1. **Application Opacity**: Applicants rarely know if their resume was received, under review, shortlisted, or rejected.
2. **Missing Response Commitments**: Postings lack clear response timeframes, leaving candidates in prolonged uncertainty.
3. **Fragmented Interview Communication**: Interview details often get lost across disparate email threads, calendar invites, and messaging channels.
4. **Recruiter Workflow Friction**: Hiring managers struggle with cluttered inboxes, inconsistent applicant status transitions, and cumbersome scheduling tools.

ClearHire solves these challenges by providing real-time lifecycle tracking, explicit expected response windows, unified in-app interview schedules, automated notifications, and strict role-based access control.

---

# 3. Objectives

The primary engineering objectives accomplished in the ClearHire system include:
- **Decoupled Client-Server Separation**: Establishing clean REST boundaries between a React 19 SPA and a FastAPI asynchronous backend.
- **Security & RBAC**: Implementing stateless JSON Web Token (JWT) Bearer authentication, bcrypt password hashing, and granular role/ownership authorization dependencies.
- **Data Integrity & Hardened Validation**: Enforcing declarative Pydantic schemas, database foreign key cascades, unique constraints, and timezone-aware UTC datetime operations.
- **Recruitment Transparency**: Storing complete status transition history (`applied` → `under_review` → `shortlisted` → `interview` → `offer` / `rejected`) and maintaining audit logs.
- **Containerization & Deployment Readiness**: Providing production-ready Docker definitions for the backend and frontend services.
- **API Surface Documentation**: Producing a verified, schema-accurate reference for all 35 endpoints across 8 distinct functional modules.

---

# 4. Key Features

| Feature | Description | Target Role |
|---|---|---|
| **Stateless JWT Authentication** | Secure registration, login, and token issuance with encrypted bcrypt passwords | Guest / All |
| **Candidate Profile Management** | Complete resume profile with headline, bio, location, skills, and portfolio link | Candidate |
| **Company Profile Management** | Recruiter organization branding, website, industry, and contact coordinates | Recruiter |
| **Job Requisition Publishing** | Create, update, list, and filter job postings with salary ranges and deadlines | Recruiter / Public |
| **Multi-Parametric Job Search** | Real-time filtering by search query, location, employment type, and experience | Public / All |
| **Application Submission** | Candidate application workflow with duplicate prevention and deadline checks | Candidate |
| **Application Status Tracking** | Live status display (`applied`, `under_review`, `shortlisted`, `interview`, `offer`, `rejected`) | Candidate |
| **Status Audit History** | Historical timeline tracking every status change timestamp and transition notes | Candidate / Recruiter |
| **Interview Scheduling** | Full interview coordinator supporting interview types, future UTC timestamps, and meeting URLs | Recruiter / Candidate |
| **Event Notifications** | System notifications triggered upon application submission, review, status updates, and interviews | Candidate / Recruiter |
| **Granular Ownership Control** | Strict endpoint authorization ensuring candidates and recruiters only access authorized resources | System-wide |

---

# 5. User Roles

ClearHire defines two active authenticated roles alongside an unauthenticated public tier:

### 5.1 Public / Guest
- Browse published job postings and view detailed requisition information.
- Filter jobs by keywords, location, employment type, and experience level.
- Access platform landing page, transparency details, and workflow information.
- Register for an account or log into an existing account.

### 5.2 Candidate
- Maintain a single, comprehensive candidate profile (`headline`, `bio`, `skills`, `location`, `resume_url`).
- Apply for active job requisitions before the application deadline.
- View personalized candidate dashboard with active application counts, interview counts, and unread notifications.
- Track real-time application status and review immutable status transition audit logs.
- View scheduled interviews, duration, meeting links, and recruiter notes.
- Access in-app notifications and mark them as read.
- Delete/withdraw submitted applications.

### 5.3 Recruiter
- Register and manage an organizational company profile (`name`, `description`, `website`, `location`, `industry`).
- Publish, edit, and delete job requisitions with salary ranges and application deadlines.
- Access recruiter dashboard with requisition metrics and candidate submission counts.
- Review candidate profiles submitted for owned job postings.
- Update application statuses with custom transition notes.
- Schedule, update, and cancel structured interview sessions for candidate applications.

---

# 6. Complete Application Workflow

```mermaid
flowchart TD
    subgraph Public Tier
        G[Guest User] -->|Browse / Filter| JB[Job Catalog]
        G -->|Register / Login| AUTH[Auth Service]
    end

    subgraph Candidate Lifecycle
        AUTH -->|Role: Candidate| CD[Candidate Dashboard]
        CD --> CP[Build Candidate Profile]
        CP --> JB2[Search Active Jobs]
        JB2 -->|Submit Application| APP[Application Created]
        APP --> NOTIF1[Notification Triggered]
        APP --> ST[Track Application Status]
        APP --> HIS[View Status History]
        INT1[View Scheduled Interviews] <-- INT_NOTIF[Interview Alerts]
    end

    subgraph Recruiter Lifecycle
        AUTH -->|Role: Recruiter| RD[Recruiter Dashboard]
        RD --> CMP[Create Company Profile]
        CMP --> CJ[Publish Job Requisitions]
        CJ --> VA[Review Incoming Applications]
        VA -->|Update Status| US[Status: under_review / shortlisted / offer / rejected]
        US --> NOTIF2[Candidate Notification]
        VA -->|Schedule Interview| SI[Create Interview Session]
        SI --> INT_NOTIF
    end
```

---

# 7. System Architecture

ClearHire follows a decoupled 3-tier architecture with stateless REST communication:

```mermaid
flowchart TD
    subgraph Client Layer
        A[React 19 SPA] --> B[React Router 7]
        A --> C[AuthContext State]
        A --> D[Axios HTTP Client]
    end

    subgraph API Gateway / Server
        D -->|HTTP / JSON + Bearer JWT| E[FastAPI Application]
        E --> F[CORS Middleware]
        E --> G[Security / JWT Handler]
        E --> H[Role / Ownership Dependencies]
        E --> I[Pydantic Validation Layer]
        E --> J[CRUD & Business Services]
    end

    subgraph Persistence Layer
        J --> K[SQLAlchemy 2.0 ORM]
        K --> L[Psycopg Binary Driver]
        L --> M[(PostgreSQL Database)]
    end
```

### Architectural Highlights
- **Stateless Communication**: All protected routes require a standard `Authorization: Bearer <access_token>` header.
- **Single Responsibility CRUD**: API routes delegate data operations to modular CRUD services, keeping route handlers clean and testable.
- **Schema Validation Boundary**: Inbound request payloads and outbound responses are strictly parsed and serialized using Pydantic models.
- **Connection Pooling**: SQLAlchemy connects to PostgreSQL with `pool_pre_ping=True` to maintain database resilience.

---

# 8. Frontend Architecture

The frontend is built using **React 19** with **Vite** build tooling and styled with **Tailwind CSS v4**.

```
Frontend/frontend/src/
├── components/
│   ├── Navbar.jsx                  # Role-aware responsive navigation bar
│   ├── applications/               # Reusable application modal and cards
│   ├── interviews/                 # Interview scheduling forms and displays
│   └── jobs/                       # Job card, filter bar, and search tools
├── context/
│   └── AuthContext.jsx             # Global auth state, login/logout, profile bootstrapping
├── pages/
│   ├── LandingPage.jsx             # Public marketing, hero, transparency, workflow
│   ├── LoginPage.jsx               # Candidate and recruiter authentication
│   ├── RegisterPage.jsx            # Account registration with role selection
│   ├── JobsPage.jsx                # Public job catalog with dynamic filtering
│   ├── JobDetailsPage.jsx          # Requisition breakdown and application launcher
│   ├── CandidateDashboard.jsx      # Candidate metrics, status breakdown, quick actions
│   ├── CandidateProfilePage.jsx    # Candidate profile creation and editing
│   ├── ApplicationsPage.jsx        # Candidate application tracker and history viewer
│   ├── InterviewsPage.jsx          # Candidate interview schedule viewer
│   ├── NotificationsPage.jsx       # Real-time alert list with read toggle
│   ├── RecruiterDashboard.jsx      # Recruiter overview, job counts, active applicants
│   ├── CompanyProfilePage.jsx      # Recruiter company setup and editing
│   ├── RecruiterJobsPage.jsx       # Recruiter requisition management list
│   ├── CreateJobPage.jsx           # Requisition creation and salary validation
│   └── JobApplicationsPage.jsx     # Recruiter applicant review and status editor
├── routes/
│   └── AppRoutes.jsx               # Declarative client-side routing and route guards
├── services/
│   ├── api.js                      # Axios instance with interceptors and base URL
│   ├── applications.js             # Application API client methods
│   ├── candidates.js               # Candidate API client methods
│   ├── companies.js                # Company API client methods
│   ├── interviews.js               # Interview API client methods
│   ├── jobs.js                     # Job API client methods
│   └── notifications.js            # Notification API client methods
└── utils/
    ├── errors.js                   # Unified FastAPI/Pydantic error message parser
    └── formatters.js               # Currency, date, and status formatting utilities
```

### Route Protection Model
- **`PublicRoute`**: Accessible only by unauthenticated guests; redirects authenticated users to `/`.
- **`ProtectedRoute`**: Requires an active JWT session; unauthenticated requests redirect to `/login`.
- **`RoleRoute`**: Enforces specific user roles (`["candidate"]` or `["recruiter"]`); unauthorized users redirect to `/`.

---

# 9. Backend Architecture

The backend is built with **FastAPI** following layered enterprise patterns:

```
Backend/app/
├── api/
│   ├── dependencies.py             # get_current_user, require_roles security dependencies
│   └── routes/
│       ├── applications.py         # Application lifecycle and history routes
│       ├── auth.py                 # Registration, login, and /auth/me routes
│       ├── candidates.py           # Candidate profile CRUD routes
│       ├── companies.py            # Company profile CRUD routes
│       ├── interviews.py           # Interview scheduling and management routes
│       ├── jobs.py                 # Job requisition catalog and search routes
│       └── notifications.py        # Candidate/recruiter notification routes
├── core/
│   ├── config.py                   # Pydantic BaseSettings for environment variables
│   └── security.py                 # Bcrypt hashing and JWT encoding/decoding
├── crud/
│   ├── applications.py             # Application database operations & audit logger
│   ├── candidates.py               # Candidate profile queries
│   ├── companies.py                # Company profile queries
│   ├── interviews.py               # Interview scheduling operations
│   ├── jobs.py                     # Job queries with search/filter clauses
│   ├── notifications.py            # Notification creation and read state updates
│   └── users.py                    # User creation and query operations
├── database/
│   ├── base.py                     # DeclarativeBase instance
│   └── connection.py               # Engine configuration and get_db session generator
├── models/
│   ├── application.py              # Application SQLAlchemy model
│   ├── application_status.py       # ApplicationStatusHistory SQLAlchemy model
│   ├── candidate.py                # CandidateProfile SQLAlchemy model
│   ├── company.py                  # Company SQLAlchemy model
│   ├── interview.py                # Interview SQLAlchemy model
│   ├── job.py                      # Job SQLAlchemy model
│   ├── notification.py             # Notification SQLAlchemy model
│   └── user.py                     # User SQLAlchemy model
├── schemas/
│   ├── application.py              # ApplicationCreate, ApplicationUpdate, ApplicationResponse
│   ├── auth.py                     # RegisterRequest, LoginRequest, TokenResponse
│   ├── candidate.py                # CandidateProfileCreate, CandidateProfileUpdate, CandidateProfileResponse
│   ├── company.py                  # CompanyCreate, CompanyUpdate, CompanyResponse
│   ├── interview.py                # InterviewCreate, InterviewUpdate, InterviewResponse
│   ├── job.py                      # JobCreate, JobUpdate, JobResponse
│   └── user.py                     # UserResponse
└── main.py                         # FastAPI instantiation, CORS, and router registration
```

---

# 10. Database Architecture

ClearHire utilizes a relational schema in **PostgreSQL** with foreign key constraints, cascading deletions, and unique indexes to preserve relational integrity.

```mermaid
erDiagram
    users ||--o| candidate_profiles : "has one (1:1)"
    users ||--o| companies : "owns one (1:1)"
    users ||--o{ notifications : "receives (1:N)"
    companies ||--o{ jobs : "publishes (1:N)"
    candidate_profiles ||--o{ applications : "submits (1:N)"
    jobs ||--o{ applications : "receives (1:N)"
    applications ||--o{ application_status_history : "records (1:N)"
    applications ||--o{ interviews : "schedules (1:N)"

    users {
        int id PK
        string name "VARCHAR(100)"
        string email "VARCHAR(255) UNIQUE"
        string password_hash "VARCHAR(255)"
        string role "VARCHAR(20)"
        datetime created_at "TIMESTAMPTZ"
    }

    candidate_profiles {
        int id PK
        int user_id FK "UNIQUE"
        string headline "VARCHAR(150)"
        text bio
        string location "VARCHAR(100)"
        text skills
        string resume_url "VARCHAR(500)"
    }

    companies {
        int id PK
        int user_id FK "UNIQUE"
        string name "VARCHAR(150)"
        text description
        string website "VARCHAR(255)"
        string location "VARCHAR(100)"
        string industry "VARCHAR(100)"
        datetime created_at "TIMESTAMPTZ"
    }

    jobs {
        int id PK
        int company_id FK
        string title "VARCHAR(150)"
        text description
        string location "VARCHAR(100)"
        string employment_type "VARCHAR(50)"
        string experience_level "VARCHAR(50)"
        int salary_min
        int salary_max
        text skills
        datetime application_deadline "TIMESTAMPTZ"
        datetime created_at "TIMESTAMPTZ"
        datetime updated_at "TIMESTAMPTZ"
    }

    applications {
        int id PK
        int candidate_id FK
        int job_id FK
        string status "VARCHAR(50)"
        datetime applied_at "TIMESTAMPTZ"
        int expected_response_days
    }

    application_status_history {
        int id PK
        int application_id FK
        string status "VARCHAR(50)"
        text note
        datetime changed_at "TIMESTAMPTZ"
    }

    interviews {
        int id PK
        int application_id FK
        string interview_type "VARCHAR(50)"
        datetime scheduled_at "TIMESTAMPTZ"
        int duration_minutes
        string meeting_link "VARCHAR(500)"
        text notes
        datetime created_at "TIMESTAMPTZ"
    }

    notifications {
        int id PK
        int user_id FK
        string title "VARCHAR(150)"
        text message
        boolean is_read
        datetime created_at "TIMESTAMPTZ"
    }
```

---

# 11. Authentication and Authorization

### 11.1 Authentication Mechanics
- **Stateless Tokens**: ClearHire generates signed JSON Web Tokens using HMAC-SHA256 (`HS256`).
- **Token Payload**: Contains `sub` (user primary key ID) and `role` (`candidate` or `recruiter`).
- **Token Transmission**: Passed by the frontend Axios interceptor via `Authorization: Bearer <token>`.
- **Password Security**: Passwords are encrypted using standard `bcrypt` hashing algorithms with salts.

### 11.2 Role-Based Access Control (RBAC)
Role validation is enforced at the FastAPI route boundary using the reusable dependency factory:
```python
current_user = Depends(require_roles("candidate"))  # Or require_roles("recruiter")
```

### 11.3 Resource Ownership Authorization
In addition to role checks, granular ownership checks prevent horizontal privilege escalation:
- **Candidate Profiles**: Candidates can view/modify only their own profile; recruiters have read access across profiles.
- **Company Profiles**: Recruiters can update/delete only the company entity tied to their authenticated `user_id`.
- **Job Requisitions**: Only the recruiter who created the parent company entity can edit or delete the job.
- **Applications**: Only the applicant candidate and the company owner of the requisition can view application history.
- **Interviews**: Only the recruiter owning the job requisition can schedule, update, or cancel interview sessions.

---

# 12. Validation and Error Handling

### 12.1 Backend Validation Rules
1. **User Registration**:
   - Name: 2 to 100 characters, trimmed of whitespace.
   - Email: RFC-compliant email string.
   - Password: Minimum 8 characters, maximum 128 characters, containing at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special symbol (`[!@#$%^&*(),.?":{}|<>\-_[\]/+=;'`~]`).
   - Role: Must strictly match `"candidate"` or `"recruiter"`.
2. **Job Postings**:
   - Salary Bounds: `@model_validator` asserts `salary_min <= salary_max` when both values exist.
   - Application Deadline: Must be a future timezone-aware UTC datetime.
   - Required Fields: Title (min 2 chars), Description (min 10 chars), Employment Type.
3. **Applications**:
   - Candidate Profile Required: Candidates must create a profile before applying.
   - Active Deadline: Submissions are rejected if the job application deadline has passed.
   - Uniqueness: Submissions are rejected with `409 Conflict` if the candidate already applied to the same job.
4. **Interviews**:
   - Scheduled Time: Must be strictly greater than current UTC datetime (`scheduled_at > datetime.now(timezone.utc)`).

### 12.2 Frontend Error Handling & Parsing
FastAPI returns 422 Unprocessable Entity errors as an array of error objects (`detail: [{ loc: [...], msg: "..." }]`). The frontend utilizes `src/utils/errors.js` to extract user-friendly error messages:
```javascript
export function getApiError(error, fallback = "Something went wrong.") {
  const detail = error?.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item?.msg).filter(Boolean).join(", ") || fallback;
  }
  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }
  if (error?.response?.status === 401) return "Your session has expired. Please log in again.";
  if (error?.response?.status === 403) return "You do not have permission to perform this action.";
  if (error?.response?.status === 404) return "The requested resource was not found.";
  if (error?.response?.status >= 500) return "The server encountered an error. Please try again.";
  return fallback;
}
```

---

# 13. Bug Fixes / Quality Improvements

| Bug | Problem Description | Root Cause | Engineering Fix Applied | Result |
|---|---|---|---|---|
| **1. Landing Page Section Separation** | The "Transparency" and "How It Works" landing page sections visually merged into a continuous unstructured block. | Both sections used identical transparent/white backgrounds without top borders or adequate padding. | Added distinct background contrast (`bg-zinc-50` vs `bg-white`), explicit border delimiters (`border-t border-zinc-100`), and generous vertical spacing (`py-28`). | Clean visual hierarchy and clear section boundaries. |
| **2. Role-Aware Navigation** | Authenticated users continued to see guest links ("How it works", "Log in") in the global navbar. | `Navbar.jsx` rendered public links unconditionally without checking `isAuthenticated` or `user.role`. | Refactored `Navbar.jsx` to conditionally render candidate links (`/dashboard`, `/applications`, `/interviews`, `/notifications`) or recruiter links (`/recruiter/dashboard`, `/recruiter/jobs`, `/recruiter/company`). | Role-appropriate navigation state across desktop and mobile menus. |
| **3. Application Deadline Comparison** | Submitting applications for jobs with UTC deadlines produced comparison errors or failed validation incorrectly. | `datetime.now()` naive timestamps were compared with timezone-aware database timestamps. | Enforced timezone normalization converting naive timestamps to UTC (`replace(tzinfo=timezone.utc)`). | Accurate and reliable deadline validation across all timezones. |
| **4. Interview Authorization & Scheduling** | Past interview dates were accepted, and non-owning recruiters could potentially manipulate interview sessions. | Missing future timestamp checks and absence of multi-entity recruiter ownership verification. | Added strict `scheduled_at <= datetime.now(timezone.utc)` rejection and verified `application.job.company.user_id == current_user.id`. | Guaranteed future interview scheduling and complete ownership isolation. |
| **5. Candidate Profile Access Control** | Profile create, update, and delete endpoints accepted any authenticated user without role enforcement. | Endpoints used generic `get_current_user` instead of `require_roles("candidate")`. | Applied `require_roles("candidate")` on mutations, isolated candidate listing to self-only, and opened full listing to recruiters. | Strong access control matching business rules. |
| **6. Job Salary Range & Deadline Enforcement** | Job creation and updates allowed inverted salary ranges (`salary_min > salary_max`) and past deadlines. | Missing Pydantic model validators and route-level validation on combined partial update payloads. | Added Pydantic `@model_validator` and backend route helpers calculating effective salary bounds. | Inverted salaries and past deadlines are consistently rejected with 422/400 codes. |
| **7. Notification Trigger Integration** | Application submission and interview scheduling events did not trigger persistent user notifications. | CRUD operations did not invoke notification generator side effects. | Added automated notification generation in `crud/applications.py` and `crud/interviews.py`. | Real-time candidate and recruiter alert tracking. |

---

# 14. Complete API Documentation

### Master Endpoint Summary Table

ClearHire exposes **35 RESTful endpoints** across **8 functional modules**:

| Module | Method | Endpoint | Authentication | Role / Access | Description | Success Status |
|---|---|---|---|---|---|---|
| **Root** | `GET` | `/` | Public | Everyone | Root health and welcome message | `200 OK` |
| **Auth** | `POST` | `/auth/register` | Public | Everyone | Register a new candidate or recruiter | `201 Created` |
| **Auth** | `POST` | `/auth/login` | Public | Everyone | Authenticate credentials and issue JWT | `200 OK` |
| **Auth** | `GET` | `/auth/me` | Bearer JWT | Authenticated | Retrieve authenticated user profile | `200 OK` |
| **Candidates** | `POST` | `/candidates` | Bearer JWT | Candidate | Create candidate resume profile | `201 Created` |
| **Candidates** | `GET` | `/candidates` | Bearer JWT | Candidate / Recruiter | List own profile (candidate) or all (recruiter) | `200 OK` |
| **Candidates** | `GET` | `/candidates/{profile_id}` | Bearer JWT | Candidate (Own) / Recruiter | Retrieve specific candidate profile | `200 OK` |
| **Candidates** | `PUT` | `/candidates/{profile_id}` | Bearer JWT | Candidate (Owner) | Update candidate profile | `200 OK` |
| **Candidates** | `DELETE` | `/candidates/{profile_id}` | Bearer JWT | Candidate (Owner) | Delete candidate profile | `204 No Content` |
| **Companies** | `POST` | `/companies` | Bearer JWT | Authenticated (Recruiter) | Create recruiter company profile | `201 Created` |
| **Companies** | `GET` | `/companies` | Bearer JWT | Authenticated | List all registered companies | `200 OK` |
| **Companies** | `GET` | `/companies/{company_id}` | Bearer JWT | Authenticated | Retrieve company profile details | `200 OK` |
| **Companies** | `PUT` | `/companies/{company_id}` | Bearer JWT | Recruiter (Owner) | Update company profile details | `200 OK` |
| **Companies** | `DELETE` | `/companies/{company_id}` | Bearer JWT | Recruiter (Owner) | Delete company profile | `204 No Content` |
| **Jobs** | `POST` | `/jobs` | Bearer JWT | Recruiter (with Company) | Create and publish a job requisition | `201 Created` |
| **Jobs** | `GET` | `/jobs` | Public | Everyone | Search and filter active job catalog | `200 OK` |
| **Jobs** | `GET` | `/jobs/my-jobs` | Bearer JWT | Recruiter | List jobs posted by recruiter's company | `200 OK` |
| **Jobs** | `GET` | `/jobs/{job_id}` | Public | Everyone | Retrieve specific job requisition details | `200 OK` |
| **Jobs** | `PUT` | `/jobs/{job_id}` | Bearer JWT | Recruiter (Owner) | Update job requisition details | `200 OK` |
| **Jobs** | `DELETE` | `/jobs/{job_id}` | Bearer JWT | Recruiter (Owner) | Delete job requisition | `204 No Content` |
| **Applications** | `POST` | `/applications` | Bearer JWT | Candidate | Submit application for a job requisition | `201 Created` |
| **Applications** | `GET` | `/applications/my-applications` | Bearer JWT | Candidate | List authenticated candidate applications | `200 OK` |
| **Applications** | `GET` | `/applications/job/{job_id}` | Bearer JWT | Recruiter (Job Owner) | List candidate applications for a job | `200 OK` |
| **Applications** | `GET` | `/applications/{application_id}` | Bearer JWT | Applicant / Job Owner | Retrieve application details | `200 OK` |
| **Applications** | `GET` | `/applications/{application_id}/history` | Bearer JWT | Applicant / Job Owner | Retrieve status transition audit history | `200 OK` |
| **Applications** | `PUT` | `/applications/{application_id}` | Bearer JWT | Applicant / Job Owner | Update application fields or status | `200 OK` |
| **Applications** | `DELETE` | `/applications/{application_id}` | Bearer JWT | Candidate (Owner) | Delete/withdraw submitted application | `204 No Content` |
| **Interviews** | `POST` | `/interviews` | Bearer JWT | Recruiter (Job Owner) | Schedule interview for an application | `201 Created` |
| **Interviews** | `GET` | `/interviews/application/{application_id}` | Bearer JWT | Applicant / Job Owner | List interviews scheduled for application | `200 OK` |
| **Interviews** | `GET` | `/interviews/{interview_id}` | Bearer JWT | Applicant / Job Owner | Retrieve specific interview details | `200 OK` |
| **Interviews** | `PUT` | `/interviews/{interview_id}` | Bearer JWT | Recruiter (Job Owner) | Update interview schedule/meeting link | `200 OK` |
| **Interviews** | `DELETE` | `/interviews/{interview_id}` | Bearer JWT | Recruiter (Job Owner) | Delete/cancel scheduled interview | `204 No Content` |
| **Notifications** | `GET` | `/notifications` | Bearer JWT | Authenticated | List all notifications for active user | `200 OK` |
| **Notifications** | `GET` | `/notifications/{notification_id}` | Bearer JWT | Notification Owner | Retrieve specific notification details | `200 OK` |
| **Notifications** | `PUT` | `/notifications/{notification_id}/read` | Bearer JWT | Notification Owner | Mark specific notification as read | `200 OK` |

---

# 15. API Authentication

ClearHire utilizes HTTP Bearer Authentication with JSON Web Tokens (RFC 7519).

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Authentication Lifecycle:
1. **Registration / Login**: The client submits credentials to `POST /auth/register` or `POST /auth/login`.
2. **Token Issuance**: The server generates a signed JWT encoded with the user's ID, role, and expiration timestamp.
3. **Client Storage**: The frontend stores the token in `localStorage` (`token`).
4. **Subsequent Invocations**: The Axios request interceptor injects the Bearer header on every HTTP request.
5. **Token Verification**: FastAPI's `HTTPBearer` security dependency extracts and decodes the token, verifying cryptographic integrity against `SECRET_KEY`.

---

# 16. Detailed API Endpoint Specifications

---

## 16.1 Root Module

### `GET /`
- **Authentication**: Public
- **Role**: Everyone
- **Purpose**: Server health check and welcome response.
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "ClearHire API is running"
  }
  ```

---

## 16.2 Authentication Module

### `POST /auth/register`
- **Authentication**: Public
- **Role**: Everyone
- **Purpose**: Register a new ClearHire candidate or recruiter account.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "password": "Password123!",
    "role": "candidate"
  }
  ```
- **Validation Rules**:
  - `name`: 2 to 100 characters.
  - `email`: Valid email format.
  - `password`: Minimum 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character.
  - `role`: Must be `"candidate"` or `"recruiter"`.
- **Success Response (`201 Created`)**:
  ```json
  {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "candidate",
    "created_at": "2026-10-01T10:00:00Z"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Invalid role specified.
  - `409 Conflict`: Email address is already registered.
  - `422 Unprocessable Entity`: Password complexity requirements not met.

---

### `POST /auth/login`
- **Authentication**: Public
- **Role**: Everyone
- **Purpose**: Authenticate user credentials and issue an access token.
- **Request Body**:
  ```json
  {
    "email": "jane.doe@example.com",
    "password": "Password123!"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Invalid email or password.
  - `422 Unprocessable Entity`: Invalid request payload.

---

### `GET /auth/me`
- **Authentication**: Bearer JWT
- **Role**: Authenticated User
- **Purpose**: Retrieve the active user's identity and role.
- **Success Response (`200 OK`)**:
  ```json
  {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "candidate",
    "created_at": "2026-10-01T10:00:00Z"
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Missing, invalid, or expired JWT.

---

## 16.3 Candidate Profile Module

### `POST /candidates`
- **Authentication**: Bearer JWT
- **Role**: Candidate
- **Purpose**: Create a candidate resume profile.
- **Request Body**:
  ```json
  {
    "headline": "Senior Full-Stack Engineer",
    "bio": "Passionate developer with 5+ years of experience in React and FastAPI.",
    "location": "San Francisco, CA",
    "skills": "React, Python, FastAPI, PostgreSQL, Docker",
    "resume_url": "https://example.com/resumes/janedoe.pdf"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "id": 1,
    "user_id": 1,
    "headline": "Senior Full-Stack Engineer",
    "bio": "Passionate developer with 5+ years of experience in React and FastAPI.",
    "location": "San Francisco, CA",
    "skills": "React, Python, FastAPI, PostgreSQL, Docker",
    "resume_url": "https://example.com/resumes/janedoe.pdf"
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: Authenticated user is not a candidate.
  - `409 Conflict`: Candidate profile already exists for this user.

---

### `GET /candidates`
- **Authentication**: Bearer JWT
- **Role**: Candidate (returns own profile) / Recruiter (returns all candidate profiles)
- **Success Response (`200 OK`)**:
  ```json
  [
    {
      "id": 1,
      "user_id": 1,
      "headline": "Senior Full-Stack Engineer",
      "bio": "Passionate developer with 5+ years of experience in React and FastAPI.",
      "location": "San Francisco, CA",
      "skills": "React, Python, FastAPI, PostgreSQL, Docker",
      "resume_url": "https://example.com/resumes/janedoe.pdf"
    }
  ]
  ```

---

### `GET /candidates/{profile_id}`
- **Authentication**: Bearer JWT
- **Role**: Candidate (Owner only) / Recruiter
- **Success Response (`200 OK`)**: Single `CandidateProfileResponse` object.
- **Error Responses**:
  - `403 Forbidden`: Candidate attempting to access another candidate's profile.
  - `404 Not Found`: Profile does not exist.

---

### `PUT /candidates/{profile_id}`
- **Authentication**: Bearer JWT
- **Role**: Candidate (Owner)
- **Request Body**: Partial or complete `CandidateProfileUpdate` fields.
- **Success Response (`200 OK`)**: Updated `CandidateProfileResponse`.
- **Error Responses**:
  - `403 Forbidden`: Profile does not belong to active candidate.
  - `404 Not Found`: Profile not found.

---

### `DELETE /candidates/{profile_id}`
- **Authentication**: Bearer JWT
- **Role**: Candidate (Owner)
- **Success Response (`204 No Content`)**: Empty response body.
- **Error Responses**:
  - `403 Forbidden`: Profile does not belong to active candidate.
  - `404 Not Found`: Profile not found.

---

## 16.4 Company Module

### `POST /companies`
- **Authentication**: Bearer JWT
- **Role**: Recruiter
- **Request Body**:
  ```json
  {
    "name": "Acme Innovations",
    "description": "Building next-generation cloud infrastructure.",
    "website": "https://acme.example.com",
    "location": "New York, NY",
    "industry": "Technology"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "id": 1,
    "user_id": 2,
    "name": "Acme Innovations",
    "description": "Building next-generation cloud infrastructure.",
    "website": "https://acme.example.com",
    "location": "New York, NY",
    "industry": "Technology"
  }
  ```
- **Error Responses**:
  - `409 Conflict`: Company profile already exists for this recruiter.

---

### `GET /companies`
- **Authentication**: Bearer JWT
- **Role**: Authenticated User
- **Success Response (`200 OK`)**: Array of `CompanyResponse` objects.

---

### `GET /companies/{company_id}`
- **Authentication**: Bearer JWT
- **Role**: Authenticated User
- **Success Response (`200 OK`)**: Single `CompanyResponse` object.
- **Error Responses**:
  - `404 Not Found`: Company not found.

---

### `PUT /companies/{company_id}`
- **Authentication**: Bearer JWT
- **Role**: Recruiter (Owner)
- **Success Response (`200 OK`)**: Updated `CompanyResponse`.
- **Error Responses**:
  - `403 Forbidden`: User does not own this company profile.
  - `404 Not Found`: Company not found.

---

### `DELETE /companies/{company_id}`
- **Authentication**: Bearer JWT
- **Role**: Recruiter (Owner)
- **Success Response (`204 No Content`)**: Empty response body.
- **Error Responses**:
  - `403 Forbidden`: User does not own this company profile.
  - `404 Not Found`: Company not found.

---

## 16.5 Job Module

### `POST /jobs`
- **Authentication**: Bearer JWT
- **Role**: Recruiter (Must have company created)
- **Request Body**:
  ```json
  {
    "title": "Senior Backend Developer",
    "description": "Lead our backend engineering efforts using FastAPI and PostgreSQL.",
    "location": "Remote",
    "employment_type": "Full-time",
    "experience_level": "Senior",
    "salary_min": 120000,
    "salary_max": 160000,
    "skills": "Python, FastAPI, PostgreSQL, Docker",
    "application_deadline": "2026-12-31T23:59:59Z"
  }
  ```
- **Validation Rules**:
  - `salary_min <= salary_max` (enforced via Pydantic model validator).
  - `application_deadline` must be in the future (UTC normalized).
- **Success Response (`201 Created`)**: `JobResponse` object.
- **Error Responses**:
  - `400 Bad Request`: Application deadline is in the past.
  - `404 Not Found`: Recruiter has not registered a company profile yet.
  - `422 Unprocessable Entity`: Minimum salary exceeds maximum salary.

---

### `GET /jobs`
- **Authentication**: Public
- **Role**: Everyone
- **Query Parameters**:
  - `search` (string, max 100): Filter by title, description, or skills.
  - `location` (string, max 100): Filter by job location.
  - `employment_type` (string, max 50): Filter by job type (e.g. Full-time, Remote).
  - `experience_level` (string, max 50): Filter by level (e.g. Junior, Mid, Senior).
- **Success Response (`200 OK`)**: Array of `JobResponse` objects.

---

### `GET /jobs/my-jobs`
- **Authentication**: Bearer JWT
- **Role**: Recruiter
- **Purpose**: List all job requisitions published by the recruiter's company.
- **Success Response (`200 OK`)**: Array of `JobResponse` objects.
- **Error Responses**:
  - `404 Not Found`: Company profile not found for recruiter.

---

### `GET /jobs/{job_id}`
- **Authentication**: Public
- **Role**: Everyone
- **Success Response (`200 OK`)**: Single `JobResponse` object.
- **Error Responses**:
  - `404 Not Found`: Job requisition not found.

---

### `PUT /jobs/{job_id}`
- **Authentication**: Bearer JWT
- **Role**: Recruiter (Job Owner)
- **Success Response (`200 OK`)**: Updated `JobResponse` object.
- **Error Responses**:
  - `400 Bad Request`: Updated application deadline is in the past.
  - `403 Forbidden`: Recruiter does not own this job posting.
  - `404 Not Found`: Job not found.
  - `422 Unprocessable Entity`: Effective minimum salary exceeds maximum salary.

---

### `DELETE /jobs/{job_id}`
- **Authentication**: Bearer JWT
- **Role**: Recruiter (Job Owner)
- **Success Response (`204 No Content`)**: Empty response body.
- **Error Responses**:
  - `403 Forbidden`: Recruiter does not own this job posting.
  - `404 Not Found`: Job not found.

---

## 16.6 Application Module

### `POST /applications`
- **Authentication**: Bearer JWT
- **Role**: Candidate
- **Request Body**:
  ```json
  {
    "job_id": 1,
    "expected_response_days": 7
  }
  ```
- **Validation Rules**:
  - Requires candidate profile to be registered.
  - Verifies job exists and application deadline has not passed.
  - Verifies candidate has not already applied (`409 Conflict`).
- **Success Response (`201 Created`)**:
  ```json
  {
    "id": 1,
    "candidate_id": 1,
    "job_id": 1,
    "status": "applied",
    "applied_at": "2026-10-01T11:00:00Z",
    "expected_response_days": 7
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Application deadline has passed.
  - `404 Not Found`: Candidate profile or job requisition not found.
  - `409 Conflict`: Candidate has already applied for this job.

---

### `GET /applications/my-applications`
- **Authentication**: Bearer JWT
- **Role**: Candidate
- **Success Response (`200 OK`)**: Array of `ApplicationResponse` objects submitted by the candidate.

---

### `GET /applications/job/{job_id}`
- **Authentication**: Bearer JWT
- **Role**: Recruiter (Must own the job posting)
- **Success Response (`200 OK`)**: Array of `ApplicationResponse` objects submitted for the specified job.
- **Error Responses**:
  - `403 Forbidden`: Recruiter does not own the job requisition.
  - `404 Not Found`: Job not found.

---

### `GET /applications/{application_id}`
- **Authentication**: Bearer JWT
- **Role**: Applicant Candidate or Requisition Recruiter
- **Success Response (`200 OK`)**: `ApplicationResponse` object.
- **Error Responses**:
  - `403 Forbidden`: User is neither the applicant nor the job owner.
  - `404 Not Found`: Application not found.

---

### `GET /applications/{application_id}/history`
- **Authentication**: Bearer JWT
- **Role**: Applicant Candidate or Requisition Recruiter
- **Purpose**: Retrieve the chronological status transition audit log.
- **Success Response (`200 OK`)**:
  ```json
  [
    {
      "id": 1,
      "application_id": 1,
      "status": "applied",
      "note": "Application submitted by candidate",
      "changed_at": "2026-10-01T11:00:00Z"
    },
    {
      "id": 2,
      "application_id": 1,
      "status": "under_review",
      "note": "Resume under technical screening",
      "changed_at": "2026-10-02T14:30:00Z"
    }
  ]
  ```

---

### `PUT /applications/{application_id}`
- **Authentication**: Bearer JWT
- **Role**: Candidate (fields) / Recruiter (status updates)
- **Request Body (Recruiter status transition)**:
  ```json
  {
    "status": "shortlisted",
    "expected_response_days": 5
  }
  ```
- **Allowed Statuses**: `applied`, `under_review`, `shortlisted`, `interview`, `offer`, `rejected`.
- **Success Response (`200 OK`)**: Updated `ApplicationResponse` object.
- **Error Responses**:
  - `400 Bad Request`: Invalid status value provided.
  - `403 Forbidden`: Candidate attempting to change application status.
  - `404 Not Found`: Application not found.

---

### `DELETE /applications/{application_id}`
- **Authentication**: Bearer JWT
- **Role**: Candidate (Owner)
- **Purpose**: Withdraw and delete a submitted job application.
- **Success Response (`204 No Content`)**: Empty body.
- **Error Responses**:
  - `403 Forbidden`: Candidate does not own the application.
  - `404 Not Found`: Application not found.

---

## 16.7 Interview Module

### `POST /interviews`
- **Authentication**: Bearer JWT
- **Role**: Recruiter (Job Owner)
- **Request Body**:
  ```json
  {
    "application_id": 1,
    "interview_type": "Technical Interview",
    "scheduled_at": "2026-10-15T15:00:00Z",
    "duration_minutes": 45,
    "meeting_link": "https://meet.google.com/abc-defg-hij",
    "notes": "System design and live coding assessment."
  }
  ```
- **Validation Rules**:
  - `scheduled_at` must be in the future (UTC).
  - Recruiter must own the job requisition associated with the application.
- **Success Response (`201 Created`)**:
  ```json
  {
    "id": 1,
    "application_id": 1,
    "interview_type": "Technical Interview",
    "scheduled_at": "2026-10-15T15:00:00Z",
    "duration_minutes": 45,
    "meeting_link": "https://meet.google.com/abc-defg-hij",
    "notes": "System design and live coding assessment.",
    "created_at": "2026-10-02T16:00:00Z"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Scheduled date and time is in the past.
  - `403 Forbidden`: Recruiter does not own this application's job.
  - `404 Not Found`: Application not found.

---

### `GET /interviews/application/{application_id}`
- **Authentication**: Bearer JWT
- **Role**: Applicant Candidate or Job Recruiter
- **Success Response (`200 OK`)**: Array of `InterviewResponse` objects.
- **Error Responses**:
  - `403 Forbidden`: Unauthorized user.
  - `404 Not Found`: Application not found.

---

### `GET /interviews/{interview_id}`
- **Authentication**: Bearer JWT
- **Role**: Applicant Candidate or Job Recruiter
- **Success Response (`200 OK`)**: Single `InterviewResponse` object.
- **Error Responses**:
  - `403 Forbidden`: Unauthorized user.
  - `404 Not Found`: Interview not found.

---

### `PUT /interviews/{interview_id}`
- **Authentication**: Bearer JWT
- **Role**: Recruiter (Job Owner)
- **Success Response (`200 OK`)**: Updated `InterviewResponse` object.
- **Error Responses**:
  - `400 Bad Request`: Updated scheduled time is in the past.
  - `403 Forbidden`: Recruiter does not own the interview session.
  - `404 Not Found`: Interview not found.

---

### `DELETE /interviews/{interview_id}`
- **Authentication**: Bearer JWT
- **Role**: Recruiter (Job Owner)
- **Success Response (`204 No Content`)**: Empty body.
- **Error Responses**:
  - `403 Forbidden`: Recruiter does not own the interview session.
  - `404 Not Found`: Interview not found.

---

## 16.8 Notification Module

### `GET /notifications`
- **Authentication**: Bearer JWT
- **Role**: Authenticated User
- **Success Response (`200 OK`)**:
  ```json
  [
    {
      "id": 1,
      "user_id": 1,
      "title": "Application Submitted",
      "message": "You successfully applied for Senior Backend Developer at Acme Innovations.",
      "is_read": false,
      "created_at": "2026-10-01T11:00:05Z"
    }
  ]
  ```

---

### `GET /notifications/{notification_id}`
- **Authentication**: Bearer JWT
- **Role**: Notification Owner
- **Success Response (`200 OK`)**: Single notification object.
- **Error Responses**:
  - `403 Forbidden`: Notification does not belong to active user.
  - `404 Not Found`: Notification not found.

---

### `PUT /notifications/{notification_id}/read`
- **Authentication**: Bearer JWT
- **Role**: Notification Owner
- **Success Response (`200 OK`)**: Updated notification object with `is_read: true`.
- **Error Responses**:
  - `403 Forbidden`: Notification does not belong to active user.
  - `404 Not Found`: Notification not found.

---

# 17. API Request / Response Examples

### Candidate Profile Creation Workflow
![Candidate Profile Visual](ClearHire-Job%20Portal/docs/profile.png)

```http
POST /candidates HTTP/1.1
Host: 127.0.0.1:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "headline": "Lead Frontend Architect",
  "bio": "Building reactive, accessible web systems.",
  "location": "Austin, TX",
  "skills": "React, TypeScript, Next.js, Tailwind CSS",
  "resume_url": "https://portfolio.example.com/resume.pdf"
}
```

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 4,
  "user_id": 12,
  "headline": "Lead Frontend Architect",
  "bio": "Building reactive, accessible web systems.",
  "location": "Austin, TX",
  "skills": "React, TypeScript, Next.js, Tailwind CSS",
  "resume_url": "https://portfolio.example.com/resume.pdf"
}
```

---

### Application Status Audit Trail
![Notification & Status Visual](ClearHire-Job%20Portal/docs/noti.png)

```http
GET /applications/4/history HTTP/1.1
Host: 127.0.0.1:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": 8,
    "application_id": 4,
    "status": "applied",
    "note": "Application submitted by candidate",
    "changed_at": "2026-10-02T09:15:00Z"
  },
  {
    "id": 9,
    "application_id": 4,
    "status": "under_review",
    "note": "Resume screened by technical lead",
    "changed_at": "2026-10-02T14:30:00Z"
  },
  {
    "id": 10,
    "application_id": 4,
    "status": "shortlisted",
    "note": "Approved for interview stage",
    "changed_at": "2026-10-03T11:00:00Z"
  }
]
```

---

# 18. HTTP Status Code Reference

| Status Code | Meaning in ClearHire | Typical Scenarios |
|---|---|---|
| **`200 OK`** | Request succeeded | Successful GET lookups, PUT updates, and login responses. |
| **`201 Created`** | Resource created | Successful registration, profile creation, job posting, application, or interview scheduling. |
| **`204 No Content`** | Action completed with no body | Successful DELETE operations on profiles, jobs, applications, or interviews. |
| **`400 Bad Request`** | Logical validation failure | Submitting applications after deadline, scheduling interviews in the past, invalid role strings. |
| **`401 Unauthorized`** | Missing or invalid authentication | Absent Bearer token, expired JWT token, or incorrect password. |
| **`403 Forbidden`** | Role or ownership authorization failure | Candidate attempting to view all profiles, modifying another user's job or application. |
| **`404 Not Found`** | Resource does not exist | Invalid profile ID, job ID, application ID, interview ID, or missing company profile. |
| **`409 Conflict`** | Unique constraint violation | Registering duplicate email, duplicate company profile, or duplicate job application. |
| **`422 Unprocessable Entity`** | Pydantic schema validation failure | Passwords not meeting complexity requirements, `salary_min > salary_max`, missing required fields. |
| **`500 Internal Server Error`** | Unhandled server exception | Database disconnection or unexpected runtime error. |

---

# 19. API Documentation Workflow

To maintain absolute schema fidelity between code and documentation, ClearHire employs the following systematic API documentation workflow:

```mermaid
flowchart TD
    A[Inspect Backend Route Files] --> B[Extract HTTP Verb & Decorator Paths]
    B --> C[Map FastAPI Dependencies & Auth Requirements]
    C --> D[Identify RBAC & Resource Ownership Rules]
    D --> E[Examine Pydantic Request & Response Models]
    E --> F[Trace CRUD Execution & Side Effects]
    F --> G[Document Error Conditions & Status Codes]
    G --> H[Validate Schema Contracts Against Swagger /docs]
    H --> I[Generate Production Documentation]
```

---

# 20. API Testing & Postman Verification

### Verification Matrix

The following test scenarios represent verified automated and manual test cases covering functional, security, and boundary behaviors:

| Test ID | Module | Endpoint | Method | Test Scenario | Expected Status | Result |
|---|---|---|---|---|---|---|
| **TC-01** | Auth | `/auth/register` | `POST` | Valid candidate registration with strong password | `201 Created` | Verified |
| **TC-02** | Auth | `/auth/register` | `POST` | Registration with duplicate email address | `409 Conflict` | Verified |
| **TC-03** | Auth | `/auth/register` | `POST` | Registration with weak password (missing special char) | `422 Unprocessable Entity` | Verified |
| **TC-04** | Auth | `/auth/login` | `POST` | Valid login credentials | `200 OK` (JWT issued) | Verified |
| **TC-05** | Auth | `/auth/login` | `POST` | Invalid password submission | `401 Unauthorized` | Verified |
| **TC-06** | Auth | `/auth/me` | `GET` | Retrieve profile with valid Bearer token | `200 OK` | Verified |
| **TC-07** | Candidates | `/candidates` | `POST` | Create candidate profile under candidate account | `201 Created` | Verified |
| **TC-08** | Candidates | `/candidates` | `POST` | Duplicate candidate profile creation attempt | `409 Conflict` | Verified |
| **TC-09** | Candidates | `/candidates` | `GET` | Candidate listing profiles (receives self-only) | `200 OK` (1 item) | Verified |
| **TC-10** | Candidates | `/candidates` | `GET` | Recruiter listing profiles (receives all profiles) | `200 OK` (N items) | Verified |
| **TC-11** | Companies | `/companies` | `POST` | Valid company profile creation by recruiter | `201 Created` | Verified |
| **TC-12** | Companies | `/companies` | `POST` | Duplicate company creation under same recruiter | `409 Conflict` | Verified |
| **TC-13** | Jobs | `/jobs` | `POST` | Create job posting with valid future deadline | `201 Created` | Verified |
| **TC-14** | Jobs | `/jobs` | `POST` | Create job posting with `salary_min > salary_max` | `422 Unprocessable Entity` | Verified |
| **TC-15** | Jobs | `/jobs` | `POST` | Create job with past application deadline | `400 Bad Request` | Verified |
| **TC-16** | Jobs | `/jobs` | `GET` | Public job catalog query with search & filter | `200 OK` | Verified |
| **TC-17** | Applications | `/applications` | `POST` | Submit valid application by candidate | `201 Created` | Verified |
| **TC-18** | Applications | `/applications` | `POST` | Duplicate application submission to same job | `409 Conflict` | Verified |
| **TC-19** | Applications | `/applications` | `POST` | Application submission after job deadline | `400 Bad Request` | Verified |
| **TC-20** | Applications | `/applications/{id}`| `PUT` | Recruiter updating application status | `200 OK` | Verified |
| **TC-21** | Applications | `/applications/{id}`| `PUT` | Candidate attempting to update status | `403 Forbidden` | Verified |
| **TC-22** | Interviews | `/interviews` | `POST` | Schedule interview with future date by job owner | `201 Created` | Verified |
| **TC-23** | Interviews | `/interviews` | `POST` | Schedule interview with past datetime | `400 Bad Request` | Verified |
| **TC-24** | Interviews | `/interviews` | `POST` | Scheduling interview by non-owning recruiter | `403 Forbidden` | Verified |
| **TC-25** | Notifications| `/notifications` | `GET` | List notifications for authenticated user | `200 OK` | Verified |
| **TC-26** | Notifications| `/notifications/{id}/read`| `PUT`| Mark notification as read | `200 OK` | Verified |

---

# 21. Deployment Architecture

ClearHire is engineered for containerized cloud deployments.

```mermaid
flowchart TD
    subgraph Frontend Hosting - Vercel / Nginx
        A[React 19 Static Production Build] --> B[Browser Clients]
    end

    subgraph Backend Container - Railway / Render / Docker
        C[FastAPI ASGI Application] --> D[Uvicorn Workers]
        D --> E[Environment Variables & Secrets]
    end

    subgraph Managed Persistence
        F[(PostgreSQL 16 Managed Database)]
    end

    B -->|HTTPS REST API Calls| C
    C -->|Encrypted TCP / Port 5432| F
```

> **Deployment Status**: Deployment preparation completed; production deployment pending.

---

# 22. Deployment Workflow

1. **Source Versioning**: Push verified codebase to GitHub repository on `main` branch.
2. **Database Provisioning**: Provision managed PostgreSQL instance (e.g. Supabase, Render, Railway, AWS RDS).
3. **Backend Container Build**:
   - Build backend Docker image (`Backend/Dockerfile`).
   - Configure environment variables: `DATABASE_URL`, `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`.
   - Deploy container on cloud PaaS (Railway / Render / AWS ECS).
4. **CORS Policy Alignment**: Update backend `allow_origins` in `app/main.py` to allow the production frontend domain.
5. **Frontend Build & Deployment**:
   - Set build environment variable `VITE_API_URL=https://api.yourdomain.com`.
   - Build optimized production bundle (`npm run build`).
   - Deploy to Vercel, Netlify, or Dockerized Nginx reverse proxy.
6. **Smoke Testing**: Verify authentication lifecycle, database connectivity, and CORS headers.

---

# 23. Docker Configuration

### 23.1 Backend Dockerfile (`Backend/Dockerfile`)
The backend uses an official Python 3.12 slim base image with bytecode optimization:
```dockerfile
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 23.2 Frontend Dockerfile (`Frontend/frontend/Dockerfile`)
The frontend employs a two-stage build with Node 22 Alpine for building and Nginx Alpine for serving static assets:
```dockerfile
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build


FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

> **Note**: Dockerfiles are present and validated for both backend and frontend services. Orchestration via Docker Compose is pending.

---

# 24. Environment Configuration

### Backend Environment Variables (`Backend/.env`)
```ini
# PostgreSQL Connection URI (psycopg driver)
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5433/job_portal

# Cryptographic Security
SECRET_KEY=your-secure-random-secret-key-at-least-32-chars-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Frontend Environment Variables (`Frontend/frontend/.env`)
```ini
# Base URL for FastAPI Backend
VITE_API_URL=http://127.0.0.1:8000
```

---

# 25. Project Structure

```
ClearHire-Job Portal/
├── Backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── dependencies.py      # Authentication & role guard dependencies
│   │   │   └── routes/              # Modular API route controllers
│   │   │       ├── applications.py
│   │   │       ├── auth.py
│   │   │       ├── candidates.py
│   │   │       ├── companies.py
│   │   │       ├── interviews.py
│   │   │       ├── jobs.py
│   │   │       └── notifications.py
│   │   ├── core/
│   │   │   ├── config.py            # Environment settings management
│   │   │   └── security.py          # Bcrypt hashing & JWT logic
│   │   ├── crud/                    # Direct database access queries
│   │   │   ├── applications.py
│   │   │   ├── candidates.py
│   │   │   ├── companies.py
│   │   │   ├── interviews.py
│   │   │   ├── jobs.py
│   │   │   ├── notifications.py
│   │   │   └── users.py
│   │   ├── database/
│   │   │   ├── base.py              # SQLAlchemy Base class
│   │   │   └── connection.py        # Engine & session generator
│   │   ├── models/                  # SQLAlchemy database entities
│   │   │   ├── application.py
│   │   │   ├── application_status.py
│   │   │   ├── candidate.py
│   │   │   ├── company.py
│   │   │   ├── interview.py
│   │   │   ├── job.py
│   │   │   ├── notification.py
│   │   │   └── user.py
│   │   ├── schemas/                 # Pydantic validation schemas
│   │   │   ├── application.py
│   │   │   ├── auth.py
│   │   │   ├── candidate.py
│   │   │   ├── company.py
│   │   │   ├── interview.py
│   │   │   ├── job.py
│   │   │   └── user.py
│   │   └── main.py                  # App entry point, CORS & routing
│   ├── .env                         # Local environment configuration
│   ├── .env.example                 # Safe environment template
│   ├── Dockerfile                   # Python container configuration
│   └── requirements.txt             # Python dependencies
│
├── Frontend/
│   └── frontend/
│       ├── public/                  # Static assets & icons
│       ├── src/
│       │   ├── assets/              # Branding images
│       │   ├── components/          # Reusable UI components
│       │   ├── context/             # AuthContext React state
│       │   ├── pages/               # Page views
│       │   ├── routes/              # AppRoutes & route protection guards
│       │   ├── services/            # Axios API client modules
│       │   ├── utils/               # Error parser & formatting helpers
│       │   ├── App.jsx              # Main App wrapper
│       │   ├── index.css            # Tailwind CSS styling directives
│       │   └── main.jsx             # React DOM root entry
│       ├── .env                     # Local frontend environment
│       ├── .env.example             # Frontend environment template
│       ├── Dockerfile               # Multi-stage Node/Nginx container
│       ├── package.json             # NPM dependencies & scripts
│       └── vite.config.js           # Vite build tooling configuration
│
└── docs/                            # Screenshot & architecture assets
    ├── backend.png
    ├── frontend.png
    ├── noti.png
    ├── profile.png
    └── reg (1).png
```

---

# 26. Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | React | `^19.2.8` | Declarative component UI rendering |
| **Build Tooling** | Vite | `^8.3.0` | High-speed module bundler and dev server |
| **Styling** | Tailwind CSS | `^4.3.3` | Utility-first responsive design tokens |
| **Client Routing** | React Router DOM | `^7.18.4` | Client-side routing, protected routes, and redirects |
| **HTTP Client** | Axios | `^1.20.0` | Promise-based HTTP client with request interceptors |
| **Backend Framework** | FastAPI | `>=0.115.0` | High-performance Python REST API framework |
| **ASGI Server** | Uvicorn | `^0.30.0` | Asynchronous Server Gateway Interface |
| **ORM** | SQLAlchemy | `^2.0.0` | Object-Relational Mapping & relational querying |
| **Database Driver** | Psycopg (Binary) | `^3.1.0` | Native PostgreSQL communication driver |
| **Database** | PostgreSQL | `16+` | Persistent relational database storage |
| **Data Validation** | Pydantic / Pydantic Settings | `^2.7.0` | Schema parsing, type enforcement, and settings validation |
| **Authentication / JWT** | Python-Jose | `^3.3.0` | Cryptographic JSON Web Token encoding and verification |
| **Password Hashing** | Passlib & Bcrypt | `bcrypt==4.3.0` | Salted password encryption |
| **Containerization** | Docker | Latest | Multi-stage image building and runtime isolation |
| **Source Control** | Git & GitHub | Latest | Version control, collaboration, and history tracking |

---

# 27. DSA / Problem Solving

During ClearHire's engineering lifecycle, practical algorithmic problem solving and time-complexity trade-offs were evaluated:

### 1. Hash Map Lookups vs Linear Search
- **Linear Search**: $O(n)$ time complexity. Iterating through applicant or job lists without keys requires inspecting each element.
- **Hash Table Lookup**: $O(1)$ average time complexity. Utilized in candidate lookups by ID and JWT claims decoding (`users_by_id`, `tokens_by_sub`).

### 2. Duplicate Detection
- **In-Memory Set Check**: $O(n)$ time, $O(n)$ space. Utilized in application uniqueness verification (`seen = set()`) and email duplicate lookups before committing to database.

```python
def contains_duplicate(arr):
    seen = set()
    for value in arr:
        if value in seen:
            return True
        seen.add(value)
    return False
```

### 3. Two Sum Pattern (Lookup Matching)
- **Brute Force**: $O(n^2)$ time.
- **Optimized Hash Map**: $O(n)$ time, $O(n)$ auxiliary space. Mirrors candidate-to-job matching patterns by mapping required skills against candidate capability sets.

```python
def two_sum(arr, target):
    seen = {}
    for i, value in enumerate(arr):
        required = target - value
        if required in seen:
            return [seen[required], i]
        seen[value] = i
    return []
```

### 4. Database Query Filtering Complexity
- **Sequential Scan**: $O(n)$ when querying unindexed text fields (`jobs.title ILIKE %...%`).
- **Indexed B-Tree Scan**: $O(\log n)$ for primary keys, foreign keys (`job_id`, `candidate_id`), and unique email lookups.

---

# 28. Scalability Considerations

To support scaling ClearHire to thousands of concurrent users, the following architectural optimizations are planned:

```
[Client Traffic]
       │
       ▼
[Cloudflare / CDN] (Static React Caching & DDoS Mitigation)
       │
       ▼
[Load Balancer] (NGINX / AWS ALB)
   ┌───┴───┐
   ▼       ▼
[FastAPI Node 1] [FastAPI Node 2] (Horizontal Stateless Scaling)
   └───┬───┘
       ├──────────────────────────────┐
       ▼                              ▼
[Redis Cache] (Session / Job Cache)  [PostgreSQL Primary] (Writes)
                                      └───┬───┘
                                          ▼
                                    [Read Replicas] (Job Search Queries)
```

1. **Database Indexing**: Add composite B-tree indexes on `jobs(company_id, created_at)` and `applications(candidate_id, job_id)` to ensure $O(\log n)$ lookup performance.
2. **Full-Text Search Engine**: Replace `ILIKE` database queries with PostgreSQL `tsvector`/GIN indexes or dedicated Elasticsearch clusters.
3. **Caching Layer**: Integrate **Redis** to cache frequently queried job listings and company summaries.
4. **Asynchronous Background Workers**: Introduce **Celery** or **ARQ** with Redis/RabbitMQ to handle email alerts and interview calendar synchronizations off the main request thread.
5. **Object Storage**: Store uploaded candidate resumes in AWS S3 or Cloudflare R2 rather than external URL strings.

---

# 29. Local Setup and Installation

### Prerequisites
- **Python** 3.11 or 3.12
- **Node.js** 20+ and **npm** 10+
- **PostgreSQL** 15+ running locally (or via Docker)
- **Git**

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/KSAISUCHITH/Linkific-Internship-Tracker.git
cd "Linkific-Internship-Tracker/Task 29/ClearHire-Job Portal"
```

---

### Step 2: Backend Setup
```bash
# Navigate to Backend directory
cd Backend

# Create and activate Python virtual environment
python -m venv venv

# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Copy .env.example to .env and verify database credentials
cp .env.example .env
```

---

### Step 3: Frontend Setup
```bash
# Navigate to Frontend directory
cd ../Frontend/frontend

# Install NPM packages
npm install

# Configure frontend environment variables
# Copy .env.example to .env
cp .env.example .env
```

---

# 30. Running the Application

### 1. Start the FastAPI Backend Server
```bash
cd Backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- **Backend API**: `http://127.0.0.1:8000`
- **Swagger Interactive API Documentation**: `http://127.0.0.1:8000/docs`
- **ReDoc Documentation**: `http://127.0.0.1:8000/redoc`

---

### 2. Start the Vite React Frontend
```bash
cd Frontend/frontend
npm run dev
```
- **Frontend Application**: `http://localhost:5173`

---

# 31. Git / GitHub Workflow

The ClearHire codebase is maintained within the `Linkific-Internship-Tracker` repository on branch `main`.

### Git Practices Followed:
- **Clean Separation of Concerns**: Task milestones are segregated into distinct task directories (`Task 23` through `Task 29`).
- **Atomic, Meaningful Commits**: Feature integration, validation hardening, bug fixes, and documentation milestones are committed systematically.
- **Zero Secret Exposure**: `.gitignore` rules prevent `.env`, virtual environments (`venv/`), `node_modules/`, and database binaries from entering version control.

---

# 32. Final Project Verification

| Subsystem / Area | Verification Item | Status |
|---|---|---|
| **Authentication** | Registration, bcrypt hashing, JWT issuance, `/auth/me` | Verified |
| **Candidate Workflow** | Profile creation, job discovery, application submission | Verified |
| **Recruiter Workflow** | Company creation, job posting, applicant reviewing | Verified |
| **Application Tracking** | Real-time status transitions, audit history timeline | Verified |
| **Interview Scheduling** | Future UTC scheduling, recruiter authorization guards | Verified |
| **Notifications** | Automated event alerts, unread counters, mark as read | Verified |
| **Backend Validation** | Pydantic models, salary range rules, password complexity | Verified |
| **Error Handling** | Centralized API error parsing in frontend utilities | Verified |
| **API Documentation** | Complete coverage of 35 verified endpoints | Verified |
| **Containerization** | Dockerfiles for backend and frontend | Verified |
| **Deployment Preparation**| CORS configuration, environment templates | Deployment Ready |

---

# 33. Final Submission Package

The completed ClearHire submission package includes:
1. **Source Code**:
   - `Backend/`: FastAPI REST application, SQLAlchemy ORM models, Pydantic schemas, and CRUD services.
   - `Frontend/frontend/`: React 19 SPA, Tailwind CSS styles, AuthContext, and route guards.
2. **Container Build Definitions**:
   - `Backend/Dockerfile`
   - `Frontend/frontend/Dockerfile`
3. **Configuration Templates**:
   - `Backend/.env.example`
   - `Frontend/frontend/.env.example`
4. **Documentation**:
   - `README.md`: Production-ready technical documentation covering all 33 required sections.
5. **Assets & Media**:
   - `docs/`: UI verification screenshots and architecture artifacts.

---

# 34. Learning Outcomes

Building ClearHire provided extensive full-stack software engineering proficiency:
- **FastAPI Framework Mastery**: Implementing dependency injection, custom middleware, Pydantic validation, and OpenAPI documentation.
- **Relational Data Modeling**: Architecting complex foreign key relationships, cascade behaviors, and audit history tracking in PostgreSQL with SQLAlchemy 2.0.
- **Stateless Security Architecture**: Designing JWT-based role-based access control (RBAC) and defending against horizontal privilege escalation.
- **Modern React 19 Patterns**: Managing global authentication state with React Context, building declarative route guards, and structuring modular API services with Axios interceptors.
- **Software Quality Assurance**: Systematically diagnosing root causes, hardening edge-case validations (timezone normalization, salary range bounds), and executing API test suites.
- **Containerization**: Writing multi-stage Docker builds to package Python ASGI apps and React/Nginx static web servers.

---

# 35. Challenges and Solutions

1. **Timezone Inconsistencies in Deadline Comparisons**:
   - *Challenge*: Comparing local browser naive datetimes against PostgreSQL UTC timestamps caused deadline validation errors.
   - *Solution*: Implemented a backend normalization helper `normalize_datetime()` enforcing `replace(tzinfo=timezone.utc)` across all incoming datetimes.
2. **FastAPI Nested Validation Error Extraction**:
   - *Challenge*: Pydantic validation errors returned complex nested arrays (`detail: [{ loc, msg }]`) that rendered poorly in standard UI alerts.
   - *Solution*: Developed a centralized parsing utility `getApiError()` in `src/utils/errors.js` to unwrap nested validation arrays into clean, actionable string messages.
3. **Multi-Entity Ownership Verification**:
   - *Challenge*: Ensuring recruiters can only schedule interviews or update applications for jobs belonging to their own company required traversing multiple relational joins.
   - *Solution*: Implemented multi-tier dependency validation checking `application.job.company.user_id == current_user.id` before executing mutation operations.

---

# 36. Future Improvements

The following architectural enhancements are planned for future releases:
- **Direct Resume File Uploads**: Integrate Amazon S3 or Cloudflare R2 for PDF resume uploads with automatic virus scanning.
- **Real-Time WebSockets**: Replace polling-based notification fetching with FastAPI WebSocket connections.
- **Full-Text Job Search**: Integrate PostgreSQL `tsvector` full-text search indexing or an external Meilisearch instance.
- **Automated Email Notifications**: Connect SendGrid or AWS SES for instant email dispatch on status changes.
- **Recruiter Analytics Dashboard**: Visual charts showing applicant drop-off rates, time-to-hire metrics, and requisition performance.

---

# 37. Conclusion

**ClearHire** is a full-featured, secure, and production-ready Job Portal System engineered with modern software design principles. By combining **React 19**, **FastAPI**, **SQLAlchemy**, and **PostgreSQL**, ClearHire delivers a responsive user experience paired with robust backend data integrity.

From candidate profile creation and transparent application tracking to recruiter requisition management and interview scheduling, ClearHire establishes a scalable foundation for modern recruitment workflows.
