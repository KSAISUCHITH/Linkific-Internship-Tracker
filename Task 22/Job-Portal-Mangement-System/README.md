# ClearHire — Transparent Job Portal System

> **A modern, transparent recruitment platform designed to eliminate hiring ambiguity, streamline candidate tracking, and bring clarity to every stage of the application lifecycle.**

---

## 1. Project Overview

Finding and securing job opportunities in today's digital landscape is often an opaque, disjointed, and stressful experience. Job seekers navigate hundreds of fragmented job boards, apply to numerous roles, and frequently encounter the silence of "application black holes." 

### The Real-World Challenge
* **Opportunity Discovery Fatigue:** Job seekers struggle to pinpoint relevant opportunities matched to their specific skill levels, job types, and career goals.
* **Disorganized Application Tracking:** Candidates apply to multiple companies across disparate portals with no centralized way to monitor where each application stands.
* **The Information Void:** Candidates frequently receive little to no follow-up information once an application is submitted, leading to prolonged uncertainty.
* **Unclear Recruitment Cycles:** When internal hiring steps and statuses are not communicated or updated, both candidates and recruiters suffer from misaligned expectations.
* **Recruiter Overload & Management Friction:** Hiring teams and small-to-medium enterprises often lack structured, lightweight tools to systematically manage inbound candidate pipelines, communicate timelines, and provide structured feedback.

### The ClearHire Vision
**ClearHire** is engineered to resolve this disconnect by building a **radically transparent recruitment ecosystem**. The platform empowers candidates to discover roles, submit applications, and monitor their application journey through a structured status lifecycle. Simultaneously, it equips recruiters and hiring managers with streamlined job posting tools, candidate evaluation pipelines, and proactive response management mechanisms.

> **Status Notice:** This project is currently in its initial setup and planning phase. All functional application features described below represent the **planned specification** and roadmap for development.

---

## 2. Problem Statement

Modern online hiring is plagued by communication breakdowns. The primary challenge ClearHire addresses is **the lack of transparency and real-time accountability in candidate status tracking**.

### Tackling the "Ghosting" Phenomenon Responsibly
In recruitment discussions, "applicant ghosting" refers to the scenario where a candidate submits an application or completes an interview round and never receives another update or decision. While not every organization intentionally neglects candidate updates—many simply lack structured tracking tools or face overwhelming applicant volumes—the outcome for job seekers is identical: persistent uncertainty and inability to plan next career moves.

### ClearHire's Approach
ClearHire minimizes uncertainty by embedding transparency directly into the system architecture:
1. **Explicit Status States:** Replacing vague statuses with well-defined lifecycle states (*Applied*, *Screening*, *Interviewing*, *Offered*, *Archived/Rejected*).
2. **Audit History of Status Changes:** Maintaining a timestamped history of each status modification.
3. **Committed Response Windows:** Encouraging employers to state an expected response timeline (e.g., 7 or 14 business days).
4. **Overdue & Attention Indicators:** Flagging applications that have exceeded their expected response window so recruiters receive timely reminders to provide updates.

---

## 3. Proposed Solution

ClearHire is architected as a two-sided marketplace bringing job seekers and hiring teams into a synchronized workflow.

### Candidate-Facing Features *(Planned)*
* **Candidate Profile Management:** Manage contact details, resume uploads, portfolio links, education, and professional experience.
* **Job Discovery & Advanced Search:** Filter jobs by title, employment type (Full-time, Part-time, Remote, Internship), experience level, and salary range.
* **Detailed Job View:** Transparent job descriptions detailing expectations, salary brackets, application deadlines, and expected recruiter response times.
* **One-Click Application:** Streamlined submission linking the candidate's active profile and custom resume.
* **Application Tracker:** Centralized dashboard tracking active, interview-stage, and concluded applications.
* **Interactive Status Timeline:** Visual step-by-step progress bar showing the precise stage of each application.

### Recruiter & Company-Facing Features *(Planned)*
* **Company Profiles:** Showcase company branding, mission, website, and industry focus.
* **Job Requisition Management:** Create, publish, edit, and close job vacancies with custom response timeframes.
* **Candidate Pipeline Dashboard:** View, screen, and organize applicant pools for each open role.
* **Status Update Automation:** Move candidates across stages with optional internal notes or feedback messages.
* **Interview Coordination:** Schedule interview rounds (mode, date/time, meeting links) linked directly to the candidate's application.

### Core Transparency Features *(Planned Differentiators)*
* **Application Status Timeline:** Visual progression tracking every milestone from submission to final offer/rejection.
* **Expected Response Window:** Publicly committed turnaround time set by the employer on each job listing.
* **Response-Overdue Indicator:** Visual indicator highlighting applications pending recruiter action past the committed window.
* **Status Audit History:** Chronological log documenting when and what status changes occurred.
* **Recruiter Action Reminders:** System prompts encouraging hiring managers to conclude open reviews or deliver updates.

---

## 4. Target Users

| User Persona | Role & Core Needs |
| :--- | :--- |
| **Job Seekers / Candidates** | Individuals seeking employment opportunities. Needs clear job specs, simple application submission, real-time application status visibility, and scheduled interview details. |
| **Recruiters / Hiring Managers** | Individuals responsible for talent acquisition. Needs intuitive job posting forms, candidate applicant review boards, status management, and interview scheduling. |
| **Companies / Organizations** | Verified business entities listing open requisitions. Needs company profile management, branded presence, and aggregated hiring metrics. |
| **System Administrators** | Platform moderators responsible for system health, verifying company authenticity, policing fraudulent job postings, and ensuring data compliance. |

---

## 5. MVP Features

### Core Planned Features
* **User Authentication & Authorization:** Role-based registration and secure login for Candidates and Recruiters.
* **Profile Management:** Candidate portfolios/resumes and company organization profiles.
* **Job Requisition Engine:** Job posting, editing, searching, and multifaceted filtering.
* **Application Submissions:** Seamless job application submission with duplicate application prevention.
* **Unified Application Dashboards:** Dedicated views for Candidates (tracking sent applications) and Recruiters (managing received applications).
* **Application Status Lifecycle:** Core state transitions (*Applied* → *Under Review* → *Shortlisted* → *Interview Scheduled* → *Accepted / Rejected*).
* **Interview Scheduler:** Basic scheduling for interview dates, formats (remote/in-person), and video links.
* **In-App Notifications:** Real-time notifications for status transitions and interview invitations.

### Differentiating Transparency Features *(Planned)*
* **Application Progress Timeline:** Interactive visual milestone component reflecting live progress.
* **Expected Response Period:** SLA indicators on job cards indicating typical employer response speed.
* **Response-Overdue Indicator:** Visual tags indicating applications awaiting overdue feedback.
* **Status History Log:** Complete audit trail of past status events for candidate reassurance.
* **Recruiter Response Reminders:** Automated dashboard reminders alerting recruiters to pending applications.

---

## 6. System Architecture

ClearHire is structured as a decoupled, multi-tiered web application leveraging a high-performance Python asynchronous backend and a responsive, component-driven React frontend.

```
                      +-----------------------------+
                      |         Job Seeker          |
                      |    Recruiter / Company      |
                      +-----------------------------+
                                     |
                                     | HTTPS / Browser
                                     v
                      +-----------------------------+
                      |       React Frontend        |
                      |   (Vite + JavaScript/JSX)   |
                      +-----------------------------+
                                     |
                                     | RESTful JSON APIs
                                     v
                      +-----------------------------+
                      |       FastAPI Backend       |
                      |      (Python 3.10+)         |
                      +-----------------------------+
                         |                       |
                         v                       v
          +-------------------------+  +-------------------+
          |  Business Logic Layer   |  | Authentication &  |
          |  (Services & Schemas)   |  | Security (JWT)*   |
          +-------------------------+  +-------------------+
                         \                       /
                          v                     v
                      +-----------------------------+
                      |       SQLAlchemy ORM        |
                      |    (Data Persistence)       |
                      +-----------------------------+
                                     |
                                     | PostgreSQL Protocol
                                     v
                      +-----------------------------+
                      |     PostgreSQL Database     |
                      |  (Relational Storage)       |
                      +-----------------------------+
```
*\*Note: JWT, Business Logic, and Database connections represent planned architecture to be implemented in upcoming development days.*

### Layer Breakdown
* **Client Tier (Frontend):** React with Vite for fast HMR, component isolation, and lightweight responsive UI delivery.
* **API & Controller Tier (Backend):** FastAPI providing high-throughput ASGI async endpoints, automatic OpenAPI documentation, and strict request/response data validation via Pydantic.
* **Business Logic & Service Tier:** Decoupled service layer containing core recruitment workflows, state validation rules, and notification dispatchers.
* **Data Access Tier (ORM):** SQLAlchemy for declarative schema modeling, query generation, and relational integrity.
* **Data Storage Tier:** PostgreSQL for enterprise-grade relational data consistency, transactional guarantees, and indexing.
* **Security & Token Layer *(Planned)*:** Stateless JSON Web Token (JWT) authentication with password hashing using bcrypt.

---

## 7. Frontend Architecture

The client-side architecture follows standard component-driven patterns separating presentation, business state, and data fetching services.

```
frontend/
└── src/
    ├── components/    # Reusable UI elements (Buttons, Badges, Modals, Timeline)
    ├── pages/         # Top-level routable views (Jobs, ApplicationTracker, Dashboard)
    ├── services/      # Axios / Fetch client API integration modules
    ├── context/       # React Context providers (AuthContext, NotificationContext)
    ├── hooks/         # Custom React hooks (useAuth, useApplications, useDebounce)
    ├── utils/         # Helper functions, date formatters, and status validators
    ├── App.jsx        # Root component and layout routing structure
    └── main.jsx       # DOM entry point and React root mounting
```

### Module Responsibilities *(Planned)*
* **`components/`**: House atomic and composite design elements such as `StatusTimeline`, `JobCard`, `Navbar`, `StatusBadge`, and `NotificationToast`.
* **`pages/`**: Route-level components including `HomePage`, `JobSearchPage`, `JobDetailPage`, `CandidateDashboard`, `RecruiterDashboard`, and `ApplicationDetailsPage`.
* **`services/`**: Encapsulate all HTTP REST API calls to the FastAPI backend (e.g., `jobService.js`, `applicationService.js`, `authService.js`).
* **`context/`**: Global state management ensuring user authentication status and application themes persist cleanly across routes.
* **`hooks/`**: Custom hooks encapsulating shared stateful logic like pagination, debounced search queries, and session checks.
* **`utils/`**: General formatting utilities (e.g., currency formatting, relative timestamps, status color-mapping).

---

## 8. Backend Architecture

The backend follows a clean, modular architecture emphasizing separation of concerns and clear domain boundaries.

```
backend/
└── app/
    ├── core/          # App configuration, security settings, JWT helpers
    ├── database/      # Engine configuration, sessionmaker, base declarative class
    ├── models/        # SQLAlchemy relational database models
    ├── schemas/       # Pydantic schemas for request validation & response serialization
    ├── crud/          # Low-level database CRUD operations
    ├── services/      # Business logic orchestration (Application status rules, timers)
    ├── api/           # API router grouping
    │   └── routes/    # Individual domain endpoints (jobs, auth, applications)
    ├── __init__.py    # Package initializer
    └── main.py        # FastAPI app declaration, middleware, and route mounting
```

### Module Responsibilities *(Planned)*
* **`core/`**: Houses application settings (`config.py`), security primitives (`security.py`), and constants.
* **`database/`**: Initializes database connections (`session.py`) and declarative bases (`base.py`).
* **`models/`**: Defines relational entities (`User`, `Job`, `Application`, `StatusHistory`, etc.).
* **`schemas/`**: Defines input/output schemas enforcing strict typing, field requirements, and OpenAPI docs.
* **`crud/`**: Isolates direct database queries and mutations to prevent query duplication.
* **`services/`**: Encapsulates multi-model workflows, status transition validation, and reminder triggers.
* **`api/routes/`**: Declares REST endpoints organized by domain (`/auth`, `/jobs`, `/applications`, `/interviews`).
* **`main.py`**: Minimal application initialization, CORS configuration, and ASGI entry point.

---

## 9. Database Architecture *(Preliminary Design)*

The planned persistence layer utilizes PostgreSQL. The relational schema is structured to ensure referential integrity, historical auditability, and fast indexed lookups.

```
+--------------------+        +---------------------------+
|       users        |------->|    candidate_profiles     |
+--------------------+ 1    1 +---------------------------+
          |
          | 1
          v *
+--------------------+        +---------------------------+
|     companies      |------->|           jobs            |
+--------------------+ 1    * +---------------------------+
                                            | 1
                                            v *
+--------------------+ 1    * +---------------------------+
| candidate_profiles |------->|       applications        |
+--------------------+        +---------------------------+
                                       | 1            | 1
                         +-------------+              +-------------+
                         | *                                        | *
                         v                                          v
+----------------------------------+          +---------------------------+
|    application_status_history    |          |        interviews         |
+----------------------------------+          +---------------------------+
```

### Preliminary Entity Schemas

#### `users`
* `id` (PK, Integer, Auto-increment)
* `name` (String, Not Null)
* `email` (String, Unique, Indexed, Not Null)
* `password_hash` (String, Not Null)
* `role` (Enum: `candidate`, `recruiter`, `admin`, Not Null)
* `created_at` (Timestamp with Timezone, Default: NOW)

#### `candidate_profiles`
* `id` (PK, Integer, Auto-increment)
* `user_id` (FK → `users.id`, Unique, Not Null)
* `phone` (String, Nullable)
* `location` (String, Nullable)
* `education` (Text, Nullable)
* `experience` (Text, Nullable)
* `resume_url` (String, Nullable)
* `bio` (Text, Nullable)

#### `companies`
* `id` (PK, Integer, Auto-increment)
* `name` (String, Not Null)
* `description` (Text, Nullable)
* `website` (String, Nullable)
* `location` (String, Nullable)
* `logo_url` (String, Nullable)
* `created_at` (Timestamp with Timezone, Default: NOW)

#### `jobs`
* `id` (PK, Integer, Auto-increment)
* `company_id` (FK → `companies.id`, Not Null)
* `title` (String, Indexed, Not Null)
* `description` (Text, Not Null)
* `location` (String, Not Null)
* `job_type` (Enum: `full_time`, `part_time`, `contract`, `internship`, `remote`)
* `experience_required` (String, Nullable)
* `salary_min` (Numeric, Nullable)
* `salary_max` (Numeric, Nullable)
* `deadline` (Timestamp, Nullable)
* `response_days` (Integer, Default: 14) — *Committed SLA response days*
* `status` (Enum: `active`, `paused`, `closed`, Default: `active`)
* `created_at` (Timestamp with Timezone, Default: NOW)

#### `applications`
* `id` (PK, Integer, Auto-increment)
* `job_id` (FK → `jobs.id`, Not Null)
* `candidate_id` (FK → `candidate_profiles.id`, Not Null)
* `resume_url` (String, Not Null)
* `current_status` (Enum: `applied`, `under_review`, `shortlisted`, `interview`, `offered`, `rejected`, Default: `applied`)
* `applied_at` (Timestamp with Timezone, Default: NOW)
* `last_updated_at` (Timestamp with Timezone, Default: NOW)

#### `application_status_history`
* `id` (PK, Integer, Auto-increment)
* `application_id` (FK → `applications.id`, Not Null)
* `status` (String, Not Null)
* `changed_at` (Timestamp with Timezone, Default: NOW)
* `changed_by` (FK → `users.id`, Not Null)
* `note` (Text, Nullable)

#### `interviews`
* `id` (PK, Integer, Auto-increment)
* `application_id` (FK → `applications.id`, Not Null)
* `scheduled_at` (Timestamp with Timezone, Not Null)
* `mode` (Enum: `video`, `phone`, `in_person`, Default: `video`)
* `meeting_link` (String, Nullable)
* `notes` (Text, Nullable)
* `status` (Enum: `scheduled`, `completed`, `cancelled`, Default: `scheduled`)

#### `notifications`
* `id` (PK, Integer, Auto-increment)
* `user_id` (FK → `users.id`, Not Null)
* `application_id` (FK → `applications.id`, Nullable)
* `message` (Text, Not Null)
* `type` (Enum: `status_change`, `interview_scheduled`, `overdue_reminder`, `general`)
* `is_read` (Boolean, Default: FALSE)
* `created_at` (Timestamp with Timezone, Default: NOW)

### Key Relationships
* **User → Candidate Profile:** One-to-One relationship defining candidate profile attributes.
* **Company → Jobs:** One-to-Many relationship linking published vacancies to an employer.
* **Candidate → Applications:** One-to-Many relationship tracking all roles applied to by a user.
* **Job → Applications:** One-to-Many relationship aggregating candidate submissions per vacancy.
* **Application → Status History:** One-to-Many audit log recording state transitions over time.
* **Application → Interview:** One-to-Many relationship scheduling interviews tied to a specific candidate application.
* **User → Notifications:** One-to-Many relationship providing direct candidate/recruiter alerts.

> **Design Notice:** This schema is a preliminary design subject to normalization, indexing adjustments, and migration script generation during Day 24 development.

---

## 10. Application Flow

### Candidate Application Journey
```
[ Register / Login ]
        ↓
[ Build / Update Profile ]
        ↓
[ Search & Filter Open Jobs ]
        ↓
[ Review Job Details & Response SLA ]
        ↓
[ Submit Application ]
        ↓
[ Track in Central Dashboard ]
        ↓
[ Receive Transparent Status Updates ]
        ↓
[ Attend Scheduled Interview ]
        ↓
[ Final Decision (Offer / Rejection with Closure) ]
```

### Recruiter & Hiring Workflow
```
[ Register / Recruiter Login ]
        ↓
[ Setup / Verify Company Profile ]
        ↓
[ Post Job Requisition with Response SLA ]
        ↓
[ Receive & Screen Inbound Applications ]
        ↓
[ Review Profiles & Resumes ]
        ↓
[ Update Status / Move Candidates across Pipeline ]
        ↓
[ Schedule Interviews with Video/Location Details ]
        ↓
[ Deliver Final Decision & Clear Applicant Queue ]
```

---

## 11. Development Timeline — Days 23–29

This roadmap details the planned day-by-day technical execution plan leading to the complete MVP.

```
   Day 23         Day 24         Day 25         Day 26         Day 27         Day 28         Day 29
 [ Planning ] -> [ Database ] -> [ Auth/Users ] -> [ Jobs/Apps ] -> [ Frontend ] -> [ Integration ] -> [ Testing/Docs ]
```

### Day 23: Requirements, Architecture & Project Scaffolding *(Completed)*
* Finalize real-world problem statement and recruitment transparency goals.
* Define target personas (Seeker, Recruiter, Admin).
* Draft MVP scope and differentiating transparency features.
* Map high-level system architecture and data models.
* Scaffold React + Vite frontend and FastAPI backend folder structures.
* Establish initial Git configuration and comprehensive project documentation.

### Day 24: Database Design & Backend Foundation
* Finalize relational PostgreSQL schema and constraints.
* Configure SQLAlchemy engine, session maker, and Base declarative model.
* Initialize Alembic migration scripts.
* Implement database health check and connection resilience testing.
* Setup environment management for local and staging databases.

### Day 25: Authentication & User Management
* Implement secure password hashing using `passlib` / `bcrypt`.
* Develop JWT token creation, decoding, and expiration logic.
* Build `/auth/register` and `/auth/login` endpoints.
* Implement Role-Based Access Control (`candidate`, `recruiter`, `admin`).
* Build candidate profile CRUD and company profile CRUD endpoints.

### Day 26: Jobs & Applications Backend
* Implement job creation, listing, detail, and update endpoints with pagination.
* Build multi-criteria job filtering (type, location, salary, keywords).
* Implement job application submission endpoints with duplicate submission prevention.
* Implement application status management logic and status transition validators.
* Build the application status history logger.

### Day 27: React Frontend Development
* Configure React Router for candidate and recruiter views.
* Develop common design system components (Navigation, Cards, Inputs, Modals).
* Build Job Search and Job Details pages.
* Develop Candidate Dashboard featuring the visual Application Status Timeline.
* Build Recruiter Pipeline Board for tracking and moving applicants.

### Day 28: Integration & Transparency Features
* Integrate React frontend with FastAPI backend REST services.
* Wire up authentication persistence via React Context (`AuthContext`).
* Implement the visual **Application Status Timeline** and status history log.
* Build the **Expected Response Window** and **Overdue Warning** components.
* Implement recruiter response reminder triggers and in-app notifications.

### Day 29: End-to-End Testing, Polish & Delivery
* Conduct automated API integration tests with `pytest` / `httpx`.
* Perform frontend user workflow validation (registration to hiring decision).
* Validate responsive layouts across mobile, tablet, and desktop screens.
* Perform code cleanup, security checks, and remove dead code.
* Finalize production documentation, screenshots, and delivery artifacts.

---

## 12. GitHub Repository & Commit Guidelines

The repository adheres to atomic, descriptive commit messages to ensure traceability throughout the project lifecycle.

### Initial Commit
* `feat: initial project setup and architecture documentation`

### Planned Commit Progression (Reference Examples)
* `feat(database): setup postgresql connection and base models`
* `feat(auth): implement jwt authentication and password hashing`
* `feat(jobs): add job posting and filtering api endpoints`
* `feat(applications): implement application submission and status tracking`
* `feat(frontend): initialize router and core design components`
* `feat(frontend): build candidate dashboard and application timeline`
* `feat(frontend): implement recruiter candidate management board`
* `feat(transparency): add expected response time and overdue indicator`
* `feat(notifications): add in-app notifications for status updates`
* `test: add integration test suite for application lifecycle`
* `docs: update final screenshots and deployment instructions`

---

## 13. Future Improvements *(Post-MVP Roadmap)*

Beyond the initial MVP scope, the following advanced capabilities are planned for future iterations:

* **AI-Powered Match Scoring:** Analyze candidate profiles and job descriptions using semantic embeddings to recommend top-fitting roles.
* **Intelligent Resume Parsing:** Extract skills, experience, and certifications automatically from PDF resumes to pre-fill profiles.
* **Skill-Gap Analysis:** Provide candidates with targeted feedback on skills they need to acquire for their dream jobs.
* **Email & SMS Event Dispatch:** Real-time email alerts (via SendGrid/AWS SES) when status changes or interview invitations occur.
* **Advanced Hiring Analytics:** Employer dashboard tracking metrics like Time-to-Hire, Candidate Drop-off, and Pipeline Velocity.
* **Calendar Integration:** Two-way sync with Google Calendar and Outlook for seamless interview scheduling.
* **Fraud Detection & Employer Verification:** Automated domain and registry checks to protect job seekers from scam listings.
* **In-Platform Resume Builder:** Interactive template builder allowing candidates to generate professional ATS-friendly CVs.

---

## 14. Current Project Status

### Project Stage
**Initial Project Setup & Foundation Phase (Day 23 Completed)**

### Completed Items
- [x] Full-stack project directory structure created
- [x] React (Vite + JSX) frontend initialized and verified
- [x] FastAPI (Python) backend entry point created and verified
- [x] Requirements specification and environment templates created
- [x] System architecture and layered data-flow mapped
- [x] PostgreSQL relational database schema designed
- [x] Development roadmap (Days 23–29) documented
- [x] Git configuration (`.gitignore`) established

### Planned & Not Yet Implemented
- [ ] User authentication & JWT security
- [ ] SQLAlchemy database models & Alembic migrations
- [ ] REST API routes & CRUD business logic
- [ ] Candidate & recruiter profile management
- [ ] Job search, posting, and filtering engine
- [ ] Application submission & status management
- [ ] Visual Application Status Timeline & Overdue Indicators
- [ ] Candidate & Recruiter frontend dashboards
- [ ] In-app notification engine

---

## Quick Start (Development Initialization)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
*API will run at: `http://localhost:8000`*  
*Swagger Documentation: `http://localhost:8000/docs`*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend will run at: `http://localhost:5173`*
