# Task 23 - Frontend,Backend and Database configuration with JWT Authorization setup

# ClearHire — Transparent Job Portal System

> **A full-stack, transparency-driven recruitment platform designed to eliminate hiring ambiguity, streamline candidate tracking, and bring structured visibility to every stage of the recruitment lifecycle.**

---

## Overview

Finding and securing job opportunities is often an opaque, disconnected, and stressful experience for job seekers. Candidates invest time tailoring resumes, completing assessments, and attending interviews, only to be met with prolonged silence—commonly referred to in modern hiring as the "application black hole."

**ClearHire** is a full-stack job portal built to solve this problem by introducing structural accountability and real-time visibility into the hiring process. Developed on a modern architecture combining a **FastAPI (Python)** backend, **React (Vite)** frontend, and **PostgreSQL** relational database, ClearHire establishes a cohesive platform where job discovery, application submissions, and post-application progress are clear, trackable, and verifiable.

---

## Problem Statement

In conventional job search platforms, communication between employers and applicants often breaks down immediately after an application is submitted:

* **Post-Application Uncertainty:** Once an application is submitted, candidates typically receive an automated acknowledgment email and no subsequent updates. Whether the resume was reviewed, shortlisted, or set aside remains unknown.
* **Disorganized Application Tracking:** Candidates applying to multiple positions across disparate job boards have no unified interface to monitor where each submission stands.
* **The "Ghosting" Dilemma:** In modern recruitment discussions, "applicant ghosting" refers to the scenario where a candidate completes one or more stages of the hiring funnel and never receives follow-up communication or a closing decision. While organizations often face high applicant volumes and lack lightweight pipeline management tools, the outcome for job seekers is persistent uncertainty and disrupted career planning.
* **Lack of Timelines:** Job listings rarely communicate how long a review cycle will take, leaving candidates guessing whether an application is still under consideration or abandoned.

### ClearHire's Approach

ClearHire is engineered around the principle that **application progress should be visible and trackable**:

1. **Explicit Lifecycle States:** Standardized application stages (*Applied*, *Screening*, *Interviewing*, *Offered*, *Archived*) eliminate ambiguous holding patterns.
2. **Audit History & Timelines:** A timestamped audit log of every status transition keeps candidates informed at every milestone.
3. **Committed Response Windows:** Employers declare anticipated review timeframes upfront on job requisitions.
4. **Overdue Indicators & Reminders:** Applications exceeding committed review windows are visibly flagged, prompting hiring teams to deliver timely updates.

---

## Project Vision

ClearHire is structured around a three-stage candidate journey:

```
+------------------+          +------------------+          +------------------+
|     DISCOVER     |   --->   |      APPLY       |   --->   |      TRACK       |
|  Verified Roles  |          | Frictionless Sub |          | Real-Time Status |
|  Clear Timelines |          | Profile Delivery |          | Transparent SLA  |
+------------------+          +------------------+          +------------------+
```

* **Discover:** Explore job opportunities with clear requirements, compensation bands, and explicit expected response periods.
* **Apply:** Submit applications seamlessly using a centralized candidate profile, resume, and portfolio details.
* **Track:** Monitor progress in real time with milestone progress bars, status audit logs, and response-overdue indicators.

**Post-application transparency is ClearHire's core differentiator.** Rather than ending candidate engagement at submission, the platform makes the review process observable from start to finish.

---

## Task-23 Objectives

Today's milestone (**Task-23**, *Date: 24/09/2026*) establishes the core full-stack architectural foundation and secure authentication system for ClearHire:

* [x] **React Application:** Initialize modern frontend with Vite, Tailwind CSS, and React Router DOM.
* [x] **FastAPI Application:** Scaffold high-performance asynchronous Python backend with modular separation of concerns.
* [x] **Database Configuration:** Configure PostgreSQL connection via SQLAlchemy ORM and the Psycopg (v3) binary driver.
* [x] **User Registration & Login:** Implement end-to-end registration with role assignment (`candidate` / `recruiter`) and credential-based login.
* [x] **JWT Authentication:** Configure JSON Web Token issuance, signing, expiration, and cryptographic verification.
* [x] **Project Organization:** Establish industry-standard layered architecture across frontend and backend codebases.
* [x] **Environment Configuration:** Manage sensitive settings via `.env` files using Pydantic Settings and Vite environment variables.
* [x] **Secure Authentication Concepts:** Practice password hashing with bcrypt, salting principles, and stateless token verification.
* [x] **React Authentication Flow:** Build centralized `AuthContext`, Axios request interceptors, and public/protected routing guards.
* [x] **Algorithm & Development Practice:** Formulate pseudocode for login logic, token decoding, and authentication lifecycle synchronization.

---

## Current Features

Only features fully implemented in the codebase are listed below:

### Frontend
* **Vite-Powered React 19 Client:** Fast HMR, clean ES module bundling, and modern UI rendering.
* **Tailwind CSS v4 Styling:** Minimalist, typography-focused UI using custom `@theme` variables, smooth transitions, and glassmorphic navigation headers.
* **Global Authentication State (`AuthContext`):** Reactive context managing `user`, `loading`, `isAuthenticated`, `login`, `register`, and `logout`.
* **Session Hydration on Startup:** Automatic token validation and user profile restoration from `/auth/me` on application boot.
* **Axios Request Interceptor:** Centralized API client automatically injecting `Authorization: Bearer <token>` into outbound HTTP requests.
* **Declarative Client-Side Routing:**
  * Public routes (`/login`, `/register`) with automatic redirection to `/` when authenticated.
  * Extensible protected route wrapper (`ProtectedRoute`) for future authenticated dashboards.
  * Fallback catch-all redirecting unknown paths to `/`.
* **Polished Landing Page (`LandingPage.jsx`):** Product introduction highlighting the "Discover → Apply → Track" methodology, interactive transparency preview, and live authentication status indicator.
* **Authentication UI (`LoginPage.jsx` & `RegisterPage.jsx`):** Responsive split-screen layouts, inline validation, role toggle (`candidate` vs `recruiter`), password length checks, confirm-password matching, and alert messaging.

### Backend
* **Modular FastAPI Architecture:** Decoupled design dividing responsibilities across `api`, `core`, `crud`, `database`, `models`, `schemas`, and `services`.
* **Automatic OpenAPI Documentation:** Interactive Swagger UI (`/docs`) and ReDoc (`/redoc`) generated directly from Pydantic schemas.
* **CORS Middleware:** Configured cross-origin resource sharing allowing local React client requests with credentials.
* **Pydantic Validation:** Strict request/response validation ensuring email formatting, password length constraints, and schema conformance.
* **Health Check Endpoint:** Root endpoint (`GET /`) verifying API availability.

### Authentication
* **Password Hashing:** Passwords hashed with **bcrypt** (via `passlib.context.CryptContext`) utilizing automatic salt generation.
* **Credential Verification:** Constant-time password hash verification against stored database records.
* **Duplicate Email Prevention:** Database-level uniqueness constraint and pre-registration existence checks returning HTTP 409 Conflict.
* **JWT Access Token Issuance:** Tokens signed using the `HS256` symmetric algorithm with configurable validity windows (default: 60 minutes).
* **Token Verification & Extraction:** Cryptographic decoding verifying token integrity, payload validity, and extracting user identity (`sub`).
* **Dependency Injection (`get_current_user`):** FastAPI `HTTPBearer` security dependency extracting tokens from headers, validating payloads, and resolving the active database user.
* **User Identity Endpoint (`GET /auth/me`):** Protected route returning the authenticated user's profile.

### Database
* **SQLAlchemy ORM Integration:** Declarative base modeling mapped to PostgreSQL tables.
* **Automatic Table Generation:** `Base.metadata.create_all(bind=engine)` ensuring database schema sync on backend startup.
* **Session Lifecycle Management:** Scoped dependency (`get_db`) yielding sessions per request with guaranteed closure in `finally` blocks.
* **Users Table Schema:** Persisting primary keys, user full names, unique indexed emails, hashed passwords, roles, and timezone-aware creation timestamps.

---

## Technology Stack

The project relies strictly on the following installed dependencies and frameworks:

### Frontend
| Technology | Version / Spec | Purpose |
| :--- | :--- | :--- |
| **React** | `^19.2.8` | Declarative UI component library |
| **React DOM** | `^19.2.8` | DOM rendering layer for React |
| **Vite** | `^8.3.0` | Next-generation frontend build tool and dev server |
| **Tailwind CSS** | `^4.3.3` | Utility-first styling framework |
| **@tailwindcss/vite** | `^4.3.3` | Native Vite plugin integration for Tailwind v4 |
| **Axios** | `^1.20.0` | Promise-based HTTP client with request interceptors |
| **React Router DOM** | `^7.18.4` | Client-side routing and route-level navigation guards |

### Backend
| Technology | Version / Spec | Purpose |
| :--- | :--- | :--- |
| **Python** | `3.10+` | Backend runtime environment |
| **FastAPI** | Latest | Asynchronous ASGI web framework for building APIs |
| **Uvicorn[standard]** | Latest | High-throughput lightning-fast ASGI server |
| **SQLAlchemy** | Latest | Enterprise-grade Object Relational Mapper (ORM) |
| **Psycopg[binary]** | Latest (v3) | High-performance PostgreSQL database driver |
| **Pydantic** | Latest (v2) | Data validation, parsing, and serialization |
| **Pydantic Settings** | Latest | Environment variable loading from `.env` |
| **python-jose[cryptography]**| Latest | JOSE implementation for encoding/decoding JWTs |
| **passlib[bcrypt]** | Latest | Password hashing library |
| **bcrypt** | `4.3.0` | Cryptographic password hashing algorithm |
| **email-validator** | Latest | Email format validation for Pydantic `EmailStr` |

### Database & Tooling
| Technology | Specification | Purpose |
| :--- | :--- | :--- |
| **PostgreSQL** | Relational Database | Persistent data storage |
| **Git & GitHub** | Version Control | Source code management |

---

## System Architecture

ClearHire follows a decoupled, multi-tier client-server architecture:

```
+-------------------------------------------------------------------------+
|                              USER BROWSER                               |
+-------------------------------------------------------------------------+
                                    |
                                    | HTTP / HTTPS
                                    v
+-------------------------------------------------------------------------+
|                        REACT FRONTEND (Vite)                            |
|                                                                         |
|   +-----------------------+     +-----------------------------------+   |
|   | Pages (Landing/Auth)  |     | Context (AuthContext)             |   |
|   +-----------------------+     +-----------------------------------+   |
|               |                                   |                     |
|               +-----------------+-----------------+                     |
|                                 v                                       |
|                     +-----------------------+                           |
|                     | Axios API Interceptor |                           |
|                     | (Injects JWT Bearer)  |                           |
|                     +-----------------------+                           |
+-------------------------------------------------------------------------+
                                    |
                                    | RESTful JSON API Calls
                                    v
+-------------------------------------------------------------------------+
|                         FASTAPI BACKEND                                 |
|                                                                         |
|   +-----------------------------------------------------------------+   |
|   | API Routes (/auth/register, /auth/login, /auth/me, /)           |   |
|   +-----------------------------------------------------------------+   |
|            |                                           |                |
|            v                                           v                |
|   +-------------------------+                 +---------------------+   |
|   | Security & Auth Dep     |                 | Validation Layer    |   |
|   | (HTTPBearer, JWT Decode)|                 | (Pydantic Schemas)  |   |
|   +-------------------------+                 +---------------------+   |
|            |                                           |                |
|            +--------------------+----------------------+                |
|                                 v                                       |
|   +-----------------------------------------------------------------+   |
|   | Business Logic Services (register_user, authenticate_user)      |   |
|   +-----------------------------------------------------------------+   |
|                                 |                                       |
|                                 v                                       |
|   +-----------------------------------------------------------------+   |
|   | Data Access Layer (CRUD: get_user_by_email, create_user)        |   |
|   +-----------------------------------------------------------------+   |
|                                 |                                       |
|                                 v                                       |
|   +-----------------------------------------------------------------+   |
|   | SQLAlchemy ORM Models (User Entity)                             |   |
|   +-----------------------------------------------------------------+   |
+-------------------------------------------------------------------------+
                                    |
                                    | PostgreSQL Protocol (Psycopg v3)
                                    v
+-------------------------------------------------------------------------+
|                         POSTGRESQL DATABASE                             |
|                           (Table: users)                                |
+-------------------------------------------------------------------------+
```

### Layer Responsibilities
* **Frontend Presentation Tier (`src/pages`, `src/routes`):** Delivers responsive UI views and handles client-side route protection.
* **Frontend State Tier (`src/context`, `src/services`):** Manages user session state, local token caching, and automated request authorization header injection.
* **API Routing Tier (`app/api/routes`):** Receives HTTP requests, executes status code mappings, and routes commands to domain services.
* **Security & Dependency Tier (`app/api/dependencies`, `app/core/security`):** Validates Bearer tokens, decrypts/decodes claims, checks token expiration, and resolves the current user context.
* **Business Logic Tier (`app/services`):** Implements business rules such as verifying duplicate emails, hashing passwords, and orchestrating authentication credentials.
* **Data Access Tier (`app/crud`):** Executes queries against the database without polluting routing endpoints with ORM mechanics.
* **Persistence Tier (`app/database`, `app/models`):** Manages connection pools, handles database sessions, and defines table structures via SQLAlchemy declarative models.

---

## Project Structure

The repository structure matches the installed application layout:

```
ClearHire-Job Portal/
├── .gitignore
├── README.md
├── docs/
├── Backend/
│   ├── .env
│   ├── .env.example
│   ├── requirements.txt
│   ├── venv/
│   └── app/
│       ├── __init__.py
│       ├── main.py                   # FastAPI entrypoint, CORS & DB setup
│       ├── api/
│       │   ├── __init__.py
│       │   ├── dependencies.py       # HTTPBearer & get_current_user dependency
│       │   └── routes/
│       │       ├── __init__.py
│       │       └── auth.py           # /auth/register, /auth/login, /auth/me
│       ├── core/
│       │   ├── __init__.py
│       │   ├── config.py             # Pydantic Settings (.env configuration)
│       │   └── security.py           # Bcrypt hashing & JWT encode/decode
│       ├── crud/
│       │   ├── __init__.py
│       │   └── users.py              # User retrieval and creation queries
│       ├── database/
│       │   ├── __init__.py
│       │   ├── base.py               # SQLAlchemy declarative base
│       │   └── connection.py         # Engine, sessionmaker, get_db generator
│       ├── models/
│       │   ├── __init__.py
│       │   └── user.py               # SQLAlchemy User table definition
│       ├── schemas/
│       │   ├── __init__.py
│       │   ├── auth.py               # RegisterRequest, LoginRequest, TokenResponse
│       │   └── user.py               # UserResponse DTO
│       └── services/
│           ├── __init__.py
│           └── auth.py               # register_user, authenticate_user, login_user
└── Frontend/
    └── frontend/
        ├── .env
        ├── .env.example
        ├── .gitignore
        ├── eslint.config.js
        ├── index.html
        ├── package.json
        ├── package-lock.json
        ├── vite.config.js
        ├── public/
        └── src/
            ├── App.css
            ├── App.jsx               # Root component with AuthProvider
            ├── index.css             # Tailwind v4 configuration & root styles
            ├── main.jsx              # React DOM mounting & BrowserRouter
            ├── assets/
            ├── context/
            │   └── AuthContext.jsx   # Auth provider, user state, login/logout
            ├── pages/
            │   ├── LandingPage.jsx   # Marketing page with live auth state
            │   ├── LoginPage.jsx     # Login form with split-screen layout
            │   └── RegisterPage.jsx  # Registration form with role selector
            ├── routes/
            │   └── AppRoutes.jsx     # Route declarations, PublicRoute & ProtectedRoute
            └── services/
                └── api.js            # Axios instance with auth interceptor
```

---

## Authentication Architecture

Authentication is the central technical achievement of Task-23. ClearHire implements a stateless, token-based authentication mechanism using standard JWTs signed with `HS256`.

### 1. User Registration Flow

```
User (Browser)
      |
      | 1. Submit Name, Email, Password, Role
      v
React RegisterPage.jsx
      |
      | 2. Client-side length & matching validation
      | 3. POST /auth/register
      v
FastAPI Router (app/api/routes/auth.py)
      |
      | 4. Validate payload against RegisterRequest schema
      v
Auth Service (app/services/auth.py)
      |
      | 5. get_user_by_email() -> Check if email exists
      |    (If exists: raise ValueError -> 409 Conflict)
      | 6. hash_password() -> Passlib bcrypt hashing with salt
      v
CRUD Layer (app/crud/users.py)
      |
      | 7. Create User instance (name, email, password_hash, role)
      | 8. db.add(), db.commit(), db.refresh()
      v
PostgreSQL (users table)
      |
      | 9. Returns new User record
      v
FastAPI -> Serializes to UserResponse (excludes password_hash) -> 201 Created
      |
      v
React -> Navigates to /login with success notification
```

### 2. User Login Flow

```
User (Browser)
      |
      | 1. Submit Email & Password
      v
React LoginPage.jsx
      |
      | 2. POST /auth/login
      v
FastAPI Router (app/api/routes/auth.py)
      |
      | 3. Validate payload against LoginRequest schema
      v
Auth Service (app/services/auth.py)
      |
      | 4. get_user_by_email()
      |    (If user not found -> return None)
      | 5. verify_password(plain_password, stored_hash)
      |    (If mismatch -> return None)
      |    (If failure -> 401 Unauthorized "Invalid email or password")
      |
      | 6. create_access_token(user_id, role)
      |    Payload: {"sub": str(user_id), "role": role, "exp": now + 60min}
      |    Signs with SECRET_KEY and HS256 algorithm
      v
FastAPI -> Returns TokenResponse {"access_token": "...", "token_type": "bearer"}
      |
      v
React AuthContext (login function)
      |
      | 7. Stores token in localStorage ("access_token")
      | 8. Immediately calls GET /auth/me with Bearer token
      | 9. Updates user state and sets isAuthenticated = true
      v
React -> Navigates to /
```

### 3. Authenticated Request Flow (`/auth/me` or Protected Endpoint)

```
React Component / Service
      |
      | 1. Dispatches request via api instance (src/services/api.js)
      v
Axios Request Interceptor
      |
      | 2. Retrieves token: localStorage.getItem("access_token")
      | 3. Injects header: "Authorization: Bearer <token>"
      v
FastAPI Application
      |
      | 4. Endpoint invokes get_current_user dependency
      v
HTTPBearer Dependency (app/api/dependencies.py)
      |
      | 5. Extracts credentials from Authorization header
      | 6. Calls decode_access_token(token)
      |    - Verifies HS256 signature using SECRET_KEY
      |    - Validates "exp" timestamp (rejects expired tokens)
      | 7. Extracts "sub" (user_id) from payload
      | 8. Calls get_user_by_id(db, user_id)
      |    (If user not found -> 401 Unauthorized)
      v
Route Handler (app/api/routes/auth.py)
      |
      | 9. Injects current_user into endpoint handler
      | 10. Serializes UserResponse DTO
      v
React Client -> Receives user data -> Renders authenticated interface
```

### JWT Payload Structure
The access token issued by ClearHire contains the following payload claims:

```json
{
  "sub": "1",
  "role": "candidate",
  "exp": 1727196000
}
```

* **`sub` (Subject):** The unique identifier of the user (cast to string as per RFC 7519 specifications).
* **`role`:** The authorization role assigned to the user (`candidate` or `recruiter`), establishing the foundation for future role-based access control (RBAC).
* **`exp` (Expiration):** Unix timestamp marking when the token becomes invalid (set to 60 minutes from issuance).

### Authentication vs. Authorization

* **Authentication ("Who are you?"):** Validates credentials (email and password) to confirm the user's identity and issues a cryptographic token upon success. Implemented and operational in Task-23.
* **Authorization ("What are you allowed to do?"):** Determines what actions an authenticated user is permitted to perform based on their role and permissions. The current token embeds the user's `role`, establishing the architectural baseline for future role-guarded endpoints (e.g., candidates submitting applications vs. recruiters creating job listings).

### Password Security Mechanics
Passwords are never stored in plaintext:
* ClearHire utilizes **bcrypt**, an adaptive, slow hashing algorithm resistant to brute-force and rainbow table attacks.
* Hashing is performed via Passlib's `CryptContext(schemes=["bcrypt"], deprecated="auto")`.
* A cryptographically secure random salt is automatically generated and embedded into the resulting hash string.
* Verification performs constant-time comparison against the stored hash to prevent timing attacks.

### JWT Security Considerations
* **Encoding vs. Encryption:** JWTs are digitally signed using a symmetric secret key, **not encrypted**. The payload is Base64URL-encoded and can be inspected by anyone possessing the token.
* **No Sensitive Data:** Sensitive data—such as passwords, secret keys, or personally identifiable financial data—is strictly excluded from the token payload.
* **Expiration Enforcement:** Tokens carry a strict expiration timestamp (`exp`). Expired tokens are immediately rejected by `jose.jwt.decode`.

### Frontend Route Protection
Route protection is enforced via lightweight React components:
* **`PublicRoute`:** Wraps public-only pages (`/login`, `/register`). If a user is already authenticated, it redirects them to the home page (`/`) to prevent redundant logins.
* **`ProtectedRoute`:** Guards routes requiring authentication. If the user session is not authenticated, it immediately redirects them to `/login`. While session state is resolving (`loading === true`), rendering is paused to eliminate flickering.

---

## Database Design

The data persistence layer is powered by **PostgreSQL** accessed through **SQLAlchemy**.

### Currently Implemented Model: `users`

Defined in `app/models/user.py`, the `users` table serves as the single source of truth for platform identity:

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Indexed | Auto-incrementing unique user identifier |
| `name` | `VARCHAR(100)` | Not Null | User's full display name |
| `email` | `VARCHAR(255)` | Unique, Not Null, Indexed | User's unique login email address |
| `password_hash` | `VARCHAR(255)` | Not Null | Bcrypt password hash with embedded salt |
| `role` | `VARCHAR(20)` | Not Null, Default: `'candidate'` | User role (`candidate` or `recruiter`) |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | Not Null | UTC timestamp of account creation |

### Planned Database Expansion *(Upcoming Phases)*
The following tables are planned for subsequent milestones and are **not yet implemented** in the database:

* `candidate_profiles` — Resumes, portfolios, education, and skills.
* `companies` — Organization profiles, websites, branding, and industries.
* `jobs` — Job vacancy postings, salary ranges, deadlines, and response SLAs.
* `applications` — Candidate job submissions linking users to job vacancies.
* `application_status_history` — Audit log of timestamped status transitions.
* `interviews` — Interview schedules, formats, and video conference links.
* `notifications` — In-app alerts for status updates and reminders.

---

## API Endpoints

The table below lists all endpoints **currently implemented** in the FastAPI backend:

| Method | Endpoint | Access | Request Body | Response | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | None | `{"message": "ClearHire API is running"}` | Root API health check |
| `POST` | `/auth/register` | Public | `RegisterRequest` (JSON) | `UserResponse` (JSON, Status: 201) | Register a new candidate or recruiter |
| `POST` | `/auth/login` | Public | `LoginRequest` (JSON) | `TokenResponse` (JSON, Status: 200) | Authenticate user and issue access JWT |
| `GET` | `/auth/me` | Protected | None (Bearer Header Required) | `UserResponse` (JSON, Status: 200) | Retrieve current authenticated user profile |

---

## Environment Configuration

Configuration values are decoupled from code using environment variables.

### Backend Configuration (`Backend/.env`)
Backend settings are defined in `Backend/.env` and validated through `app/core/config.py`:

```env
# Database connection string (PostgreSQL with psycopg v3 driver)
DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5433/job_portal

# Cryptographic secret for signing JWTs (must be random and kept secret in production)
SECRET_KEY=your-secret-key-change-this-in-production

# JWT algorithm
ALGORITHM=HS256

# Token lifetime in minutes
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Frontend Configuration (`Frontend/frontend/.env`)
Frontend client settings are defined in `Frontend/frontend/.env`:

```env
# URL where the FastAPI backend is running
VITE_API_URL=http://127.0.0.1:8000
```

> **Security Note:** Real credentials and secret keys must never be committed to source control. Both `Backend/.env` and `Frontend/frontend/.env` are tracked in `.gitignore`. Example template files (`.env.example`) provide placeholder values for new developers.

---

## Installation & Setup

### Prerequisites
* **Node.js** (v18.0.0 or later) & **npm**
* **Python** (v3.10 or later)
* **PostgreSQL** running locally (or via Docker) with a database created (e.g., `job_portal`).

---

### Step 1: Database Setup
Ensure PostgreSQL is running and create the database specified in your connection string:

```sql
CREATE DATABASE job_portal;
```

---

### Step 2: Backend Setup

Open a PowerShell terminal and navigate to the backend directory:

```powershell
# Navigate to the backend directory
cd "d:\Internship Tracker\Task 23\ClearHire-Job Portal\Backend"

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
.\venv\Scripts\Activate.ps1

# Install required dependencies
pip install -r requirements.txt

# Create your .env file from the example
cp .env.example .env
```

Edit `Backend\.env` with your actual PostgreSQL credentials (username, password, port, database name).

Start the FastAPI development server:

```powershell
uvicorn app.main:app --reload
```

The backend will be available at:
* **API Root:** `http://127.0.0.1:8000`
* **Swagger UI Documentation:** `http://127.0.0.1:8000/docs`
* **ReDoc Documentation:** `http://127.0.0.1:8000/redoc`

---

### Step 3: Frontend Setup

Open a separate PowerShell terminal and navigate to the frontend directory:

```powershell
# Navigate to the frontend directory
cd "d:\Internship Tracker\Task 23\ClearHire-Job Portal\Frontend\frontend"

# Install dependencies
npm install

# Verify your .env file
# Ensure VITE_API_URL points to http://127.0.0.1:8000
```

Start the Vite development server:

```powershell
npm run dev
```

The frontend client will be accessible at:
* **Local Web Interface:** `http://localhost:5173`

---

## Testing & Verification

The Task-23 implementation was systematically tested and verified across both backend and frontend layers:

1. **Frontend Boot & Rendering:** Verified that the Vite server compiles cleanly and renders the modern landing page at `http://localhost:5173`.
2. **Backend Server & OpenAPI Docs:** Confirmed FastAPI launches without import errors and generates full OpenAPI interactive documentation at `/docs`.
3. **Database Schema Auto-Creation:** Verified that `Base.metadata.create_all` initializes the `users` table in PostgreSQL upon startup.
4. **Registration Endpoint Validation:**
   * Submitted valid registration payloads and confirmed user insertion into PostgreSQL.
   * Verified that passwords in the database are stored as salted bcrypt hashes.
   * Tested duplicate registration with the same email and confirmed an HTTP 409 Conflict error.
   * Tested invalid email syntax and short passwords to confirm Pydantic validation rejects the requests with 422 Unprocessable Entity.
5. **Login & JWT Issuance:**
   * Submitted matching credentials and verified receipt of an HTTP 200 response with a valid JWT `access_token`.
   * Submitted incorrect passwords and verified receipt of an HTTP 401 Unauthorized response.
6. **Protected Identity Verification (`/auth/me`):**
   * Dispatched requests with `Authorization: Bearer <valid_token>` and verified receipt of the user profile.
   * Dispatched requests without a token or with an invalid token and confirmed rejection with an HTTP 401 Unauthorized error.
7. **Client-Side State Synchronization:**
   * Verified that logging in stores the JWT in `localStorage` and updates the React `AuthContext` state.
   * Verified that refreshing the browser maintains the authenticated session by fetching `/auth/me`.
   * Verified that clicking "Sign Out" removes the token and resets state.
8. **Route Guards:**
   * Confirmed that visiting `/login` or `/register` while authenticated automatically redirects to `/`.

---

## DSA & Development Practice

### Password Hashing Concept

Password security requires a one-way mathematical function. A password cannot be decrypted from its hash; instead, authentication works by hashing the incoming attempt and comparing the resulting hashes.

```
Registration:
Plain Password ------> [ One-Way Hash Function (bcrypt) ] ------> Stored Hash
                           + Cryptographic Salt                     (in Database)

Verification:
Submitted Password --> [ One-Way Hash Function (bcrypt) ] ------> Computed Hash
                           + Stored Salt                              |
                                                                      v
                                                            [ Constant-Time Comparison ]
                                                                      |
                                                            ===> Match? True / False
```

### Login Logic Pseudocode

```
START

Receive email, password from HTTP request

Validate email format and password presence
IF validation fails
    RETURN 422 Unprocessable Entity

Query database for user WHERE user.email == email
IF user does not exist
    RETURN 401 Unauthorized ("Invalid email or password")

Verify submitted password against user.password_hash
IF password verification fails
    RETURN 401 Unauthorized ("Invalid email or password")

Define expiration = current_timestamp + ACCESS_TOKEN_EXPIRE_MINUTES
Construct JWT payload:
    sub = user.id
    role = user.role
    exp = expiration

Sign JWT payload with SECRET_KEY using HS256 algorithm

RETURN 200 OK with:
    access_token = generated_jwt
    token_type = "bearer"

END
```

### React Authentication Flow Pseudocode

```
START

On Application Mount:
    Read token from localStorage ("access_token")
    IF token exists
        Make GET request to "/auth/me" with token
        IF request succeeds
            Set user = response.data
            Set isAuthenticated = true
        ELSE
            Remove token from localStorage
            Set user = null
            Set isAuthenticated = false
    Set loading = false

On Login Action (email, password):
    POST credentials to "/auth/login"
    Receive access_token
    Save access_token in localStorage
    Make GET request to "/auth/me"
    Set user = response.data
    Set isAuthenticated = true
    Redirect to "/"

On Logout Action:
    Remove access_token from localStorage
    Set user = null
    Set isAuthenticated = false
    Redirect to "/"

END
```

---

## Security Implementation

The following security standards are actively implemented:

* **Bcrypt Password Hashing:** Protects credentials against offline rainbow table attacks through salted, computationally intensive hashing.
* **Stateless JWT Authorization:** Eliminates server-side session storage overhead while maintaining secure verification via cryptographic signatures.
* **Token Expiration:** Caps token validity at 60 minutes to mitigate exposure from intercepted tokens.
* **Environment Variable Isolation:** Keeps secrets (`SECRET_KEY`, database credentials) outside of version control via `.env` files.
* **Input Validation & Sanitization:** Pydantic models reject malformed emails, short passwords (<8 characters), and unpermitted roles before business logic executes.
* **CORS Protection:** Explicitly restricts browser cross-origin access to recognized frontend origins (`http://localhost:5173`).
* **Clean Data Transfer Objects (DTOs):** `UserResponse` explicitly omits `password_hash` to ensure password hashes never leave the server.

---

## User Interface & Design

The frontend user interface emphasizes clarity, modern aesthetics, and fluid user feedback:

* **Design Direction:** Built with a clean, typography-led visual identity featuring neutral zinc palettes, subtle borders, backdrop blurs, and glassmorphic navigation components.
* **Landing Page (`LandingPage.jsx`):** Features an interactive hero section, a preview of ClearHire's transparency features, and dynamic header actions that adapt when a user is signed in.
* **Authentication Pages (`LoginPage.jsx` & `RegisterPage.jsx`):** Feature balanced two-column layouts pairing informative product messaging with clean, focused input forms.
* **Interactive State Indicators:** Real-time role switching (`candidate` vs `recruiter`), password validation indicators, and contextual error banners.

---

## Development Status

### Completed in Task-23
* [x] Full-stack directory structure and dependency management.
* [x] FastAPI application initialization and CORS middleware setup.
* [x] PostgreSQL connection and SQLAlchemy declarative base configuration.
* [x] `User` relational model and database table auto-generation.
* [x] Bcrypt password hashing and verification pipeline.
* [x] JWT access token creation, signing, and verification utilities.
* [x] `/auth/register`, `/auth/login`, and `/auth/me` API endpoints.
* [x] React 19 frontend setup with Tailwind CSS v4 and Vite.
* [x] Global `AuthContext` with session hydration and logout functions.
* [x] Axios instance configured with an automatic Bearer token interceptor.
* [x] Client-side routing with `PublicRoute` and `ProtectedRoute` navigation guards.
* [x] Landing page, Login page, and Registration page user interfaces.

### Planned for Future Milestones
* [ ] Candidate profile builder (resumes, work history, skills, portfolios).
* [ ] Recruiter company profile management.
* [ ] Job requisition publishing and faceted search/filtering.
* [ ] One-click application submission with duplicate prevention.
* [ ] Candidate application tracking dashboard.
* [ ] Recruiter candidate evaluation pipeline.
* [ ] Visual application status progress timeline.
* [ ] Committed recruiter response windows (SLAs).
* [ ] Response-overdue visual badges.
* [ ] Chronological status change audit history.
* [ ] Interview scheduling and video link coordination.
* [ ] Automated notifications and recruiter update reminders.

---

## Learning Outcomes

Completing Task-23 provided practical experience in:

1. **Full-Stack Project Initialization:** Structuring independent yet cohesive React and FastAPI repositories with clean dependency definitions.
2. **Layered Backend Architecture:** Isolating database models, Pydantic schemas, CRUD operations, business logic services, and API routing.
3. **Relational Database Integration:** Configuring connection pooling, session generators, and ORM mapping using SQLAlchemy and Psycopg v3.
4. **Modern Web Security:** Applying cryptographic password hashing with bcrypt and implementing stateless JWT-based authentication.
5. **FastAPI Dependency Injection:** Building custom security dependencies (`HTTPBearer` and `get_current_user`) to cleanly enforce authentication across protected endpoints.
6. **Frontend State Management:** Building a centralized React Context provider to manage asynchronous authentication states across components.
7. **HTTP Interceptor Patterns:** Using Axios interceptors to automatically bind authorization credentials to outgoing requests.
8. **Client-Side Route Guarding:** Implementing declarative public and protected route wrappers with React Router DOM v7.
9. **Environment Configuration Management:** Using Pydantic Settings and Vite `.env` variables to decouple configuration from application logic.

---

## Challenges & Solutions

* **Psycopg Driver Compatibility:**
  * *Challenge:* SQLAlchemy requires an explicit driver protocol for PostgreSQL. Defaulting to `postgresql://` without a configured driver causes initialization errors.
  * *Solution:* Configured connection strings using the explicit `postgresql+psycopg://` dialect and installed `psycopg[binary]`.
* **Path Resolution in Pydantic Settings:**
  * *Challenge:* When starting Uvicorn from different working directories, relative `.env` paths could fail to resolve.
  * *Solution:* Anchored the `.env` path resolution dynamically in `app/core/config.py` using `Path(__file__).resolve().parents[2] / ".env"`.
* **Passlib and Bcrypt Compatibility:**
  * *Challenge:* Recent versions of the `bcrypt` library can trigger compatibility deprecation warnings with `passlib`.
  * *Solution:* Explicitly pinned `bcrypt==4.3.0` in `requirements.txt` alongside `passlib[bcrypt]` to ensure predictable, error-free hashing.
* **Decoupled Architectural Separation:**
  * *Challenge:* Avoiding circular imports and tight coupling between database sessions, security functions, and route handlers.
  * *Solution:* Implemented a strict unidirectional flow: `routes` → `services` → `crud` → `models`, with shared utilities in `core` and session handling via FastAPI `Depends()`.
* **Asynchronous Session Hydration in React:**
  * *Challenge:* On page refresh, components checking `isAuthenticated` would briefly see `false` and prematurely redirect to `/login` before `/auth/me` completed.
  * *Solution:* Introduced a `loading` flag in `AuthContext` that pauses route guard evaluations until the initial token verification call resolves.

---

## Future Roadmap

The planned evolution of ClearHire is divided into six strategic phases:

```
[ Phase 1: Foundation ] =====> [ Phase 2: Profiles ] =====> [ Phase 3: Job Engine ]
  * React + FastAPI              * Candidate Profiles         * Job Requisitions
  * PostgreSQL + Auth (DONE)     * Recruiter Organizations    * Search & Filters
                                                                      |
                                                                      v
[ Phase 6: Communication ] <== [ Phase 5: Transparency ] <== [ Phase 4: Applications ]
  * In-App Notifications         * Status Timelines           * Job Submissions
  * Interview Scheduler          * Overdue Indicators         * Candidate Dashboard
  * Recruiter Reminders          * Audit History Log          * Review Pipeline
```

* **Phase 1 — Foundation (Completed — Task-23):** Core React setup, FastAPI backend, PostgreSQL integration, and JWT authentication.
* **Phase 2 — Profiles & Roles (Planned):** Candidate portfolio management, resume uploads, and recruiter company profiles.
* **Phase 3 — Job Discovery Engine (Planned):** Job requisition creation, faceted search, filtering by job type/experience, and expected response time declarations.
* **Phase 4 — Application Pipeline (Planned):** One-click job applications, candidate tracking dashboard, and recruiter candidate management boards.
* **Phase 5 — Transparency Features (Planned Core Differentiator):** Interactive status timelines, expected response windows, response-overdue indicators, and audit logs.
* **Phase 6 — Communication & Coordination (Planned):** Interview scheduling, candidate-recruiter messaging, and automatic reminder alerts.

---

## Conclusion

**Task-23** successfully establishes the architectural foundation for **ClearHire**. By combining a responsive **React 19** frontend, an asynchronous **FastAPI** backend, and a robust **PostgreSQL** relational database, the project now features a complete, secure authentication lifecycle with password hashing, JWT token issuance, session restoration, and client-side route guards.

With the authentication and persistence baseline established, ClearHire is poised to transition into subsequent phases of development: profile management, job discovery, and its core mission of delivering unprecedented transparency to candidate recruitment.
