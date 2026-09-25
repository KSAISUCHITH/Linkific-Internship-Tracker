# Task 24 – Database Models, CRUD APIs and Backend Architecture

### Date
25/09/2026

### Project
ClearHire – Job Portal System

---

# 1. Task Objectives

The primary focus of today's work was designing and implementing the database layer, CRUD operations, and modular backend REST APIs for the ClearHire Job Portal system.

Key objectives for Task 24:
- **Design and Create Database Models**: Implement relational database tables using SQLAlchemy ORM with primary keys, indexes, foreign keys, and cascading relationships.
- **Develop CRUD APIs**: Build modular CRUD helper functions and REST API routes for candidates, companies, jobs, applications, interviews, and notifications.
- **Connect PostgreSQL Database**: Integrate PostgreSQL using SQLAlchemy and the modern `psycopg` driver with connection pooling and session management.
- **Implement Robust API Validation**: Define Pydantic v2 schemas to enforce strict data constraints, required fields, string boundaries, and business rules.
- **Organize Backend Modules**: Establish a clean, decoupled folder structure separating models, schemas, database access, CRUD operations, services, and route handlers.
- **Prepare APIs for Verification & Testing**: Connect all routers to the FastAPI application, enable CORS middleware, and configure the endpoints for upcoming verification.
- **Analyze API Design & Relational Constraints**: Understand entity relationships, duplicate record prevention, ownership validation, and lifecycle milestones.

> **Note on Testing**: Postman API testing and collection creation are part of today's scope but remain pending for the next phase.

---

# 2. Database Models

The ClearHire database architecture consists of eight SQLAlchemy ORM models located in `Backend/app/models/`. All models inherit from `app.database.base.Base` and represent tables created in PostgreSQL.

### 1. `users` (`app/models/user.py`)
- **Purpose**: Represents registered user credentials and system roles.
- **Key Fields**:
  - `id`: Primary key (`Integer`, indexed).
  - `name`: Full user name (`String(100)`, not null).
  - `email`: Unique email address (`String(255)`, unique, indexed, not null).
  - `password_hash`: Salted bcrypt password hash (`String(255)`, not null).
  - `role`: User classification (`String(20)`, default `"candidate"`, not null).
  - `created_at`: Timezone-aware registration timestamp (`DateTime(timezone=True)`, default UTC).
- **Relationships**: Parent entity for `CandidateProfile`, `Company`, and `Notification`.

### 2. `candidate_profiles` (`app/models/candidate.py`)
- **Purpose**: Stores professional and biographical details of job seekers.
- **Key Fields**:
  - `id`: Primary key (`Integer`, indexed).
  - `user_id`: Foreign key referencing `users.id` (`Integer`, unique, ondelete `"CASCADE"`, not null).
  - `headline`: Professional headline/tagline (`String(150)`, nullable).
  - `bio`: Extended background summary (`Text`, nullable).
  - `location`: Current city or region (`String(100)`, nullable).
  - `skills`: Comma-separated or listed skills (`Text`, nullable).
  - `resume_url`: Link to hosted resume file (`String(500)`, nullable).
- **Relationships**: 1:1 relationship with `User` (via `backref="candidate_profile"`). Parent entity to `Application`.

### 3. `companies` (`app/models/company.py`)
- **Purpose**: Stores organization and employer profiles created by recruiters.
- **Key Fields**:
  - `id`: Primary key (`Integer`, indexed).
  - `user_id`: Foreign key referencing `users.id` (`Integer`, unique, ondelete `"CASCADE"`, not null).
  - `name`: Organization name (`String(150)`, not null).
  - `description`: Company profile and overview (`Text`, nullable).
  - `website`: Official web URL (`String(255)`, nullable).
  - `location`: Company headquarters or primary office (`String(100)`, nullable).
  - `industry`: Business domain or industry sector (`String(100)`, nullable).
  - `created_at`: Account creation timestamp (`DateTime(timezone=True)`, default UTC).
- **Relationships**: 1:1 relationship with `User` (via `backref="company"`). 1:N relationship with `Job` (`cascade="all, delete-orphan"`).

### 4. `jobs` (`app/models/job.py`)
- **Purpose**: Stores job postings created by company recruiters.
- **Key Fields**:
  - `id`: Primary key (`Integer`, indexed).
  - `company_id`: Foreign key referencing `companies.id` (`Integer`, ondelete `"CASCADE"`, not null).
  - `title`: Job position title (`String(150)`, not null).
  - `description`: Detailed job responsibilities and criteria (`Text`, not null).
  - `location`: Job location or remote indicator (`String(100)`, nullable).
  - `employment_type`: Classification e.g. Full-time, Internship (`String(50)`, not null).
  - `experience_level`: Required experience tier e.g. Entry, Mid, Senior (`String(50)`, nullable).
  - `salary_min`: Minimum compensation bound (`Integer`, nullable).
  - `salary_max`: Maximum compensation bound (`Integer`, nullable).
  - `skills`: Required technologies or competencies (`Text`, nullable).
  - `application_deadline`: Cutoff deadline timestamp (`DateTime(timezone=True)`, nullable).
  - `created_at` / `updated_at`: Creation and modification timestamps with automated updates.
- **Relationships**: Belongs to `Company` (`back_populates="jobs"`). 1:N relationship with `Application` (`cascade="all, delete-orphan"`).

### 5. `applications` (`app/models/application.py`)
- **Purpose**: Tracks candidate submissions against specific job postings.
- **Key Fields**:
  - `id`: Primary key (`Integer`, indexed).
  - `candidate_id`: Foreign key referencing `candidate_profiles.id` (`Integer`, ondelete `"CASCADE"`, not null).
  - `job_id`: Foreign key referencing `jobs.id` (`Integer`, ondelete `"CASCADE"`, not null).
  - `status`: Current stage e.g. `"applied"`, `"reviewing"` (`String(50)`, default `"applied"`, not null).
  - `applied_at`: Submission timestamp (`DateTime(timezone=True)`, default UTC).
  - `expected_response_days`: Expected recruiter turnaround timeframe in days (`Integer`, nullable).
- **Relationships**: Belongs to `CandidateProfile` (`backref="applications"`) and `Job` (`back_populates="applications"`). Parent to `ApplicationStatusHistory` and `Interview` (both with `cascade="all, delete-orphan"`).

### 6. `application_status_history` (`app/models/application_status.py`)
- **Purpose**: Maintains an immutable audit log of status updates across the application lifecycle.
- **Key Fields**:
  - `id`: Primary key (`Integer`, indexed).
  - `application_id`: Foreign key referencing `applications.id` (`Integer`, ondelete `"CASCADE"`, not null).
  - `status`: Updated status state string (`String(50)`, not null).
  - `note`: Internal recruiter or system note regarding the state transition (`Text`, nullable).
  - `changed_at`: Transition timestamp (`DateTime(timezone=True)`, default UTC).
- **Relationships**: Belongs to `Application` (`back_populates="status_history"`).

### 7. `interviews` (`app/models/interview.py`)
- **Purpose**: Stores interview schedules and rounds linked to specific job applications.
- **Key Fields**:
  - `id`: Primary key (`Integer`, indexed).
  - `application_id`: Foreign key referencing `applications.id` (`Integer`, ondelete `"CASCADE"`, not null).
  - `interview_type`: Type of evaluation round e.g. `"Technical"`, `"HR"` (`String(50)`, not null).
  - `scheduled_at`: Scheduled meeting datetime (`DateTime(timezone=True)`, not null).
  - `duration_minutes`: Expected interview duration in minutes (`Integer`, nullable).
  - `meeting_link`: Virtual conferencing link (`String(500)`, nullable).
  - `notes`: Instructions or agenda notes (`Text`, nullable).
  - `created_at`: Record creation timestamp (`DateTime(timezone=True)`, default UTC).
- **Relationships**: Belongs to `Application` (`back_populates="interviews"`).

### 8. `notifications` (`app/models/notification.py`)
- **Purpose**: Holds system messages and stage updates addressed to platform users.
- **Key Fields**:
  - `id`: Primary key (`Integer`, indexed).
  - `user_id`: Foreign key referencing `users.id` (`Integer`, ondelete `"CASCADE"`, not null).
  - `title`: Short alert summary (`String(150)`, not null).
  - `message`: Detailed notification content (`Text`, not null).
  - `is_read`: Boolean status flag (`Boolean`, default `False`, not null).
  - `created_at`: Dispatch timestamp (`DateTime(timezone=True)`, default UTC).
- **Relationships**: Belongs to `User` (`backref="notifications"`).

---

# 3. Database Relationships

The ClearHire data schema employs relational integrity rules across all entities:

```
User
├── CandidateProfile (1:1 via unique FK users.id)
│   └── Applications (1:N via FK candidate_profiles.id)
│       ├── Job (N:1 via FK jobs.id)
│       ├── ApplicationStatusHistory (1:N via FK applications.id, CASCADE)
│       └── Interviews (1:N via FK applications.id, CASCADE)
│
├── Company (1:1 via unique FK users.id)
│   └── Jobs (1:N via FK companies.id, CASCADE)
│
└── Notifications (1:N via FK users.id, CASCADE)
```

### Relationship Mechanics
1. **One-to-One Relationships**:
   - `users.id` ↔ `candidate_profiles.user_id`: A user may hold at most one candidate profile (`unique=True`).
   - `users.id` ↔ `companies.user_id`: A recruiter user may establish at most one company entity (`unique=True`).
2. **One-to-Many Relationships**:
   - `companies.id` → `jobs.company_id`: A company can publish multiple job postings.
   - `candidate_profiles.id` → `applications.candidate_id`: A candidate can apply to multiple distinct jobs.
   - `jobs.id` → `applications.job_id`: A single job requisition receives multiple candidate applications.
   - `applications.id` → `application_status_history.application_id`: Each application tracks multiple historical status milestones.
   - `applications.id` → `interviews.application_id`: An application can have multiple interview rounds scheduled.
   - `users.id` → `notifications.user_id`: A user accumulates a ledger of incoming alerts.
3. **Foreign Keys & Cascade Behavior**:
   - `ondelete="CASCADE"` is defined on all dependent foreign keys.
   - In SQLAlchemy, parent relationships configure `cascade="all, delete-orphan"` on `company.jobs`, `job.applications`, `application.status_history`, and `application.interviews` so that deleting a parent record automatically purges all orphaned child records.

---

# 4. PostgreSQL Database Connection

The database connection pipeline connects the FastAPI web application to PostgreSQL via SQLAlchemy ORM and the Psycopg 3 binary driver:

```
FastAPI
   ↓
SQLAlchemy (create_engine, sessionmaker)
   ↓
Psycopg (psycopg[binary] driver)
   ↓
PostgreSQL Database Server
```

### Connection Implementation Details

1. **Configuration Management (`app/core/config.py`)**:
   Uses `pydantic-settings` to parse configuration variables from `.env`:
   - `DATABASE_URL`: Connection string formatted for the psycopg driver (`postgresql+psycopg://...`).
   - `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`: Application parameters.
2. **Engine Initialization (`app/database/connection.py`)**:
   - `create_engine(settings.DATABASE_URL, pool_pre_ping=True)`: Initializes the database engine with `pool_pre_ping=True` to proactively test connectivity before handing connections to queries.
3. **Session Local Generator (`SessionLocal`)**:
   - `sessionmaker(autocommit=False, autoflush=False, bind=engine)`: Produces transactional SQLAlchemy sessions.
4. **Dependency Provider (`get_db()`)**:
   - Generates an active database session for route endpoints:
     ```python
     def get_db():
         db = SessionLocal()
         try:
             yield db
         finally:
             db.close()
     ```
   - Automatically closes the database session upon request completion, preventing connection leaks.
5. **Schema Synchronization**:
   - `Base.metadata.create_all(bind=engine)` is invoked at application startup in `app/main.py` to ensure all eight tables exist in PostgreSQL upon boot.
6. **Connection Verification**:
   - The PostgreSQL engine was successfully connected and verified against the local database instance without connection errors.

---

# 5. Pydantic Schemas and Validation

Pydantic v2 schemas in `Backend/app/schemas/` define request validation contracts and output serialization models (`from_attributes=True`):

### 1. Candidate Schemas (`app/schemas/candidate.py`)
- `CandidateProfileCreate`:
  - `headline`: Optional string, `max_length=150`.
  - `bio`: Optional text string.
  - `location`: Optional string, `max_length=100`.
  - `skills`: Optional string.
  - `resume_url`: Optional URL string, `max_length=500`.
- `CandidateProfileUpdate`: Matching optional fields to support partial updates.
- `CandidateProfileResponse`: Exposes `id`, `user_id`, profile details, and configures `from_attributes=True`.

### 2. Company Schemas (`app/schemas/company.py`)
- `CompanyCreate`:
  - `name`: Required string, `min_length=2`, `max_length=150`.
  - `description`: Optional text.
  - `website`: Optional string, `max_length=255`.
  - `location`: Optional string, `max_length=100`.
  - `industry`: Optional string, `max_length=100`.
- `CompanyUpdate`: Optional fields for partial modification with matching boundaries.
- `CompanyResponse`: Serializes `id`, `user_id`, `name`, `description`, `website`, `location`, and `industry`.

### 3. Job Schemas (`app/schemas/job.py`)
- `JobCreate`:
  - `title`: Required string, `min_length=2`, `max_length=150`.
  - `description`: Required string, `min_length=10`.
  - `location`: Optional string, `max_length=100`.
  - `employment_type`: Required string, `min_length=2`, `max_length=50`.
  - `experience_level`: Optional string, `max_length=50`.
  - `salary_min`: Optional integer, constrained with `ge=0` (non-negative).
  - `salary_max`: Optional integer, constrained with `ge=0` (non-negative).
  - `skills`: Optional text.
  - `application_deadline`: Optional `datetime` timestamp.
- `JobUpdate`: All fields optional for partial updates with equivalent constraints.
- `JobResponse`: Serializes all job attributes including `company_id`, `created_at`, and `updated_at`.

### 4. Application Schemas (`app/schemas/application.py`)
- `ApplicationCreate`:
  - `job_id`: Required integer, constrained with `gt=0` (positive ID).
  - `expected_response_days`: Optional integer, constrained with `gt=0`.
- `ApplicationUpdate`:
  - `status`: Optional string, `min_length=2`, `max_length=50`.
  - `expected_response_days`: Optional integer, `gt=0`.
- `ApplicationResponse`: Serializes `id`, `candidate_id`, `job_id`, `status`, `applied_at`, and `expected_response_days`.

### 5. Interview Schemas (`app/schemas/interview.py`)
- `InterviewCreate`:
  - `application_id`: Required integer, constrained with `gt=0`.
  - `interview_type`: Required string, `min_length=2`, `max_length=50`.
  - `scheduled_at`: Required `datetime` timestamp.
  - `duration_minutes`: Optional integer, constrained with `gt=0`.
  - `meeting_link`: Optional string, `max_length=500`.
  - `notes`: Optional string.
- `InterviewUpdate`: Optional fields with matching boundaries.
- `InterviewResponse`: Serializes interview attributes and `created_at`.

### 6. Authentication Schemas (`app/schemas/auth.py`)
- `RegisterRequest`: `name` (`min_length=2`, `max_length=100`), `email` (`EmailStr`), `password` (`min_length=8`, `max_length=128`), `role` (default `"candidate"`).
- `LoginRequest`: `email` (`EmailStr`), `password` (`min_length=1`, `max_length=128`).
- `TokenResponse`: `access_token` (`str`), `token_type` (`"bearer"`).

---

# 6. CRUD Layer

The CRUD layer located in `Backend/app/crud/` isolates raw SQL database operations from HTTP routing logic:

```
crud/
├── users.py
├── candidates.py
├── companies.py
├── jobs.py
├── applications.py
├── interviews.py
└── notifications.py
```

### Standard CRUD Methods Implemented

- **`candidates.py`**:
  - `get_candidate_profile(db, profile_id)`: Fetches single profile by primary key.
  - `get_candidate_profile_by_user(db, user_id)`: Resolves candidate profile by owning user ID.
  - `get_candidate_profiles(db)`: Returns all candidate profiles.
  - `create_candidate_profile(db, user_id, headline, bio, location, skills, resume_url)`: Instantiates and commits a new `CandidateProfile`.
  - `update_candidate_profile(db, profile, data)`: Dynamically sets provided attributes and commits changes.
  - `delete_candidate_profile(db, profile)`: Deletes the profile entity and commits.

- **`companies.py`**:
  - `get_company(db, company_id)`: Reads company by ID.
  - `get_company_by_user(db, user_id)`: Reads company profile owned by a user ID.
  - `get_companies(db)`: Queries all company entities.
  - `create_company(db, user_id, name, description, website, location, industry)`: Adds and commits a new `Company`.
  - `update_company(db, company, data)`: Updates attributes dynamically and commits.
  - `delete_company(db, company)`: Removes company record and commits.

- **`jobs.py`**:
  - `get_job(db, job_id)`: Fetches job listing by ID.
  - `get_jobs(db)`: Fetches all posted jobs.
  - `get_jobs_by_company(db, company_id)`: Queries all jobs posted by a specific company.
  - `create_job(db, company_id, ...)`: Instantiates a new `Job` linked to `company_id`.
  - `update_job(db, job, data)`: Applies dictionary updates and commits.
  - `delete_job(db, job)`: Deletes job listing and commits.

- **`applications.py`**:
  - `get_application(db, application_id)`: Retrieves single application by ID.
  - `get_applications_by_candidate(db, candidate_id)`: Retrieves all submissions by a candidate.
  - `get_applications_by_job(db, job_id)`: Retrieves all applications for a specific job.
  - `create_application(db, candidate_id, job_id, expected_response_days)`: Submits new application with default status `"applied"`.
  - `update_application(db, application, data)`: Updates status and parameters.
  - `delete_application(db, application)`: Removes application record.

- **`interviews.py`**:
  - `get_interview(db, interview_id)`: Retrieves interview record by ID.
  - `get_interviews_by_application(db, application_id)`: Retrieves all scheduled rounds for an application.
  - `create_interview(db, application_id, ...)`: Commits new interview record.
  - `update_interview(db, interview, data)`: Updates schedule, link, or notes.
  - `delete_interview(db, interview)`: Removes interview record.

- **`notifications.py`**:
  - `get_notifications(db, user_id)`: Fetches all notifications addressed to a user.
  - `get_notification(db, notification_id)`: Reads a specific notification.
  - `mark_notification_as_read(db, notification)`: Updates `is_read = True` and commits.

---

# 7. FastAPI API Routes

The API endpoints are organized into modular router files under `Backend/app/api/routes/`:

```
api/routes/
├── auth.py
├── candidates.py
├── companies.py
├── jobs.py
├── applications.py
├── interviews.py
└── notifications.py
```

### Request/Response Lifecycle

```
HTTP Client Request
        ↓
FastAPI Router Endpoint (Path & Method Matching)
        ↓
Dependency Injection (get_db Session, get_current_user Token Extraction)
        ↓
Pydantic Request Validation (Type Checking & Constraint Enforcement)
        ↓
Business Rules & Ownership Verification (HTTP 400, 403, 404, 409)
        ↓
CRUD Function Invocation (Query / Mutation via SQLAlchemy Session)
        ↓
PostgreSQL Database Operation (Commit / Rollback)
        ↓
Pydantic Response Serialization (Output Filtering & Status Code)
        ↓
HTTP Client Response
```

### Advantages of This Decoupled Architecture
- **Separation of Concerns**: Routes only handle HTTP contracts and status codes; business logic sits in services, queries in CRUD, and data constraints in models.
- **Maintainability**: Changes to database column definitions or SQL dialect do not break API route handlers.
- **Security & Reusability**: Dependencies like `get_current_user` can be attached to any route without repeating JWT parsing logic.

---

# 8. Candidate APIs

Located in `Backend/app/api/routes/candidates.py` (`prefix="/candidates"`):

| Method | Endpoint | Description | Auth & Access Controls |
|---|---|---|---|
| `POST` | `/candidates` | Create candidate profile for logged-in user | Bearer Token Required. Checks if profile already exists for user (`409 Conflict`). |
| `GET` | `/candidates` | Retrieve all candidate profiles | Bearer Token Required. |
| `GET` | `/candidates/{profile_id}` | Retrieve specific candidate profile by ID | Bearer Token Required. Returns `404 Not Found` if missing. |
| `PUT` | `/candidates/{profile_id}` | Update own candidate profile | Bearer Token Required. Validates `profile.user_id == current_user.id` (`403 Forbidden` if mismatched). |
| `DELETE` | `/candidates/{profile_id}` | Delete own candidate profile | Bearer Token Required. Validates `profile.user_id == current_user.id` (`403 Forbidden` if mismatched). |

---

# 9. Company APIs

Located in `Backend/app/api/routes/companies.py` (`prefix="/companies"`):

| Method | Endpoint | Description | Auth & Access Controls |
|---|---|---|---|
| `POST` | `/companies` | Create employer profile for logged-in user | Bearer Token Required. Prevents duplicate company profiles per user (`409 Conflict`). |
| `GET` | `/companies` | Retrieve list of all companies | Bearer Token Required. |
| `GET` | `/companies/{company_id}` | Retrieve specific company details | Bearer Token Required. Returns `404 Not Found` if missing. |
| `PUT` | `/companies/{company_id}` | Update own company profile | Bearer Token Required. Validates `company.user_id == current_user.id` (`403 Forbidden` if mismatched). |
| `DELETE` | `/companies/{company_id}` | Delete own company profile | Bearer Token Required. Validates `company.user_id == current_user.id` (`403 Forbidden` if mismatched). |

---

# 10. Job APIs

Located in `Backend/app/api/routes/jobs.py` (`prefix="/jobs"`):

| Method | Endpoint | Description | Auth & Validation |
|---|---|---|---|
| `POST` | `/jobs` | Publish a new job posting | Bearer Token Required. Verifies caller has an existing company profile (`404`). Validates `salary_min <= salary_max` (`400 Bad Request`). |
| `GET` | `/jobs` | Public listing of all jobs | **Public** (No authentication required). |
| `GET` | `/jobs/my-jobs` | Retrieve all jobs for recruiter's company | Bearer Token Required. Verifies caller has a company profile. |
| `GET` | `/jobs/{job_id}` | Public job details lookup | **Public** (No authentication required). Returns `404 Not Found` if missing. |
| `PUT` | `/jobs/{job_id}` | Update existing job posting | Bearer Token Required. Verifies job exists (`404`), verifies company ownership (`403`), validates salary range (`400`). |
| `DELETE` | `/jobs/{job_id}` | Remove job posting | Bearer Token Required. Verifies job exists (`404`) and verifies company ownership (`403`). |

---

# 11. Application APIs

Located in `Backend/app/api/routes/applications.py` (`prefix="/applications"`):

| Method | Endpoint | Description | Validation & Business Rules |
|---|---|---|---|
| `POST` | `/applications` | Apply for a job posting | Bearer Token Required. Checks candidate profile exists (`404`), checks job exists (`404`), and prevents duplicate submissions (`409 Conflict`). |
| `GET` | `/applications/my-applications` | Retrieve applications by current candidate | Bearer Token Required. Reads candidate profile from `current_user.id` and fetches active submissions. |
| `GET` | `/applications/job/{job_id}` | Retrieve all applications for a job | Bearer Token Required. Verifies job exists (`404`). |
| `GET` | `/applications/{application_id}` | Get application details | Bearer Token Required. Returns `404 Not Found` if missing. |
| `PUT` | `/applications/{application_id}` | Update application status | Bearer Token Required. Verifies application ownership (`403 Forbidden` if not owner). |
| `DELETE` | `/applications/{application_id}` | Delete job application | Bearer Token Required. Verifies candidate ownership (`403 Forbidden` if not owner). |

---

# 12. Interview and Notification APIs

### Interview APIs (`Backend/app/api/routes/interviews.py`)
- `POST /interviews`: Schedules an interview round. Verifies that the target `application_id` exists (`404 Not Found`), then persists round type, schedule, meeting link, and notes.
- `GET /interviews/application/{application_id}`: Retrieves all interview rounds scheduled for an application. Verifies application existence (`404`).
- `GET /interviews/{interview_id}`: Retrieves details of a specific interview round (`404 Not Found` if missing).
- `PUT /interviews/{interview_id}`: Updates scheduled datetime, meeting link, duration, or notes.
- `DELETE /interviews/{interview_id}`: Deletes an interview record (`204 No Content`).

### Notification APIs (`Backend/app/api/routes/notifications.py`)
- `GET /notifications`: Fetches all notification records addressed to `current_user.id`.
- `GET /notifications/{notification_id}`: Retrieves a single notification. Enforces recipient ownership: verifies `notification.user_id == current_user.id` (`403 Forbidden` if mismatched).
- `PUT /notifications/{notification_id}/read`: Marks a notification as read (`is_read = True`). Enforces recipient ownership (`403 Forbidden`).

> **Implementation Note**: The notification endpoints currently support manual retrieval and status updates. Automated notification creation via background tasks or event hooks is not yet implemented.

---

# 13. Authentication and API Protection

API protection relies on the JWT authentication pipeline established in `app/api/dependencies.py` and `app/core/security.py`:

```
Incoming HTTP Request
        ↓
HTTP Authorization Header: Bearer <access_token>
        ↓
HTTPBearer Security Scheme extracts raw token
        ↓
decode_access_token(token) via python-jose
  ├── Validates SECRET_KEY signature
  ├── Checks ALGORITHM (HS256)
  └── Verifies expiration timestamp (exp)
        ↓
User ID (sub) extracted from token payload
        ↓
get_user_by_id(db, user_id) queries PostgreSQL
        ↓
Injected as current_user into Route Handler
```

### Authentication vs. Authorization Distinction
- **Authentication (Implemented)**: Confirms the caller's identity via signed JWT tokens. Rejects unauthenticated or expired tokens with `401 Unauthorized`.
- **Authorization & Ownership Checks (Implemented in Routes)**: Verified routes ensure that only the record owner modifies or deletes resources (e.g., matching `profile.user_id == current_user.id` or `job.company_id == company.id`).
- **Areas for Future Refinement**: Stricter role-based authorization (RBAC) middleware to explicitly restrict candidate endpoints from recruiter tokens and vice-versa.

---

# 14. Backend Module Organization

The backend repository adheres to the following directory layout:

```
Backend/
├── app/
│   ├── api/
│   │   ├── dependencies.py          # FastAPI dependencies (get_current_user, HTTPBearer)
│   │   └── routes/                  # REST route handlers
│   │       ├── applications.py      # Job application endpoints
│   │       ├── auth.py              # Register, login, and me endpoints
│   │       ├── candidates.py        # Candidate profile endpoints
│   │       ├── companies.py         # Company profile endpoints
│   │       ├── interviews.py        # Interview management endpoints
│   │       ├── jobs.py              # Job posting & lookup endpoints
│   │       └── notifications.py     # Notification endpoints
│   ├── core/
│   │   ├── config.py                # Environment settings via Pydantic BaseSettings
│   │   └── security.py              # Bcrypt hashing and JWT encoding/decoding
│   ├── crud/                        # Database queries and mutations
│   │   ├── applications.py
│   │   ├── candidates.py
│   │   ├── companies.py
│   │   ├── interviews.py
│   │   ├── jobs.py
│   │   ├── notifications.py
│   │   └── users.py
│   ├── database/
│   │   ├── base.py                  # Declarative Base instance
│   │   └── connection.py            # Engine configuration and get_db session generator
│   ├── models/                      # SQLAlchemy table definitions
│   │   ├── application.py
│   │   ├── application_status.py
│   │   ├── candidate.py
│   │   ├── company.py
│   │   ├── interview.py
│   │   ├── job.py
│   │   ├── notification.py
│   │   └── user.py
│   ├── schemas/                     # Pydantic validation schemas
│   │   ├── application.py
│   │   ├── auth.py
│   │   ├── candidate.py
│   │   ├── company.py
│   │   ├── interview.py
│   │   ├── job.py
│   │   └── user.py
│   ├── services/                    # Business workflows
│   │   └── auth.py                  # User authentication and registration services
│   └── main.py                      # FastAPI application entrypoint, CORS, router mounting
├── .env.example                     # Environment template
└── requirements.txt                 # Backend Python package dependencies
```

### Module Roles
- **`models`**: Define PostgreSQL tables, foreign keys, and cascading relationships.
- **`schemas`**: Enforce validation rules, data boundaries, and response serialization contracts.
- **`crud`**: Perform isolated database operations (SELECT, INSERT, UPDATE, DELETE).
- **`services`**: Coordinate multi-step business logic (e.g., checking uniqueness, hashing passwords, issuing tokens).
- **`api/routes`**: Expose HTTP endpoints, route parameters, status codes, and model bindings.
- **`api/dependencies`**: Provide request-scoped dependencies such as `get_db` and `get_current_user`.
- **`core`**: Maintain centralized configuration loading and cryptographic utilities.
- **`database`**: Provide the SQLAlchemy engine and transactional session lifecycle.

---

# 15. API Validation and Error Handling

The API layer implements systematic HTTP exception handling using explicit status codes:

- **`400 Bad Request`**:
  - Invalid user role during registration (must be `"candidate"` or `"recruiter"`).
  - Minimum salary exceeding maximum salary (`salary_min > salary_max`).
- **`401 Unauthorized`**:
  - Missing, invalid, or expired Bearer token in `dependencies.py`.
  - Invalid login email or password.
  - Missing user record corresponding to token subject.
- **`403 Forbidden`**:
  - Attempting to update or delete another candidate's profile (`profile.user_id != current_user.id`).
  - Attempting to update or delete another employer's company profile.
  - Modifying or deleting a job posting belonging to a different company.
  - Accessing or modifying a notification belonging to another user.
- **`404 Not Found`**:
  - Candidate profile, company, job, application, interview, or notification record not found by ID.
  - Recruiter attempting to post a job without first creating a company profile.
- **`409 Conflict`**:
  - Registering an email address that already exists in the system.
  - Attempting to create more than one candidate profile for the same user.
  - Attempting to create more than one company profile for the same user.
  - Duplicate job application submission (candidate has already applied to the job).
- **`422 Unprocessable Entity`**:
  - Handled automatically by FastAPI when request payloads violate Pydantic schema rules (e.g., negative salary, malformed email, missing required fields).

---

# 16. Database Verification

During Task 24, database connectivity and schema generation were verified:

- **PostgreSQL Connection**: Successfully initialized the connection using the SQLAlchemy engine and `psycopg` driver.
- **Table Generation**: Verified that `Base.metadata.create_all(bind=engine)` executes without syntax errors or missing foreign key references.
- **Model Registration**: All 8 ClearHire models (`users`, `candidate_profiles`, `companies`, `jobs`, `applications`, `application_status_history`, `interviews`, `notifications`) are imported and registered with the declarative base.
- **Router Configuration**: All API routers (`auth`, `candidates`, `companies`, `jobs`, `applications`, `interviews`, `notifications`) are mounted on the FastAPI app instance.

> **Status Notice**: Postman API testing and collection creation remain pending.

---

# 17. Example Backend Flows

### Example 1: Creating a Job Posting

```
Recruiter Client
       │
       ▼  POST /jobs (Bearer Token, JobCreate Payload)
FastAPI jobs_router
       │
       ├──> get_current_user dependency validates JWT & loads User
       ├──> Pydantic validates JobCreate (title, min length, positive salaries)
       ├──> get_company_by_user() verifies recruiter has a company profile
       ├──> Business validation: asserts salary_min <= salary_max
       ├──> create_job() inserts new Job record into PostgreSQL
       └──> Commits transaction and returns JobResponse (HTTP 201 Created)
       │
       ▼
Recruiter receives serialized JobResponse JSON
```

### Example 2: Submitting a Job Application

```
Candidate Client
       │
       ▼  POST /applications (Bearer Token, ApplicationCreate Payload)
FastAPI applications_router
       │
       ├──> get_current_user dependency validates JWT & loads User
       ├──> Pydantic validates ApplicationCreate (job_id > 0)
       ├──> get_candidate_profile_by_user() verifies candidate profile exists
       ├──> get_job() verifies target job exists in PostgreSQL
       ├──> get_applications_by_candidate() checks for prior application to job_id
       │       └── If duplicate exists: raises HTTPException(409 Conflict)
       ├──> create_application() commits new Application (status: "applied")
       └──> Returns ApplicationResponse (HTTP 201 Created)
       │
       ▼
Candidate receives serialized ApplicationResponse JSON
```

---

# 18. Technologies Used

The following technologies were directly utilized in today's task:

- **Python**: Core programming language.
- **FastAPI**: Modern, high-performance web framework for REST APIs.
- **SQLAlchemy**: Relational database ORM, query builder, and relationship manager.
- **PostgreSQL**: Relational database management system.
- **Psycopg (psycopg 3 binary)**: PostgreSQL database adapter for Python.
- **Pydantic & Pydantic Settings**: Data validation, schema definitions, and environment variable loading.
- **JWT (python-jose)**: JSON Web Token generation and validation.
- **Passlib & bcrypt**: Cryptographic password hashing.
- **FastAPI Swagger UI**: Interactive API documentation and schema inspection (`/docs`).
- **Git & GitHub**: Source code management.

---

# 19. Task Status

| Work Item | Status |
|---|---|
| Database models | Completed |
| Database relationships | Completed |
| PostgreSQL connection | Completed |
| Pydantic schemas | Completed |
| CRUD layer | Completed |
| FastAPI CRUD APIs | Completed |
| API validation | Implemented |
| Authentication protection | Implemented |
| Postman testing | Pending |
| Postman collection | Pending |
| GitHub update | Pending |

---

# 20. Learning Outcomes

Today's implementation provided practical experience in:
- Designing relational database schemas with foreign keys and cascading delete rules using SQLAlchemy.
- Applying the repository/CRUD pattern to decouple SQL queries from HTTP routing.
- Structuring request validation and response models using Pydantic v2.
- Implementing route security with HTTP Bearer tokens and dependency injection in FastAPI.
- Handling edge cases such as duplicate record submission and ownership validation.
- Structuring a production-ready, modular backend architecture for a multi-tenant portal.

---

# 21. Challenges

Key challenges addressed during today's task:
- **Managing Relational Cascades**: Ensuring cascading rules on `application_status_history` and `interviews` correctly clean up child records when an application is deleted.
- **Separation of Concerns**: Keeping route handlers lightweight by moving business logic into services and database queries into dedicated CRUD modules.
- **Ownership Verification**: Enforcing that authenticated users can only update or delete resources they own (profiles, company details, job listings) while still allowing public lookups.
- **Salary and Numeric Boundary Validation**: Coordinating schema-level constraints (`ge=0`, `gt=0`) with route-level comparisons (`salary_min <= salary_max`).

---

