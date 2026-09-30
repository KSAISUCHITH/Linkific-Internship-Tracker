# Task 27 – Application Testing, Bug Fixing, Validation, Documentation and Deployment Preparation

### Date
30/09/2026

### Project
ClearHire – Job Portal System

---

# 1. Task Objectives

Following the frontend component assembly and initial REST API integration completed in Task 26, Task 27 focused on rigorous end-to-end application testing, systematic defect identification and resolution, backend and frontend validation hardening, access control and resource ownership verification, centralized error handling, UI/UX polish, Postman API testing with evidence capture, comprehensive API documentation, and deployment readiness assessment.

The primary objective of today's work was transitioning ClearHire from an integrated prototype into an enterprise-grade, secure, and resilient job portal system. Rather than introducing unvetted features, all work was grounded in resolving concrete bugs discovered during testing and hardening system-wide data integrity.

Key objectives for Task 27:
- **Comprehensive System Testing & Defect Remediation**: Conduct end-to-end verification of user registration, authentication lifecycle, profile management, job posting, job searching, application submission, and interview scheduling workflows.
- **Resolve Identified Integration & Logic Bugs**:
  - Fix section layout collapse between "How It Works" and "Transparency" on the landing page.
  - Implement role-aware navigation rendering in the global navigation bar so candidate and recruiter options replace guest links post-authentication.
  - Correct flawed application deadline comparison logic by introducing timezone-aware UTC datetime evaluation.
  - Harden interview scheduling against past date/time creation and enforce multi-entity ownership authorization.
  - Investigate and document duplicate application prevention mechanisms across application and database tiers.
- **Harden Validation Pipelines**: Enforce declarative Pydantic v2 `@model_validator` and `@field_validator` constraints on backend schemas (notably salary range integrity and password complexity) and align client-side validation rules.
- **Centralize API Error Extraction**: Construct a dedicated frontend error parsing utility (`src/utils/errors.js`) capable of unwrapping nested FastAPI/Pydantic validation errors and standard HTTP status codes into actionable user alerts.
- **Enforce Granular Access Control and Ownership Verification**: Implement reusable FastAPI role dependency guards (`require_roles`) and ownership validation checks across applications, recruiter job postings, candidate profiles, company profiles, and interview management.
- **Document RESTful API Surface**: Produce a complete, schema-accurate reference covering all endpoints, parameters, authentication requirements, response structures, and HTTP status codes.
- **Execute Postman API Verification**: Validate core authentication, candidate, company, and job requisition endpoints via Postman and prepare structured visual evidence placeholders.
- **Evaluate Deployment Readiness**: Audit backend configuration, environment variable management, CORS policies, Vite build settings, and database connectivity to establish a deployment roadmap.
- **DSA and Algorithmic Practice**: Analyze time and space complexity trade-offs for searching, hash-based lookups, and duplicate detection mechanisms implemented in Python.

---

# 2. Task Requirements

To satisfy the requirements of Task 27, the following engineering tasks were established:

1. **Bug Identification & Fixing**:
   - Inspect existing landing page layout and resolve visual merging between "How It Works" and "Transparency" sections.
   - Audit `Navbar.jsx` and implement role-aware conditional rendering based on authentication status and user role (`candidate` vs. `recruiter`).
   - Fix deadline validation logic in `applications.py` to compare timezone-aware UTC objects.
   - Refactor `interviews.py` to reject past scheduling dates and restrict scheduling/management exclusively to recruiters owning the job requisition.
   - Evaluate duplicate application integrity and clearly delineate application-level checks from database-level constraints.

2. **Validation & Error Handling**:
   - Validate passwords against complexity rules (minimum 8 characters, uppercase, lowercase, number, special character).
   - Enforce `salary_min <= salary_max` via Pydantic model validators.
   - Build a reusable frontend error-parsing function (`getApiError`) to handle FastAPI validation error arrays (`detail: [{ loc, msg }]`).

3. **Authorization & Security**:
   - Implement role-based dependency factories (`require_roles("candidate")`, `require_roles("recruiter")`).
   - Prevent horizontal privilege escalation through explicit resource ownership checks.

4. **Testing & Documentation**:
   - Execute manual API tests using Postman for registration, login, candidate profile creation, company creation, job requisition creation, job retrieval, and candidate lookup.
   - Document complete API contracts with schema models and HTTP status codes.
   - Construct a structured testing verification matrix.

5. **Deployment Preparation**:
   - Audit `requirements.txt`, `.env.example`, CORS configurations, and frontend build commands (`vite build`).

---

# 3. Current Project Architecture

The ClearHire platform operates on a decoupled client-server architecture consisting of a React single-page application and a FastAPI asynchronous REST API backed by PostgreSQL.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (Browser)                         │
│                                                                        │
│   React 19 SPA (Vite)  •  React Router 7  •  Tailwind CSS v4          │
│   ┌─────────────────────┐   ┌───────────────────┐   ┌──────────────┐   │
│   │ UI Pages/Components │◄──┤ Global AuthContext│◄──┤ LocalStorage │   │
│   └──────────┬──────────┘   └───────────────────┘   └──────────────┘   │
└──────────────┼─────────────────────────────────────────────────────────┘
               │ HTTP Requests (JSON)
               │ Authorization: Bearer <JWT>
               ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        API LAYER (FastAPI)                             │
│                                                                        │
│   FastAPI App (app/main.py)  •  Uvicorn ASGI Server                     │
│   ├── CORSMiddleware (Origins: localhost:5173, 127.0.0.1:5173)         │
│   ├── Dependency Injection:                                            │
│   │   ├── get_db (SessionLocal generator)                              │
│   │   ├── get_current_user (JWT Bearer token decoding & DB validation) │
│   │   └── require_roles (Role-based access guard factory)              │
│   └── Routers:                                                         │
│       ├── /auth          ── Authentication & token issuance            │
│       ├── /candidates    ── Candidate profile management               │
│       ├── /companies     ── Recruiter company profile management       │
│       ├── /jobs          ── Job requisition catalog & search           │
│       ├── /applications  ── Application workflow & lifecycle           │
│       ├── /interviews    ── Interview scheduling & access control      │
│       └── /notifications ── Candidate notification inbox               │
└──────────────┼─────────────────────────────────────────────────────────┘
               │ SQLAlchemy 2.0 ORM
               │ Psycopg Binary Driver
               ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER (PostgreSQL)                         │
│                                                                        │
│   PostgreSQL Relational Database                                       │
│   ├── users                     ── Authentication credentials & roles  │
│   ├── candidate_profiles        ── Candidate resumes, bios & skills    │
│   ├── companies                 ── Recruiter company profiles          │
│   ├── jobs                      ── Job postings & requirements         │
│   ├── applications              ── Job applications & status           │
│   ├── application_status_history── Audit log of application transitions│
│   ├── interviews                ── Scheduled interview sessions        │
│   └── notifications             ── User event notifications            │
└────────────────────────────────────────────────────────────────────────┘
```

---

# 4. Bug Identification and Fixes

Systematic end-to-end testing revealed five distinct bugs across the UI layout, navigation state, backend datetime validation, interview scheduling permissions, and application uniqueness.

---

## 4.1 Bug 1 — Landing Page Section Separation

### Problem
In the previous landing page implementation, the **"Transparency"** section and the **"How It Works"** section visually merged together. The lack of distinct background colors, insufficient padding, and absent structural section dividers caused the content to appear as a continuous, cluttered block, degrading visual hierarchy and user readability.

### Root Cause
Both sections shared identical transparent/white background tokens without contrasting boundary dividers (`border-t`, distinct `bg-zinc-50` panels) or adequate vertical padding (`py-28`), causing the three-card transparency grid to blend directly into the three-step workflow list.

### Fix
Refined the layout, background contrast, and spacing tokens in `Frontend/frontend/src/pages/LandingPage.jsx`:
- Enforced a subtle light gray background (`bg-zinc-50`) and explicit top border delimiter (`border-t border-zinc-100`) on the `#transparency` section.
- Encapsulated the transparency pillars inside an elevated 3-column grid (`bg-zinc-200 gap-px rounded-[2rem] border border-zinc-200`) with hover micro-transitions.
- Maintained a clean white background (`bg-white`) on the `#how-it-works` section with horizontal row dividers (`divide-y divide-zinc-200 border-y border-zinc-200`).
- Added generous vertical padding (`py-28`) and section header subtitles (`uppercase tracking-[0.2em] text-zinc-400`) to anchor each section.

```jsx
{/* Transparency Section - Distinct Background and Border */}
<section
  id="transparency"
  className="scroll-mt-32 border-t border-zinc-100 bg-zinc-50 px-6 py-28 sm:px-8 lg:px-10"
>
  ...
</section>

{/* How It Works Section - Clean White with Divided Rows */}
<section
  id="how-it-works"
  className="scroll-mt-32 px-6 py-28 sm:px-8 lg:px-10"
>
  ...
</section>
```

### Result
Each landing page section now possesses an unambiguous visual identity and natural breathing room while strictly preserving ClearHire's original landing page structure and content.

---

## 4.2 Bug 2 — Role-Aware Navigation

### Problem
After logging into the application, users continued to see public, guest-oriented navigation links ("How it works", "Transparency", "Log in", "Get started") in the top navigation bar. Authenticated candidates and recruiters were not presented with the appropriate operational links for their active role.

### Root Cause
In `Navbar.jsx`, navigation links were rendered unconditionally without inspecting `isAuthenticated` or `user.role` from `AuthContext`. The navigation bar lacked branch logic to switch between unauthenticated guest state, candidate dashboard state, and recruiter management state.

### Fix
Refactored `Frontend/frontend/src/components/Navbar.jsx` to consume `user`, `isAuthenticated`, and `logout` from `useAuth()`:
- **Guest State (`!isAuthenticated`)**: Displays "Jobs", "How it works" (`/#how-it-works`), "Transparency" (`/#transparency`), "Log in", and "Get started".
- **Candidate State (`isAuthenticated && user?.role === "candidate"`)**: Displays "Jobs", "Dashboard" (`/dashboard`), "Applications" (`/applications`), "Interviews" (`/interviews`), "Notifications" (`/notifications`), candidate name, and a "Log out" button.
- **Recruiter State (`isAuthenticated && user?.role === "recruiter"`)**: Displays "Jobs", "Dashboard" (`/recruiter/dashboard`), "My Jobs" (`/recruiter/jobs`), "Company" (`/recruiter/company`), recruiter name, and a "Log out" button.
- Mirrored the exact conditional structure inside the mobile hamburger drawer.

```jsx
{/* Public Navigation */}
{!isAuthenticated && (
  <>
    <a href="/#how-it-works" className={navLinkClass}>How it works</a>
    <a href="/#transparency" className={navLinkClass}>Transparency</a>
  </>
)}

{/* Candidate Navigation */}
{isAuthenticated && user?.role === "candidate" && (
  <>
    <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
    <NavLink to="/applications" className={navLinkClass}>Applications</NavLink>
    <NavLink to="/interviews" className={navLinkClass}>Interviews</NavLink>
    <NavLink to="/notifications" className={navLinkClass}>Notifications</NavLink>
  </>
)}

{/* Recruiter Navigation */}
{isAuthenticated && user?.role === "recruiter" && (
  <>
    <NavLink to="/recruiter/dashboard" className={navLinkClass}>Dashboard</NavLink>
    <NavLink to="/recruiter/jobs" className={navLinkClass}>My Jobs</NavLink>
    <NavLink to="/recruiter/company" className={navLinkClass}>Company</NavLink>
  </>
)}
```

### Result
The navigation bar dynamically updates its items immediately upon authentication, providing candidates and recruiters with direct access to their protected workflows and preventing interface confusion.

(ClearHire-Job Portal/docs/nav.png)

---

## 4.3 Bug 3 — Application Deadline Validation

### Problem
When candidates submitted applications for jobs with an expired deadline, the backend allowed the submission instead of rejecting it. Inspection of the endpoint logic revealed that the deadline comparison was fundamentally broken, comparing the job's deadline against request body fields instead of the current system timestamp.

### Root Cause
In `Backend/app/api/routes/applications.py`, the condition attempted to validate the deadline by comparing `job.application_deadline` against attributes of the incoming `ApplicationCreate` request model rather than calculating `datetime.now(timezone.utc)`. Furthermore, naive vs. aware datetime comparison errors could cause runtime crashes when PostgreSQL returned timezone-aware datetimes.

### Fix
Rewrote the deadline verification block in `app/api/routes/applications.py` to use timezone-aware UTC comparisons:
1. Checked if `job.application_deadline` is set.
2. Obtained `datetime.now(timezone.utc)`.
3. Normalized `job.application_deadline` to UTC if its `tzinfo` was `None`.
4. Compared `current_time > deadline` and raised `HTTPException(status_code=400, detail="Application deadline has passed.")`.

```python
if job.application_deadline:
    current_time = datetime.now(timezone.utc)
    deadline = job.application_deadline

    if deadline.tzinfo is None:
        deadline = deadline.replace(tzinfo=timezone.utc)

    if current_time > deadline:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Application deadline has passed.",
        )
```

**Verified Behavior Matrix**:
- Job deadline in future (`current_time <= deadline`) → Application creation proceeds.
- Job deadline in past (`current_time > deadline`) → HTTP 400 Bad Request returned.
- Job deadline is `None` (open requisition) → Application creation proceeds without restriction.

### Result
Application submissions are strictly locked when job requisitions reach their deadline, protecting recruiters from late submissions.

---

## 4.4 Bug 4 — Interview Scheduling Validation and Authorization

### Problem
The interview scheduling endpoint allowed scheduling interviews in the past. Additionally, the route lacked ownership verification: any authenticated user could schedule an interview for any application ID, and any user could view or modify interview schedules regardless of whether they were associated with the job or candidate.

### Root Cause
`Backend/app/api/routes/interviews.py` previously omitted:
1. Datetime checks comparing `scheduled_at` with `datetime.now(timezone.utc)`.
2. Multi-hop ownership validation traversing `application -> job -> company -> user_id` to verify recruiter ownership.
3. Access verification ensuring only the applied candidate or hiring recruiter can view interview details.

### Fix
Hardened `app/api/routes/interviews.py` with granular authorization helpers and date validation:
- **Recruiter Role Guard**: Wrapped `create_application_interview`, `update_application_interview`, and `delete_application_interview` with `Depends(require_roles("recruiter"))`.
- **Ownership Helper (`verify_recruiter_access`)**: Verified that `application.job.company.user_id == current_user.id`. If mismatched, raises `HTTP 403 Forbidden`.
- **Read Access Helper (`verify_application_access`)**: Ensured candidate access requires `application.candidate.user_id == current_user.id`, and recruiter access requires `application.job.company.user_id == current_user.id`.
- **Future Date Validation**:
  ```python
  scheduled_at = request.scheduled_at

  if scheduled_at.tzinfo is None:
      scheduled_at = scheduled_at.replace(tzinfo=timezone.utc)

  current_time = datetime.now(timezone.utc)

  if scheduled_at <= current_time:
      raise HTTPException(
          status_code=status.HTTP_400_BAD_REQUEST,
          detail="Interview date and time must be in the future.",
      )
  ```
- **String Sanitization**: Applied `.strip()` on `interview_type`, `meeting_link`, and `notes` to prevent whitespace pollution.

### Result
Interview scheduling is strictly restricted to authorized recruiters managing their own requisitions, past dates are rejected with HTTP 400, and candidate interview data remains confidential.

(ClearHire-Job Portal/docs/interview.png)
---

## 4.5 Bug 5 — Duplicate Application Integrity

### Problem
Submitting multiple applications for the exact same job requisition by the same candidate creates duplicate records, distorts applicant metrics, and complicates recruiter screening.

### Technical Analysis & Repository State
During verification of the ClearHire codebase, the duplicate prevention mechanism was examined at both the application tier and the database tier:

1. **Application-Level Validation (Active & Functional)**:
   In `Backend/app/api/routes/applications.py`, lines 82–94 perform an explicit pre-flight query before creating an application:
   ```python
   applications = get_applications_by_candidate(
       db,
       candidate.id,
   )

   if any(
       application.job_id == job.id
       for application in applications
   ):
       raise HTTPException(
           status_code=status.HTTP_409_CONFLICT,
           detail="You have already applied for this job.",
       )
   ```
   When a candidate attempts to re-apply for a job they already applied to, the backend successfully halts the transaction and returns `HTTP 409 Conflict`.

2. **Database-Level Hardening (Identified / Pending Database-Level Hardening)**:
   Inspection of `Backend/app/models/application.py` reveals that the `applications` table relies on individual foreign keys:
   ```python
   candidate_id = Column(Integer, ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False)
   job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
   ```
   The model does **not** currently contain a composite `UniqueConstraint("candidate_id", "job_id", name="uq_candidate_job_application")` inside `__table_args__`. Under extreme high-concurrency race conditions, two simultaneous POST requests could theoretically pass the application-level check before either commits.

### Resolution Status
- **Application-Level Check**: **Verified & Active** (returns HTTP 409 Conflict).
- **Database-Level Composite Constraint**: **Identified / Pending database-level hardening** (scheduled for subsequent database migration task).

---

# 5. Validation and Error Handling

To ensure robust data integrity across the system, validation was formalized across both backend schemas and frontend forms, backed by centralized error extraction.

### 5.1 Backend Schema Validation (Pydantic v2)

1. **Registration & Password Complexity (`app/schemas/auth.py`)**:
   - `name`: Enforces `min_length=2`, `max_length=100`, and a `@field_validator` stripping leading/trailing whitespace.
   - `email`: Enforces RFC-compliant email structure using Pydantic's `EmailStr`.
   - `password`: Enforces `min_length=8`, `max_length=128`, and a `@field_validator` executing regex rules:
     - At least one uppercase letter: `re.search(r"[A-Z]", value)`
     - At least one lowercase letter: `re.search(r"[a-z]", value)`
     - At least one digit: `re.search(r"\d", value)`
     - At least one special character: `re.search(r"""[!@#$%^&*(),.?":{}|<>\-_[\]/+=;'`~]""", value)`
   - Raises informative `ValueError` messages triggering HTTP 422 if unmet.

2. **Salary Range Integrity (`app/schemas/job.py`)**:
   - `salary_min` and `salary_max` are validated using `@model_validator(mode="after")`.
   - If both values are provided and `salary_min > salary_max`, Pydantic raises `ValueError("Minimum salary cannot exceed maximum salary")`.
   - Both fields enforce `ge=0` (non-negative currency amounts).

```python
@model_validator(mode="after")
def validate_salary_range(self):
    if (
        self.salary_min is not None
        and self.salary_max is not None
        and self.salary_min > self.salary_max
    ):
        raise ValueError(
            "Minimum salary cannot exceed maximum salary"
        )
    return self
```

### 5.2 Frontend Centralized Error Handling (`src/utils/errors.js`)

FastAPI returns validation errors in structured lists (`detail: [{ loc: [...], msg: "..." }]`), whereas standard HTTP exceptions return string details (`detail: "Job not found."`). UI components previously broke or displayed raw `[object Object]` strings.

A dedicated utility `getApiError(error, fallback)` was implemented to normalize all failure modes:

```javascript
export function getApiError(error, fallback = "Something went wrong.") {
  const detail = error?.response?.data?.detail;

  // 1. Unwrap FastAPI/Pydantic validation lists
  if (Array.isArray(detail)) {
    return (
      detail
        .map((item) => item?.msg)
        .filter(Boolean)
        .join(", ") || fallback
    );
  }

  // 2. Unwrap standard string exceptions
  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  // 3. Status-code specific fallbacks
  if (error?.response?.status === 401) {
    return "Your session has expired. Please log in again.";
  }
  if (error?.response?.status === 403) {
    return "You do not have permission to perform this action.";
  }
  if (error?.response?.status === 404) {
    return "The requested resource was not found.";
  }
  if (error?.response?.status >= 500) {
    return "The server encountered an error. Please try again.";
  }
  if (!error?.response) {
    return "Unable to connect to the server. Please check your connection.";
  }

  return fallback;
}
```

---

# 6. Authentication and Authorization Improvements

Task 27 audited all authentication flows and backend dependencies to prevent unauthorized access and privilege escalation.

### 6.1 Email Normalization & Duplicate Handling
In `Backend/app/services/auth.py`, user emails are normalized via `email.strip().lower()` during both registration and authentication. This ensures that accounts registered as `User@Example.com` and `user@example.com` map to the same identity, preventing duplicate account collision. If an email exists, `register_user` raises a `ValueError`, which `app/api/routes/auth.py` transforms into `HTTP 409 Conflict`.

### 6.2 Token Lifecycle & Session Recovery
- `app/core/security.py` signs JWT tokens using HS256 with user ID (`sub: str(user_id)`), user role (`role: role`), and expiration (`exp`).
- `get_current_user` in `app/api/dependencies.py` extracts the Bearer token, decodes the claims, verifies the user exists in PostgreSQL, and injects the SQLAlchemy `User` instance.
- On the frontend, `AuthContext.jsx` reads `access_token` from `localStorage` on initial mount and performs a verification query to `GET /auth/me`. If the token is expired or invalid, it immediately purges `access_token` from storage and clears the user state.

### 6.3 Granular Role-Based Access Guards
In `app/api/dependencies.py`, the `require_roles` factory creates dependencies that inspect `current_user.role`:
```python
def require_roles(*allowed_roles):
    def role_dependency(current_user=Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action",
            )
        return current_user
    return role_dependency
```

### 6.4 Resource Ownership Verification Summary

| Entity | Route | Allowed Role | Ownership Check Enforced |
|--------|-------|--------------|--------------------------|
| Candidate Profile | `PUT /candidates/{id}` | candidate | `profile.user_id == current_user.id` |
| Candidate Profile | `DELETE /candidates/{id}` | candidate | `profile.user_id == current_user.id` |
| Company Profile | `PUT /companies/{id}` | recruiter | `company.user_id == current_user.id` |
| Company Profile | `DELETE /companies/{id}` | recruiter | `company.user_id == current_user.id` |
| Job Requisition | `POST /jobs` | recruiter | Requires company owned by `current_user.id` |
| Job Requisition | `PUT /jobs/{id}` | recruiter | `job.company_id == company.id` |
| Job Requisition | `DELETE /jobs/{id}` | recruiter | `job.company_id == company.id` |
| Application | `POST /applications` | candidate | Requires candidate profile owned by user |
| Application | `GET /applications/{id}` | both | Candidate owns application OR recruiter owns job's company |
| Application | `PUT /applications/{id}` | both | Status change restricted to recruiter owning the job |
| Application | `DELETE /applications/{id}` | candidate | `application.candidate_id == candidate.id` |
| Interview | `POST /interviews` | recruiter | `application.job.company.user_id == current_user.id` |
| Interview | `GET /interviews/{id}` | both | Candidate owns application OR recruiter owns job's company |
| Interview | `PUT /interviews/{id}` | recruiter | `application.job.company.user_id == current_user.id` |
| Notification | `GET /notifications/{id}` | recipient | `notification.user_id == current_user.id` |

---

# 7. Code Refactoring and Maintainability

During Task 27, reusable utilities and cleaner structural separation were introduced to improve maintainability:

1. **Frontend Formatting Utilities (`src/utils/formatters.js`)**:
   - `formatSalary(min, max)`: Formats currency values into localized INR strings (e.g., `₹5,00,000 - ₹8,00,000` or `Up to ₹12,00,000`).
   - `formatDate(date)`: Formats ISO dates into Indian locale dates (e.g., `18 Sep 2026`).
   - `formatDateTime(date)`: Formats timestamps with time components for interview listings.
   - `formatStatus(status)`: Normalizes enum keys (`under_review` → `Under Review`).

2. **Backend CRUD Decoupling**:
   - Complex SQL queries were kept encapsulated inside `app/crud/` modules (`applications.py`, `jobs.py`, `interviews.py`), keeping API route handlers focused exclusively on HTTP serialization, status codes, and authorization guards.

3. **Debounced Query Execution**:
   - In `JobsPage.jsx`, search and filter input changes are debounced by 300ms using a `setTimeout` cleanup inside `useEffect`, preventing excessive HTTP requests to the backend during typing.

---

# 8. UI/UX Improvements

User interface improvements focused on visual hierarchy, accessibility, and clear feedback states:

1. **Landing Page Refinement**:
   - Clear visual separation between "How It Works" and "Transparency" via contrasting backgrounds (`bg-zinc-50` vs `bg-white`) and border delimiters.
   - Responsive hero section typography with smooth CTA transitions.

2. **Navigation Polish**:
   - Sticky frosted glass header (`backdrop-blur-xl bg-white/90 border-zinc-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.05)]`).
   - Responsive mobile navigation toggle with slide-down drawer.
   - Dynamic user greeting and logout actions.

3. **Form Feedback & Validation Display**:
   - In `RegisterPage.jsx`, real-time visual checklist indicators display compliance for password length, uppercase, lowercase, digit, and special characters.
   - Clear error banners rendered dynamically through `getApiError()`.

4. **Multi-Facet Job Catalog Filtering**:
   - Clean 4-column filter bar on `JobsPage.jsx` supporting keyword search, location, employment type, and experience level dropdowns with an instant "Reset filters" trigger.

---

# 9. API Documentation

The ClearHire backend exposes RESTful endpoints structured across 7 functional modules. All protected endpoints require an `Authorization: Bearer <token>` header.

---

### 9.1 Authentication APIs (`/auth`)

#### `POST /auth/register`
- **Authentication**: None (Public)
- **Role**: Any
- **Purpose**: Register a new candidate or recruiter account.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123!",
    "role": "candidate"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "candidate",
    "created_at": "2026-09-29T10:00:00Z"
  }
  ```
- **Validation**: Name min 2 chars; valid email; password min 8 chars with uppercase, lowercase, number, special char; role must be `candidate` or `recruiter`.
- **Status Codes**: `201 Created`, `400 Bad Request`, `409 Conflict`, `422 Unprocessable Content`.

#### `POST /auth/login`
- **Authentication**: None (Public)
- **Role**: Any
- **Purpose**: Authenticate user and issue JWT bearer token.
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "Password123!"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
    "token_type": "bearer"
  }
  ```
- **Status Codes**: `200 OK`, `401 Unauthorized`, `422 Unprocessable Content`.

#### `GET /auth/me`
- **Authentication**: Bearer Token
- **Role**: Authenticated User
- **Purpose**: Fetch current user session profile.
- **Response** (`200 OK`):
  ```json
  {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "candidate",
    "created_at": "2026-09-29T10:00:00Z"
  }
  ```
- **Status Codes**: `200 OK`, `401 Unauthorized`.

---

### 9.2 Candidate APIs (`/candidates`)

#### `POST /candidates`
- **Authentication**: Bearer Token
- **Role**: Candidate
- **Purpose**: Create candidate profile (one per account).
- **Request Body**:
  ```json
  {
    "headline": "Full Stack Developer",
    "bio": "Experienced in React and FastAPI",
    "location": "Bengaluru, India",
    "skills": "React, Python, FastAPI, PostgreSQL",
    "resume_url": "https://example.com/resume.pdf"
  }
  ```
- **Response** (`201 Created`): `CandidateProfileResponse`
- **Status Codes**: `201 Created`, `401 Unauthorized`, `409 Conflict`.

#### `GET /candidates`
- **Authentication**: Bearer Token
- **Purpose**: Retrieve list of all candidate profiles.
- **Response** (`200 OK`): `list[CandidateProfileResponse]`
- **Status Codes**: `200 OK`, `401 Unauthorized`.

#### `GET /candidates/{id}`
- **Authentication**: Bearer Token
- **Purpose**: Retrieve candidate profile by profile ID.
- **Response** (`200 OK`): `CandidateProfileResponse`
- **Status Codes**: `200 OK`, `401 Unauthorized`, `404 Not Found`.

#### `PUT /candidates/{id}`
- **Authentication**: Bearer Token
- **Role**: Candidate (Owner only)
- **Purpose**: Update candidate profile details.
- **Status Codes**: `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

#### `DELETE /candidates/{id}`
- **Authentication**: Bearer Token
- **Role**: Candidate (Owner only)
- **Purpose**: Delete candidate profile.
- **Status Codes**: `204 No Content`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

---

### 9.3 Company APIs (`/companies`)

#### `POST /companies`
- **Authentication**: Bearer Token
- **Role**: Recruiter
- **Purpose**: Create company profile (one per recruiter account).
- **Request Body**:
  ```json
  {
    "name": "Acme Technologies",
    "description": "Building cloud solutions",
    "website": "https://acme.example.com",
    "location": "Hyderabad, India",
    "industry": "Software"
  }
  ```
- **Response** (`201 Created`): `CompanyResponse`
- **Status Codes**: `201 Created`, `401 Unauthorized`, `409 Conflict`.

#### `GET /companies`
- **Authentication**: Bearer Token
- **Purpose**: Retrieve all registered companies.
- **Response** (`200 OK`): `list[CompanyResponse]`
- **Status Codes**: `200 OK`, `401 Unauthorized`.

#### `GET /companies/{id}`
- **Authentication**: Bearer Token
- **Purpose**: Retrieve company details by company ID.
- **Status Codes**: `200 OK`, `401 Unauthorized`, `404 Not Found`.

#### `PUT /companies/{id}`
- **Authentication**: Bearer Token
- **Role**: Recruiter (Owner only)
- **Purpose**: Update company profile details.
- **Status Codes**: `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

#### `DELETE /companies/{id}`
- **Authentication**: Bearer Token
- **Role**: Recruiter (Owner only)
- **Purpose**: Delete company profile.
- **Status Codes**: `204 No Content`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

---

### 9.4 Job APIs (`/jobs`)

#### `POST /jobs`
- **Authentication**: Bearer Token
- **Role**: Recruiter
- **Purpose**: Create a new job requisition under the recruiter's company.
- **Request Body**:
  ```json
  {
    "title": "Senior Python Engineer",
    "description": "Build high-throughput FastAPI microservices.",
    "location": "Bengaluru",
    "employment_type": "Full-time",
    "experience_level": "Senior",
    "salary_min": 1200000,
    "salary_max": 1800000,
    "skills": "Python, FastAPI, PostgreSQL, Docker",
    "application_deadline": "2026-10-31T23:59:59Z"
  }
  ```
- **Validation**: `salary_min <= salary_max`, non-negative salaries, valid title and employment type.
- **Status Codes**: `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found` (if company uncreated).

#### `GET /jobs`
- **Authentication**: None (Public)
- **Query Parameters**: `search` (str), `location` (str), `employment_type` (str), `experience_level` (str)
- **Purpose**: Retrieve job listings matching optional multi-facet filters.
- **Response** (`200 OK`): `list[JobResponse]`
- **Status Codes**: `200 OK`.

#### `GET /jobs/my-jobs`
- **Authentication**: Bearer Token
- **Role**: Recruiter
- **Purpose**: Retrieve all job requisitions posted by the authenticated recruiter's company.
- **Status Codes**: `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

#### `GET /jobs/{id}`
- **Authentication**: None (Public)
- **Purpose**: Retrieve complete details of a single job requisition.
- **Status Codes**: `200 OK`, `404 Not Found`.

#### `PUT /jobs/{id}`
- **Authentication**: Bearer Token
- **Role**: Recruiter (Owner only)
- **Purpose**: Update job requisition details.
- **Status Codes**: `200 OK`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

#### `DELETE /jobs/{id}`
- **Authentication**: Bearer Token
- **Role**: Recruiter (Owner only)
- **Purpose**: Delete job requisition.
- **Status Codes**: `204 No Content`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

---

### 9.5 Application APIs (`/applications`)

#### `POST /applications`
- **Authentication**: Bearer Token
- **Role**: Candidate
- **Purpose**: Apply for a job requisition.
- **Request Body**:
  ```json
  {
    "job_id": 1,
    "expected_response_days": 7
  }
  ```
- **Validation**: Candidate profile must exist; job must exist; deadline must not be passed; duplicate application disallowed.
- **Status Codes**: `201 Created`, `400 Bad Request` (expired deadline), `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict` (already applied).

#### `GET /applications/my-applications`
- **Authentication**: Bearer Token
- **Role**: Candidate
- **Purpose**: Retrieve all applications submitted by the authenticated candidate.
- **Status Codes**: `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

#### `GET /applications/job/{job_id}`
- **Authentication**: Bearer Token
- **Role**: Recruiter (Job Owner only)
- **Purpose**: Retrieve all candidate applications submitted for a specific job requisition.
- **Status Codes**: `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

#### `GET /applications/{id}`
- **Authentication**: Bearer Token
- **Role**: Candidate (applicant) or Recruiter (job owner)
- **Purpose**: View individual application details.
- **Status Codes**: `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

#### `GET /applications/{id}/history`
- **Authentication**: Bearer Token
- **Role**: Candidate (applicant) or Recruiter (job owner)
- **Purpose**: Retrieve audit history of application status transitions.
- **Status Codes**: `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

#### `PUT /applications/{id}`
- **Authentication**: Bearer Token
- **Role**: Candidate (notes/response days) or Recruiter (status updates)
- **Validation**: Recruiters can update status to: `applied`, `under_review`, `shortlisted`, `interview`, `rejected`, `offer`. Candidates cannot modify status.
- **Status Codes**: `200 OK`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

#### `DELETE /applications/{id}`
- **Authentication**: Bearer Token
- **Role**: Candidate (Owner only)
- **Purpose**: Withdraw candidate application.
- **Status Codes**: `204 No Content`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

---

### 9.6 Interview APIs (`/interviews`)

#### `POST /interviews`
- **Authentication**: Bearer Token
- **Role**: Recruiter (Job Owner only)
- **Purpose**: Schedule an interview for an application.
- **Request Body**:
  ```json
  {
    "application_id": 1,
    "interview_type": "Technical Round",
    "scheduled_at": "2026-10-15T14:00:00Z",
    "duration_minutes": 45,
    "meeting_link": "https://meet.google.com/abc-defg-hij",
    "notes": "Prepare live coding setup."
  }
  ```
- **Validation**: Recruiter must own the requisition; `scheduled_at` must be in the future.
- **Status Codes**: `201 Created`, `400 Bad Request` (past date), `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

#### `GET /interviews/application/{application_id}`
- **Authentication**: Bearer Token
- **Role**: Candidate (applicant) or Recruiter (job owner)
- **Purpose**: Retrieve scheduled interviews for a specific application.
- **Status Codes**: `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

#### `GET /interviews/{id}`
- **Authentication**: Bearer Token
- **Role**: Candidate (applicant) or Recruiter (job owner)
- **Purpose**: Retrieve individual interview details.
- **Status Codes**: `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

#### `PUT /interviews/{id}`
- **Authentication**: Bearer Token
- **Role**: Recruiter (Job Owner only)
- **Purpose**: Reschedule or update interview parameters.
- **Status Codes**: `200 OK`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

#### `DELETE /interviews/{id}`
- **Authentication**: Bearer Token
- **Role**: Recruiter (Job Owner only)
- **Purpose**: Cancel scheduled interview.
- **Status Codes**: `204 No Content`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

---

### 9.7 Notification APIs (`/notifications`)

#### `GET /notifications`
- **Authentication**: Bearer Token
- **Role**: Authenticated User
- **Purpose**: Retrieve in-app notifications for the authenticated user.
- **Status Codes**: `200 OK`, `401 Unauthorized`.

#### `GET /notifications/{id}`
- **Authentication**: Bearer Token
- **Role**: Recipient User only
- **Purpose**: View single notification.
- **Status Codes**: `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

#### `PUT /notifications/{id}/read`
- **Authentication**: Bearer Token
- **Role**: Recipient User only
- **Purpose**: Mark a notification as read.
- **Status Codes**: `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

---

# 10. Postman Testing and Verification

API verification was performed systematically against the running local Uvicorn development server (`http://127.0.0.1:8000`) using Postman. The test sequence covered account creation, authentication, profile instantiation, company setup, requisition posting, catalog querying, and profile retrieval.

Visual screenshot placeholders are established below for the seven tested requests:

---

### 1. User Registration (`POST /auth/register`)
- **Endpoint**: `POST http://127.0.0.1:8000/auth/register`
- **Description**: Validates candidate registration with normalized email and complex password criteria.

(ClearHire-Job Portal/docs/Register.png)

---

### 2. User Authentication (`POST /auth/login`)
- **Endpoint**: `POST http://127.0.0.1:8000/auth/login`
- **Description**: Submits registered credentials and receives a signed JWT access token in the response payload.

(ClearHire-Job Portal/docs/login.png)

---

### 3. Candidate Profile Creation (`POST /candidates`)
- **Endpoint**: `POST http://127.0.0.1:8000/candidates`
- **Description**: Creates candidate profile linked to authenticated candidate user account using Bearer authorization.

(ClearHire-Job Portal/docs/candidate.png)
---

### 4. Company Profile Creation (`POST /companies`)
- **Endpoint**: `POST http://127.0.0.1:8000/companies`
- **Description**: Recruiter profile initializes company entity required before publishing job requisitions.

(ClearHire-Job Portal/docs/companies.png)

---

### 5. Job Requisition Creation (`POST /jobs`)
- **Endpoint**: `POST http://127.0.0.1:8000/jobs`
- **Description**: Creates job requisition with salary boundaries, skills requirements, and application deadline.

(ClearHire-Job Portal/docs/jobs.png)

---

### 6. Public Job Catalog Retrieval (`GET /jobs`)
- **Endpoint**: `GET http://127.0.0.1:8000/jobs`
- **Description**: Public query returning active job requisitions ordered by creation timestamp.

(ClearHire-Job Portal/docs/job.png)

---

### 7. Candidate Profile Retrieval (`GET /candidates/1`)
- **Endpoint**: `GET http://127.0.0.1:8000/candidates/1`
- **Description**: Fetches individual candidate profile record using primary key identifier.

(ClearHire-Job Portal/docs/candidate.png)

---

# 11. Testing Results

The comprehensive test suite validated both positive execution pathways and negative security/validation edge cases:

| Test ID | Endpoint / Feature | Test Type | Expected Result | Actual Result | Status |
|:-------:|:-------------------|:---------:|:----------------|:--------------|:------:|
| TC-01 | `POST /auth/register` | Positive | `201 Created` with serialized `UserResponse` | User created with hashed password | Passed |
| TC-02 | `POST /auth/register` (Duplicate Email) | Negative | `409 Conflict` ("Account already exists") | Rejected with HTTP 409 | Passed |
| TC-03 | `POST /auth/register` (Weak Password) | Negative | `422 Unprocessable Content` (Validation error) | Rejected by regex validator | Passed |
| TC-04 | `POST /auth/login` | Positive | `200 OK` with valid JWT token | Bearer token returned | Passed |
| TC-05 | `POST /auth/login` (Wrong Password) | Negative | `401 Unauthorized` | HTTP 401 returned | Passed |
| TC-06 | `GET /auth/me` | Positive | `200 OK` with user details | User details returned | Passed |
| TC-07 | `GET /auth/me` (Expired/No Token) | Negative | `401 Unauthorized` | Rejected with HTTP 401 | Passed |
| TC-08 | `POST /candidates` | Positive | `201 Created` with candidate profile | Profile created | Passed |
| TC-09 | `POST /companies` | Positive | `201 Created` with company profile | Company profile created | Passed |
| TC-10 | `POST /jobs` | Positive | `201 Created` with job details | Job posted under company | Passed |
| TC-11 | `POST /jobs` (`salary_min > salary_max`) | Negative | `422 Unprocessable Content` | Rejected by model validator | Passed |
| TC-12 | `GET /jobs` | Positive | `200 OK` with job listings array | Array of jobs returned | Passed |
| TC-13 | `GET /jobs?search=Python` | Positive | `200 OK` with filtered results | Case-insensitive matches returned | Passed |
| TC-14 | `POST /applications` (Future Deadline) | Positive | `201 Created` with application record | Application registered | Passed |
| TC-15 | `POST /applications` (Past Deadline) | Negative | `400 Bad Request` ("Deadline has passed") | Rejected with HTTP 400 | Passed |
| TC-16 | `POST /applications` (Duplicate Apply) | Negative | `409 Conflict` ("Already applied") | Rejected with HTTP 409 | Passed |
| TC-17 | `POST /interviews` (Future Date) | Positive | `201 Created` with interview schedule | Interview scheduled | Passed |
| TC-18 | `POST /interviews` (Past Date) | Negative | `400 Bad Request` ("Must be in future") | Rejected with HTTP 400 | Passed |
| TC-19 | `POST /interviews` (Non-Owner Recruiter)| Negative | `403 Forbidden` | Access denied | Passed |
| TC-20 | `GET /candidates/1` | Positive | `200 OK` with candidate details | Profile returned | Passed |

---

# 12. Deployment Preparation

An operational audit was conducted to review the deployment readiness of the ClearHire platform.

### 12.1 Backend Readiness Audit
- **Dependency Specification**: `Backend/requirements.txt` specifies exact production packages (`fastapi`, `uvicorn[standard]`, `sqlalchemy`, `psycopg[binary]`, `python-dotenv`, `pydantic-settings`, `python-jose[cryptography]`, `passlib[bcrypt]`, `bcrypt==4.3.0`, `email-validator`).
- **Entrypoint**: Clean application entrypoint located at `app.main:app`.
- **Environment Management**: Configuration managed through `.env` and documented in `.env.example` (`DATABASE_URL`, `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`).
- **CORS Configuration**: Configured in `main.py` allowing frontend local origins (`http://localhost:5173`, `http://127.0.0.1:5173`). Requires production domain whitelist update prior to deployment.
- **Database Engine**: SQLAlchemy configured with PostgreSQL driver via psycopg.

### 12.2 Frontend Readiness Audit
- **Build Tooling**: Vite build pipeline configured via `npm run build` targeting `dist/`.
- **Environment Variable**: `VITE_API_URL` extracted via `import.meta.env.VITE_API_URL` inside `src/services/api.js`.
- **Client Routing**: React Router HTML5 browser history requires single-page redirect rules (`_redirects` or Nginx `try_files`) in production host.

### 12.3 Deployment Status Assessment
- **Status**: **Deployment configuration prepared/planned — Pending production rollout**.
- Containerization files (e.g., `Dockerfile`, `docker-compose.yml`), CI/CD automation workflows, and cloud hosting configurations have not yet been provisioned. The application has not been deployed to production.

---

# 13. Current Project Structure

The current verified directory layout of the repository is structured as follows:

```
ClearHire-Job Portal/
├── .gitignore
├── docs/
├── Backend/
│   ├── .env
│   ├── .env.example
│   ├── requirements.txt
│   └── app/
│       ├── __init__.py
│       ├── main.py                     # FastAPI application, CORS & router aggregation
│       ├── api/
│       │   ├── __init__.py
│       │   ├── dependencies.py         # Auth & role dependencies (get_current_user, require_roles)
│       │   └── routes/
│       │       ├── __init__.py
│       │       ├── applications.py     # Application workflow, deadline & ownership guards
│       │       ├── auth.py             # User registration, login & /auth/me
│       │       ├── candidates.py       # Candidate profile CRUD endpoints
│       │       ├── companies.py        # Company profile CRUD endpoints
│       │       ├── interviews.py       # Interview scheduling & past-date validation
│       │       ├── jobs.py             # Job catalog, search/filter & recruiter routes
│       │       └── notifications.py    # Notification inbox & read status endpoints
│       ├── core/
│       │   ├── __init__.py
│       │   ├── config.py               # Pydantic BaseSettings & env loading
│       │   └── security.py             # Password hashing (bcrypt) & JWT operations
│       ├── crud/
│       │   ├── __init__.py
│       │   ├── applications.py         # Application DB queries & status history
│       │   ├── candidates.py           # Candidate profile DB queries
│       │   ├── companies.py            # Company profile DB queries
│       │   ├── interviews.py           # Interview DB queries
│       │   ├── jobs.py                 # Job queries with multi-field ILIKE filtering
│       │   ├── notifications.py        # Notification DB queries
│       │   └── users.py                # User lookups (by email, by ID) & creation
│       ├── database/
│       │   ├── __init__.py
│       │   ├── base.py                 # DeclarativeBase instance
│       │   └── connection.py           # SessionLocal factory & get_db generator
│       ├── models/
│       │   ├── __init__.py
│       │   ├── application.py          # Application SQLAlchemy model
│       │   ├── application_status.py   # ApplicationStatusHistory model
│       │   ├── candidate.py            # CandidateProfile model
│       │   ├── company.py              # Company model
│       │   ├── interview.py            # Interview model
│       │   ├── job.py                  # Job model
│       │   ├── notification.py         # Notification model
│       │   └── user.py                 # User model
│       ├── schemas/
│       │   ├── __init__.py
│       │   ├── application.py          # Application request/response Pydantic models
│       │   ├── auth.py                 # Register/Login request schemas with validators
│       │   ├── candidate.py            # Candidate profile schemas
│       │   ├── company.py              # Company profile schemas
│       │   ├── interview.py            # Interview scheduling schemas
│       │   ├── job.py                  # Job schemas with salary range model validator
│       │   └── user.py                 # UserResponse schema
│       └── services/
│           ├── __init__.py
│           └── auth.py                 # Email normalization & auth business logic
│
└── Frontend/
    └── frontend/
        ├── .env                        # Local environment (VITE_API_URL=http://127.0.0.1:8000)
        ├── .env.example
        ├── .gitignore
        ├── eslint.config.js
        ├── index.html
        ├── package.json                # React 19, Tailwind CSS v4, Axios, React Router 7
        ├── package-lock.json
        ├── README.md
        ├── vite.config.js
        ├── public/
        │   ├── favicon.svg
        │   └── icons.svg
        └── src/
            ├── App.css
            ├── App.jsx                 # App root wrapped in AuthProvider & AppRoutes
            ├── index.css               # Tailwind CSS v4 imports
            ├── main.jsx                # React DOM render root with BrowserRouter
            ├── assets/
            │   ├── hero.png
            │   ├── react.svg
            │   └── vite.svg
            ├── components/
            │   ├── Navbar.jsx          # Role-aware responsive navigation header
            │   ├── applications/
            │   │   ├── ApplicationCard.jsx
            │   │   └── ApplyJobForm.jsx
            │   ├── interviews/
            │   │   └── ScheduleInterviewForm.jsx
            │   └── jobs/
            │       └── JobCard.jsx
            ├── context/
            │   └── AuthContext.jsx     # Global authentication state, login/logout & /auth/me
            ├── pages/
            │   ├── ApplicationsPage.jsx
            │   ├── CandidateDashboard.jsx
            │   ├── CandidateProfilePage.jsx
            │   ├── CompanyProfilePage.jsx
            │   ├── CreateJobPage.jsx
            │   ├── InterviewsPage.jsx
            │   ├── JobApplicationsPage.jsx
            │   ├── JobDetailsPage.jsx
            │   ├── JobsPage.jsx        # Public job catalog with search & multi-facet filters
            │   ├── LandingPage.jsx     # Brand landing page with separated sections
            │   ├── LoginPage.jsx
            │   ├── NotificationsPage.jsx
            │   ├── RecruiterDashboard.jsx
            │   ├── RecruiterJobsPage.jsx
            │   └── RegisterPage.jsx    # User registration with password validation
            ├── routes/
            │   └── AppRoutes.jsx       # Client route guards (Public, Protected, Role-based)
            ├── services/
            │   ├── api.js              # Central Axios client with Bearer token interceptor
            │   ├── applications.js
            │   ├── candidates.js
            │   ├── companies.js
            │   ├── interviews.js
            │   ├── jobs.js             # Job API calls with clean query parameter mapping
            │   └── notifications.js
            └── utils/
                ├── errors.js           # getApiError centralized error extractor
                └── formatters.js       # formatSalary, formatDate, formatDateTime, formatStatus
```

---

# 14. Technologies Used

| Domain | Technology | Version | Purpose |
|--------|------------|:-------:|---------|
| **Frontend Framework** | React | `^19.2.8` | Component-driven single-page user interface |
| **Build Tool** | Vite | `^8.3.0` | Fast development server and ES module bundler |
| **Routing** | React Router DOM | `^7.18.4` | Client-side declarative routing and role guards |
| **HTTP Client** | Axios | `^1.20.0` | Promise-based REST API client with request interceptors |
| **Styling** | Tailwind CSS | `^4.3.3` | Utility-first responsive CSS styling system |
| **Tailwind Vite Plugin** | `@tailwindcss/vite` | `^4.3.3` | Native Vite integration for Tailwind CSS |
| **Backend Framework** | FastAPI | latest | Asynchronous high-performance Python REST API |
| **ASGI Server** | Uvicorn | latest | Asynchronous Server Gateway Interface web server |
| **ORM** | SQLAlchemy | `^2.0` | Object Relational Mapping and SQL generation |
| **Database Driver** | Psycopg (Binary) | `^3.0` | High-performance PostgreSQL database adapter |
| **Database** | PostgreSQL | `^15` | Relational database management system |
| **Data Validation** | Pydantic / Pydantic Settings | `^2.0` | Declarative request/response validation and settings |
| **Security & Auth** | Python-Jose | latest | JSON Web Token (JWT) encoding and decoding |
| **Password Hashing** | Passlib & Bcrypt | `bcrypt==4.3.0` | Salted Bcrypt password hashing algorithm |
| **Email Validation** | email-validator | latest | Strict RFC email syntax validation |
| **API Testing** | Postman | v11 | Automated and manual REST endpoint verification |
| **Version Control** | Git & GitHub | latest | Distributed version control and collaboration |

---

# 15. DSA / Problem Solving

Today's work incorporated both practical problem-solving in production code and algorithmic complexity analysis exercises:

### 15.1 Production Problem Solving

1. **Datetime Comparison with Timezone Normalization**:
   - Encountered Python's `TypeError: can't compare offset-naive and offset-aware datetimes`.
   - Solved through standardizing on UTC: `datetime.now(timezone.utc)` and converting naive model instances via `.replace(tzinfo=timezone.utc)`.
   - **Time Complexity**: $O(1)$; **Space Complexity**: $O(1)$.

2. **In-Memory Duplicate Detection vs. Database Query**:
   - For application pre-flight checks, `any(app.job_id == job.id for app in applications)` performs a short-circuit linear search across candidate applications.
   - For small $k$ (typical number of applications per candidate, $k < 100$), $O(k)$ linear scan is efficient.
   - Identified the necessity of a database-level composite index on `(candidate_id, job_id)` for $O(\log n)$ B-tree enforcement.

3. **Multi-Facet Search Query Construction**:
   - Dynamic query composition using SQLAlchemy: building conditional `.filter()` clauses combined with `or_()` across `title`, `description`, `skills`, and `location`.
   - **Complexity**: $O(n)$ full table scan using SQL `ILIKE '%term%'`; identified recommendation for future full-text search indexing via PostgreSQL `tsvector` and GIN index.

### 15.2 Algorithmic Complexity Analysis Exercises (`ComplexityAnalysis.py`)

As part of today's computer science practice, searching and lookup algorithms were evaluated for runtime efficiency:

```python
# 1. Linear Search - O(n)
def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

# 2. Binary Search - O(log n) (Requires sorted array)
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# 3. Hash Map Lookup - O(1) average time
def create_lookup(arr):
    return {value: i for i, value in enumerate(arr)}

# 4. Duplicate Detection via Hash Set - O(n) time, O(n) space
def contains_duplicate(arr):
    seen = set()
    for value in arr:
        if value in seen:
            return True
        seen.add(value)
    return False

# 5. Two Sum with Hash Map - O(n) time, O(n) space
def two_sum(arr, target):
    seen = {}
    for i, value in enumerate(arr):
        required = target - value
        if required in seen:
            return [seen[required], i]
        seen[value] = i
    return []
```

**Complexity Comparison Matrix**:

| Algorithm | Best Time | Average Time | Worst Time | Space Complexity | Condition |
|-----------|:---------:|:------------:|:----------:|:----------------:|:----------|
| **Linear Search** | $O(1)$ | $O(n)$ | $O(n)$ | $O(1)$ | Any array |
| **Binary Search** | $O(1)$ | $O(\log n)$ | $O(\log n)$ | $O(1)$ | Array must be sorted |
| **Hash Map Lookup** | $O(1)$ | $O(1)$ | $O(n)$ | $O(n)$ | Unique hash keys |
| **Hash Set Duplicate** | $O(1)$ | $O(n)$ | $O(n)$ | $O(n)$ | Requires extra memory |
| **Two Sum (Hash Map)** | $O(1)$ | $O(n)$ | $O(n)$ | $O(n)$ | Single pass lookup |

---

# 16. Learning Outcomes

1. **Systematic Application Quality Assurance**: Learned to approach full-stack testing systematically by evaluating both happy-path flows and adversarial negative inputs (e.g., duplicate submissions, past interview dates, expired tokens).
2. **Deep Understanding of Pydantic v2 Validators**: Mastered declarative data modeling using `@model_validator(mode="after")` for cross-field validation (such as salary min/max checks) and `@field_validator` for string sanitization and regex enforcement.
3. **Timezone-Aware Python Engineering**: Understood the hazards of naive vs. aware datetimes in distributed web systems and adopted the best practice of standardizing on UTC (`datetime.now(timezone.utc)`).
4. **Defense-in-Depth Authorization**: Recognized that frontend route guards alone are insufficient for security; backend dependencies must verify both user roles and strict entity ownership across database relationships.
5. **Full-Stack Error Normalization**: Gained experience in bridging FastAPI's nested validation error lists with React UI state through dedicated parser functions, preventing broken UI renderings.
6. **Decoupled API Documentation Practices**: Developed the discipline to document APIs strictly against current code implementations and schemas rather than speculative designs.
7. **Production Deployment Planning**: Acquired practical insight into deployment prerequisites, distinguishing between local development convenience and production-readiness criteria (environment variable separation, CORS restrictions, build bundling).

---

# 17. Challenges Faced

1. **Datetime Comparison and Timezone Offsets**:
   - *Challenge*: Encountered comparison errors when validating job deadlines and interview schedules due to SQLAlchemy returning timezone-aware timestamps while standard Python datetime instances defaulted to naive objects.
   - *Solution*: Explicitly normalized all timestamps to UTC by checking `tzinfo is None` and applying `.replace(tzinfo=timezone.utc)` before performing arithmetic or comparison operations.

2. **Multi-Hop Entity Ownership Authorization**:
   - *Challenge*: Verifying that a recruiter has permission to schedule an interview required traversing three relational boundaries: `Interview -> Application -> Job -> Company -> user_id`.
   - *Solution*: Constructed reusable helper functions (`verify_recruiter_access`, `verify_application_access`) that safely navigate related models, verify foreign key relationships, and return unambiguous HTTP 403 Forbidden exceptions if any link fails.

3. **FastAPI Error Payload Parsing**:
   - *Challenge*: FastAPI returns error structures in inconsistent formats: simple HTTP exceptions return `{ "detail": "string" }`, while Pydantic validation failures return `{ "detail": [{ "loc": [...], "msg": "..." }] }`. Directly rendering this caused React to crash or print `[object Object]`.
   - *Solution*: Designed `src/utils/errors.js` to inspect the type of `detail`, map array messages into clean comma-separated strings, and provide descriptive fallbacks based on HTTP status codes.

4. **Preserving Visual Identity While Fixing Section Collapse**:
   - *Challenge*: Improving visual distinction between the "How It Works" and "Transparency" sections without altering the user's established layout, branding, or content structure.
   - *Solution*: Leveraged subtle Tailwind contrast tokens (`bg-zinc-50` paneling, `border-t border-zinc-100`, and `divide-y divide-zinc-200`) to introduce clean architectural separation while retaining the original typography and card mechanics.

---

# 18. Task Status

| Work Item | Target Area | Status | Verification Notes |
|:----------|:------------|:------:|:-------------------|
| **Bug 1: Landing Page Section Separation** | Frontend (`LandingPage.jsx`) | **Completed** | Visual contrast and borders verified |
| **Bug 2: Role-Aware Navigation** | Frontend (`Navbar.jsx`) | **Completed** | Conditional rendering by role verified |
| **Bug 3: Application Deadline Validation** | Backend (`routes/applications.py`) | **Completed** | Timezone-aware UTC checks active |
| **Bug 4: Interview Date & Authorization** | Backend (`routes/interviews.py`) | **Completed** | Future date & recruiter ownership verified |
| **Bug 5: Duplicate Application Prevention** | Backend (`routes/applications.py`) | **Completed (App-level)** | App-level check active; DB constraint pending |
| **Salary Range Validation** | Backend (`schemas/job.py`) | **Completed** | `@model_validator` active (`salary_min <= salary_max`) |
| **Password Complexity Validation** | Backend (`schemas/auth.py`) | **Completed** | 5-point regex validator active |
| **Centralized Error Extractor** | Frontend (`src/utils/errors.js`) | **Completed** | `getApiError()` unwraps Pydantic arrays & status codes |
| **Data Formatters** | Frontend (`src/utils/formatters.js`) | **Completed** | Localized INR salary and date formatters active |
| **Postman API Testing** | Backend REST APIs | **Completed** | 7 core endpoints tested and documented |
| **Screenshot Placeholders** | Documentation | **Completed** | Exactly 9 placeholders inserted (2 bug fixes, 7 Postman) |
| **API Reference Documentation** | Documentation | **Completed** | All 7 API groups documented with request/response schemas |
| **Deployment Preparation** | Architecture & Config | **Prepared / Planned** | Audit complete; deployment pending production task |
| **DSA & Complexity Analysis** | Python Practice | **Completed** | Executed in `ComplexityAnalysis.py` |
| **Final Documentation Creation** | Documentation | **Completed** | `Task-27-README.md` generated |

---

# 19. Conclusion

Task 27 successfully transitioned the ClearHire Job Portal system from an integrated prototype to a secure, resilient, and thoroughly verified application. By prioritizing real code inspection, all documented achievements represent actual repository implementations:

1. **Defects Eliminated**: Resolved visual layout collision on the landing page, implemented role-aware dynamic navigation in the global header, fixed critical application deadline validation using timezone-aware UTC datetime logic, and closed authorization vulnerabilities in interview scheduling.
2. **Data Integrity & Validation Hardened**: Enforced declarative Pydantic schemas for password complexity and salary boundaries, coupled with application-level duplicate prevention and centralized error message extraction on the frontend.
3. **Security & Ownership Formalized**: Implemented reusable FastAPI role dependencies (`require_roles`) and strict multi-hop entity ownership verification across candidate profiles, company entities, job requisitions, applications, and interview schedules.
4. **Verification Evidence Captured**: Systematically executed end-to-end API tests via Postman, recorded test result matrices, prepared visual screenshot placeholders, and created complete API documentation.

The ClearHire platform is now stable, robust, and well-documented, establishing a solid foundation for database migration hardening and containerized deployment in subsequent tasks.
