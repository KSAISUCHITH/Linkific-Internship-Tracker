# Task 25 – React Frontend, API Integration and Dynamic UI

### Date
26/09/2026

### Project
ClearHire – Job Portal System

---

# 1. Task Objectives

The primary focus of today's work was designing, building, and integrating the complete frontend user interface for the ClearHire Job Portal system using React, Vite, Tailwind CSS, Axios, and React Router. Today's efforts connected the frontend with the FastAPI and PostgreSQL backend developed in previous tasks, establishing end-to-end data flows, role-based workflows, and dynamic UI state handling.

Key objectives for Task 25:
- **Build Core UI Pages**: Construct responsive, accessible, and structured page layouts for guests, candidates, and recruiters.
- **Connect Frontend with Backend**: Implement a centralized Axios HTTP client with request interceptors to automatically transmit Bearer JWT authentication tokens.
- **Establish Modular API Service Layer**: Decouple HTTP requests from UI components into specialized API service modules (`jobs`, `candidates`, `applications`, `companies`, `interviews`, `notifications`).
- **Implement Global Authentication State**: Provide application-wide authentication context (`AuthContext`) managing JWT tokens, user profile bootstrapping via `/auth/me`, login, registration, and logout.
- **Enforce Role-Based Routing**: Define declarative client-side route guards (`PublicRoute`, `ProtectedRoute`, `RoleRoute`) using React Router to separate candidate and recruiter privileges.
- **Display Dynamic Data and Handle Lifecycle States**: Implement clean loading indicators, error banners, and empty-state placeholders across all views.
- **Add Interactive Forms with Client Validation**: Build structured forms for job applications, candidate profiles, company profiles, job requisition creation, and interview scheduling.
- **Improve First-Time Candidate Onboarding**: Handle missing candidate profile records gracefully by displaying an onboarding banner with a call-to-action rather than failing the dashboard.
- **Practice Component Reusability & UI Consistency**: Create reusable UI components (`Navbar`, `JobCard`, `ApplicationCard`, `ApplyJobForm`, `ScheduleInterviewForm`) sharing a unified design aesthetic.
- **Python Backend Practice – JSON Serialization**: Study and execute Python JSON serialization and deserialization techniques using `json.dumps()`, `json.loads()`, `json.dump()`, and `json.load()`.
- **React Concept Mastery – Rendering Lifecycle**: Analyze the React rendering cycle, state transitions, side-effect execution with `useEffect`, and component cleanups.
- **Data Structures and Algorithms – Search Fundamentals**: Evaluate linear search mechanics and algorithmic complexities using practical JavaScript examples from the ClearHire portal.

---

# 2. Frontend Project Structure and Architecture

The ClearHire frontend is structured as a modular single-page application (SPA) located in `Frontend/frontend/src/`. The codebase enforces strict separation of concerns between state management, page views, shared components, routing rules, and network communication services.

### Directory Layout

```
frontend/src/
├── assets/                          # Static assets and icons
├── context/
│   └── AuthContext.jsx              # Global authentication context and provider
├── pages/
│   ├── LandingPage.jsx              # Brand landing page with product overview
│   ├── LoginPage.jsx                # User authentication page
│   ├── RegisterPage.jsx             # User registration (candidate/recruiter)
│   ├── JobsPage.jsx                 # Public job catalog with dynamic listings
│   ├── JobDetailsPage.jsx           # Individual job view with apply form
│   ├── ApplicationsPage.jsx         # Candidate application history
│   ├── CandidateDashboard.jsx       # Candidate metrics and onboarding hub
│   ├── CandidateProfilePage.jsx     # Candidate profile management
│   ├── RecruiterDashboard.jsx       # Recruiter metrics and company summary
│   ├── CompanyProfilePage.jsx       # Recruiter company profile management
│   ├── CreateJobPage.jsx            # Job requisition creation form
│   ├── RecruiterJobsPage.jsx        # Recruiter job postings management
│   ├── JobApplicationsPage.jsx      # Recruiter candidate applicant review
│   ├── InterviewsPage.jsx           # Candidate interview schedule overview
│   └── NotificationsPage.jsx        # Real-time candidate notification inbox
├── components/
│   ├── Navbar.jsx                   # Role-aware responsive navigation header
│   ├── jobs/
│   │   └── JobCard.jsx              # Reusable job summary card
│   ├── applications/
│   │   ├── ApplyJobForm.jsx         # Job application submission form
│   │   └── ApplicationCard.jsx      # Application status and metadata card
│   └── interviews/
│       └── ScheduleInterviewForm.jsx# Interview scheduling form with UTC parsing
├── routes/
│   └── AppRoutes.jsx                # Route definitions and authorization guards
├── services/
│   ├── api.js                       # Central Axios client with interceptors
│   ├── jobs.js                      # Job REST API endpoints
│   ├── candidates.js                # Candidate profile REST API endpoints
│   ├── applications.js              # Application REST API endpoints
│   ├── companies.js                 # Company REST API endpoints
│   ├── interviews.js                # Interview scheduling REST API endpoints
│   └── notifications.js             # Notification REST API endpoints
├── App.jsx                          # Root component wrapped with AuthProvider
├── App.css                          # Application-level styling
├── index.css                        # Tailwind CSS imports and base typography
└── main.jsx                         # Application entrypoint with BrowserRouter
```

### High-Level Architectural Flow

The ClearHire system operates as a decoupled client-server architecture. The browser client interacts with the FastAPI backend exclusively through serialized JSON payloads over HTTP:

```
User Interaction (Browser)
           │
           ▼
React Pages & UI Components
           │
           ▼
React Router (Client-side Routing & Guards)
           │
           ▼
Axios Service Layer (services/*.js)
           │ (Attaches Bearer JWT Header via Request Interceptor)
           ▼
FastAPI REST API Server (Python Backend)
           │
           ▼
SQLAlchemy ORM (CRUD Operations & Models)
           │
           ▼
PostgreSQL Database
```

### Module Responsibilities

| Layer | Primary Responsibility | ClearHire Implementation |
|---|---|---|
| **Pages (`pages/`)** | Orchestrate views, initiate data fetching on mount, handle lifecycle states, and arrange components. | `LandingPage`, `JobsPage`, `CandidateDashboard`, `RecruiterDashboard`, etc. |
| **Components (`components/`)** | Provide reusable, isolated UI elements and sub-forms across multiple pages. | `Navbar`, `JobCard`, `ApplicationCard`, `ApplyJobForm`, `ScheduleInterviewForm`. |
| **Context (`context/`)** | Provide global accessible state without prop drilling. | `AuthContext` managing authentication tokens, current user entity, and session persistence. |
| **Routes (`routes/`)** | Declare URL mapping, handle wildcards, and enforce security policies. | `AppRoutes` configuring `PublicRoute`, `ProtectedRoute`, and `RoleRoute`. |
| **Services (`services/`)** | Encapsulate REST API calls into clean asynchronous JavaScript functions. | `api.js` and resource-specific modules (`jobs.js`, `applications.js`, etc.). |
| **API Layer (`services/api.js`)** | Provide a pre-configured Axios instance with base URLs and automatic token injection. | Interceptor reads `access_token` from `localStorage` on every outbound request. |

---

# 3. Axios API Client and Service Layer

To avoid duplicating HTTP request configurations, base URLs, and authentication header management across dozens of components, ClearHire utilizes a centralized Axios instance located in `Frontend/frontend/src/services/api.js`.

### 3.1 Central Axios Instance and Request Interceptors

The Axios client reads the API base URL dynamically from Vite's environment variables (`import.meta.env.VITE_API_URL`), falling back to `http://127.0.0.1:8000` for local development.

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
```

#### Interceptor Mechanics:
1. **Dynamic Token Extraction**: Before any outgoing HTTP request leaves the browser, the request interceptor inspects browser `localStorage` for `access_token`.
2. **Automatic Header Injection**: When a token is found, it automatically attaches `Authorization: Bearer <token>` to the request headers. Unauthenticated requests (such as public job browsing or initial login) proceed cleanly without the header.
3. **Promise Rejection Handling**: In case of client-side request configuration errors, the interceptor rejects the promise, allowing callers to handle exceptions gracefully.

### 3.2 API Service Modules

ClearHire decouples backend communication from the view layer into dedicated service modules. Each function returns the extracted `response.data` payload directly:

| Service File | Function | HTTP Method & Endpoint | Description |
|---|---|---|---|
| `jobs.js` | `getJobs()` | `GET /jobs` | Fetches all publicly published job postings. |
| `jobs.js` | `getJob(jobId)` | `GET /jobs/{jobId}` | Retrieves comprehensive details for a specific job. |
| `jobs.js` | `getMyJobs()` | `GET /jobs/my-jobs` | Fetches jobs posted by the authenticated recruiter. |
| `jobs.js` | `createJob(data)` | `POST /jobs` | Publishes a new job requisition. |
| `jobs.js` | `deleteJob(jobId)` | `DELETE /jobs/{jobId}` | Permanently deletes a job posting. |
| `candidates.js` | `getCandidateProfiles()` | `GET /candidates` | Retrieves candidate profiles for user matching. |
| `candidates.js` | `createCandidateProfile(data)` | `POST /candidates` | Creates a new candidate profile record. |
| `candidates.js` | `updateCandidateProfile(id, data)` | `PUT /candidates/{id}` | Updates existing candidate details and resume. |
| `applications.js` | `createApplication(data)` | `POST /applications` | Submits a candidate application for a job. |
| `applications.js` | `getMyApplications()` | `GET /applications/my-applications` | Retrieves current candidate application history. |
| `applications.js` | `getJobApplications(jobId)` | `GET /applications/job/{jobId}` | Retrieves all candidate submissions for a recruiter job. |
| `applications.js` | `updateApplication(id, data)`| `PUT /applications/{id}` | Modifies application status (e.g., Shortlisted, Interview). |
| `companies.js` | `getCompanies()` | `GET /companies` | Retrieves all registered employer company entities. |
| `companies.js` | `createCompany(data)` | `POST /companies` | Registers a new company profile for a recruiter. |
| `companies.js` | `updateCompany(id, data)` | `PUT /companies/{id}` | Updates company profile information. |
| `interviews.js` | `createInterview(data)` | `POST /interviews` | Schedules an interview round for an application. |
| `interviews.js` | `getApplicationInterviews(appId)`| `GET /interviews/application/{appId}`| Retrieves scheduled rounds for an application. |
| `notifications.js`| `getNotifications()` | `GET /notifications` | Retrieves user alert notifications. |
| `notifications.js`| `markNotificationRead(id)`| `PUT /notifications/{id}/read` | Marks a specific notification as read. |

---

# 4. Authentication and State Management (AuthContext)

User session state, profile caching, and authentication lifecycle are managed centrally in `Frontend/frontend/src/context/AuthContext.jsx`. The context exposes helper functions and state properties consumed across the component tree via the custom hook `useAuth()`.

### 4.1 Authentication Lifecycle

```
Application Mount (main.jsx -> App.jsx)
           │
           ▼
AuthProvider checks localStorage for 'access_token'
           │
     ┌─────┴────────────────────────┐
     ▼                              ▼
Token Found                   No Token Found
     │                              │
GET /auth/me                        │
     │                              │
 ┌───┴───────────────┐              │
 ▼                   ▼              │
Success            Failure          │
(setUser(data))   (remove token)    │
     │                   │          │
     └───────────┬───────┘          │
                 ▼                  ▼
          setLoading(false)   setLoading(false)
                 │                  │
                 └─────────┬────────┘
                           ▼
                 Ready to Render Routes
```

### 4.2 State Variables and Operations

1. **State Variables**:
   - `user`: Holds the authenticated user object (`id`, `name`, `email`, `role`, `created_at`) or `null`.
   - `loading`: Boolean flag indicating whether the initial `/auth/me` bootstrap check is in flight. Prevents route redirection flickers during cold boot.
   - `isAuthenticated`: Derived boolean flag (`Boolean(user)`).

2. **Login Operation (`login(email, password)`)**:
   - Sends credentials to `POST /auth/login`.
   - Stores `response.data.access_token` into `localStorage`.
   - Dispatches a subsequent request to `GET /auth/me` using the new token to populate full user data into state.

3. **Registration Operation (`register(name, email, password, role)`)**:
   - Sends payload to `POST /auth/register`.
   - Returns the created user object for navigation handling.

4. **Logout Operation (`logout()`)**:
   - Clears `access_token` from `localStorage`.
   - Sets `user` state to `null`.

5. **Self-Healing Token Invalidation**:
   - If an expired or invalid token exists in `localStorage`, `GET /auth/me` will return an HTTP 401 error. The catch block removes the invalid token and resets `user` to `null` without crashing the application.

---

# 5. Routing and Route Protection

Client-side routing is configured using React Router in `Frontend/frontend/src/routes/AppRoutes.jsx`. The system utilizes route guard wrapper components to prevent unauthorized access based on authentication state and user roles.

### 5.1 Route Guards

1. **`ProtectedRoute`**:
   - Verifies that `isAuthenticated` is `true`.
   - While `loading` is active, it renders `null` to avoid false redirects.
   - If unauthenticated, it redirects to `/login` with `replace`.

2. **`RoleRoute({ allowedRoles, children })`**:
   - Enforces role-based access control (RBAC).
   - If the user is unauthenticated, redirects to `/login`.
   - If authenticated but `user?.role` is not contained within `allowedRoles`, redirects safely to `/` (home).

3. **`PublicRoute({ children })`**:
   - Intended for `/login` and `/register`.
   - If an authenticated user attempts to access these pages, they are redirected immediately to `/` to avoid redundant login attempts.

### 5.2 Complete Application Routes Map

| Route Path | Associated Page Component | Guard Type | Allowed Roles / Access |
|---|---|---|---|
| `/` | `LandingPage` | Public | Unrestricted (Guests, Candidates, Recruiters) |
| `/login` | `LoginPage` | `PublicRoute` | Unauthenticated users only (redirects to `/` if logged in) |
| `/register` | `RegisterPage` | `PublicRoute` | Unauthenticated users only (redirects to `/` if logged in) |
| `/jobs` | `JobsPage` | Public | Unrestricted (Public job discovery) |
| `/jobs/:jobId` | `JobDetailsPage` | Public | Unrestricted (Includes auth-aware apply box) |
| `/dashboard` | `CandidateDashboard` | `RoleRoute` | Candidates only (`allowedRoles: ["candidate"]`) |
| `/applications` | `ApplicationsPage` | `RoleRoute` | Candidates only (`allowedRoles: ["candidate"]`) |
| `/profile` | `CandidateProfilePage` | `RoleRoute` | Candidates only (`allowedRoles: ["candidate"]`) |
| `/interviews` | `InterviewsPage` | `RoleRoute` | Candidates only (`allowedRoles: ["candidate"]`) |
| `/notifications` | `NotificationsPage` | `RoleRoute` | Candidates only (`allowedRoles: ["candidate"]`) |
| `/recruiter/dashboard` | `RecruiterDashboard` | `RoleRoute` | Recruiters only (`allowedRoles: ["recruiter"]`) |
| `/recruiter/company` | `CompanyProfilePage` | `RoleRoute` | Recruiters only (`allowedRoles: ["recruiter"]`) |
| `/recruiter/jobs` | `RecruiterJobsPage` | `RoleRoute` | Recruiters only (`allowedRoles: ["recruiter"]`) |
| `/recruiter/jobs/create`| `CreateJobPage` | `RoleRoute` | Recruiters only (`allowedRoles: ["recruiter"]`) |
| `/recruiter/jobs/:jobId/applications` | `JobApplicationsPage` | `RoleRoute` | Recruiters only (`allowedRoles: ["recruiter"]`) |
| `*` | Redirection to `/` | Fallback | Unmatched route fallback |

---

# 6. Global Navigation (Navbar Component)

The top navigation header (`Frontend/frontend/src/components/Navbar.jsx`) dynamically adapts its links and actions according to the user's authentication status and platform role.

### Key Features and Implementation:
- **Aesthetic Styling**: Uses a floating pill container (`max-w-7xl rounded-full bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-xl`) with smooth borders and subtle micro-transitions.
- **Brand Identity**: Features the ClearHire monogram badge, typography, and subtitle (*"Hiring, clarified"*), linking back to the landing page.
- **Unauthenticated View**:
  - Displays links to public `Jobs`, `#how-it-works`, and `#transparency`.
  - Action buttons: "Log in" (linking to `/login`) and high-contrast "Get started" button (linking to `/register`).
- **Candidate View**:
  - Displays dedicated navigation pills for `Jobs`, `Dashboard` (`/dashboard`), `Applications` (`/applications`), `Interviews` (`/interviews`), and `Notifications` (`/notifications`).
  - Action area displays the candidate's name (`user?.name`) and a dedicated "Log out" button.
- **Recruiter View**:
  - Displays dedicated navigation pills for `Jobs`, `Dashboard` (`/recruiter/dashboard`), `My Jobs` (`/recruiter/jobs`), and `Company` (`/recruiter/company`).
  - Action area displays the recruiter's name and "Log out" button.
- **Logout Action**: Executes `logout()` from `AuthContext` to revoke the stored JWT and routes the user back to the landing page via `useNavigate`.

---

# 7. Landing Page (LandingPage Component)

The `LandingPage.jsx` component represents the public face of ClearHire. It is styled with Tailwind CSS, typography hierarchies, and subtle background gradient blurs without making unverified claims about backend functionality.

### Core Sections Implemented:
1. **Hero Section**:
   - Headline: *"Find work. Know where you stand."*
   - Clear value proposition highlighting application transparency.
   - Primary Call-to-Action (CTA): High-contrast *"Explore opportunities →"* button linking directly to `/jobs`.
   - Secondary link: *"Already have an account →"* linking to `/login` for unauthenticated visitors.
2. **Interactive Application Preview Simulation**:
   - Visual card demonstrating the core ClearHire concept: an application for *Product Engineer* at *Acme Technologies* with a status pill (*"Under review"*).
   - Shows an application lifecycle timeline: *Submitted*, *Reviewing*, *Interview*, and *Decision*.
3. **Transparency Section**:
   - Heading: *"Your application shouldn't disappear into a black box."*
   - Three feature explanation cards:
     - `01 Track applications`: Centralized organization of job submissions and statuses.
     - `02 Follow progress`: Clear visibility into stages from submission to decisions.
     - `03 Understand timing`: Clear expected response periods to identify delayed reviews.
4. **How-It-Works Workflow**:
   - Step-by-step 4-column overview:
     - `01 Discover`: Filter and locate relevant opportunities.
     - `02 Apply`: Submit applications with explicit turnaround expectations.
     - `03 Follow`: Track stage milestones and interview invites.
     - `04 Decide`: Retain complete transparent records of career outcomes.
5. **Footer & Conversion CTA**:
   - High-contrast card inviting users to join ClearHire with a *"Get started →"* button.
   - Minimalist footer with brand tagline (*"A clearer approach to the hiring journey"*).

---

# 8. Public Job Discovery and Exploration

Job discovery is delivered through two coordinated views: `JobsPage.jsx` and `JobDetailsPage.jsx`, supported by the reusable `JobCard.jsx` component.

### 8.1 Jobs Page (`JobsPage.jsx`)
- **API Integration**: Calls `getJobs()` on mount to issue `GET /jobs` to the backend.
- **State Handling**:
  - `loading`: Displays a centered loading indicator while the HTTP request is pending.
  - `error`: Displays a stylized alert banner with a "Try Again" reload button if the backend is unreachable.
  - `empty`: Displays a clean placeholder card (*"No jobs available"*) when the query returns an empty array.
  - `success`: Renders total job count and a responsive multi-column grid (`grid gap-6 md:grid-cols-2 xl:grid-cols-3`).

### 8.2 Job Card Component (`JobCard.jsx`)
- Reusable presentation component displaying:
  - Job Title and Location (with fallback to *"Location not specified"*).
  - Employment Type tag (`Full-time`, `Internship`, `Contract`).
  - Truncated Description (`line-clamp-3`).
  - Experience Level tag (`Entry`, `Mid`, `Senior`).
  - **Dynamic Salary Formatting**:
    - Both limits provided: `₹X,XXX - ₹Y,YYY`.
    - Only minimum provided: `From ₹X,XXX`.
    - Only maximum provided: `Up to ₹Y,YYY`.
    - Neither provided: `Salary not specified`.
  - Required Skills list and system Job ID (`#ID`).
  - Action link leading directly to `/jobs/:jobId`.

### 8.3 Job Details Page (`JobDetailsPage.jsx`)
- **Dynamic Route Parameter**: Uses React Router's `useParams()` hook to capture `jobId`.
- **API Integration**: Calls `getJob(jobId)` on mount (`GET /jobs/{job_id}`).
- **Layout & Details**:
  - Full job title, location, employment type badge, and 3-column metadata grid (Salary, Experience Level, Job ID).
  - Detailed job responsibilities and requirements rendered with preserved whitespace (`whitespace-pre-line`).
  - Interactive skills tags parsed from comma-separated strings (`skills.split(",")`).
  - Embedded `ApplyJobForm` component positioned in a responsive sticky sidebar.

---

# 9. Job Application Workflow and Component

Candidate applications are submitted using the `ApplyJobForm.jsx` component embedded on the job details view.

### 9.1 Authentication-Aware Application State
- If the visitor is **unauthenticated** (`!isAuthenticated`):
  - Hides the input fields.
  - Renders an informative invitation card (*"Interested in this opportunity? Sign in to your ClearHire account to apply"*).
  - Provides a direct link to `/login`.
- If the visitor is **authenticated**:
  - Renders the interactive submission form.

### 9.2 Form Implementation and Submission
- **Input Field**: `expected_response_days` (numerical input, defaulted to `7` days).
- **Submission Action**:
  - Dispatches `createApplication()` from `services/applications.js`.
  - Transmits exact JSON payload:
    ```json
    {
      "job_id": 1,
      "expected_response_days": 7
    }
    ```
- **Error Handling**: Captures FastAPI backend validation errors (e.g. duplicate applications returning `HTTP 409 Conflict`) from `err.response?.data?.detail` and renders a red alert banner.
- **Success State**: Displays a green success banner (*"Your application has been submitted successfully."*) and disables subsequent submissions.

### 9.3 End-to-End API Integration Sequence

```
Candidate User
      │
      ▼  Clicks "Apply Now" with expected_response_days = 7
JobDetailsPage.jsx -> ApplyJobForm.jsx
      │
      ▼  Invokes createApplication({ job_id, expected_response_days })
services/applications.js
      │
      ▼  Axios POST /applications (Includes Bearer JWT Header)
FastAPI Backend (app/api/routes/applications.py)
      │
      ├──> get_current_user validates JWT and loads User
      ├──> get_candidate_profile_by_user() verifies Candidate Profile exists
      ├──> get_applications_by_candidate() checks for duplicate submissions
      └──> create_application() inserts row into PostgreSQL applications table
      │
      ▼  Returns HTTP 201 Created (ApplicationResponse JSON)
Axios Client resolves Promise
      │
      ▼
ApplyJobForm sets success state & renders confirmation UI
```

---

# 10. Candidate Portal and Dashboard

The candidate experience consists of the personal dashboard, profile management page, and applications overview.

### 10.1 Candidate Dashboard (`CandidateDashboard.jsx`)
- **Parallel Data Fetching**: Utilizes `Promise.all([getJobs(), getMyApplications()])` on mount to fetch job requisitions and candidate applications concurrently.
- **Metric Calculations**: Computes real-time statistics from application records:
  - Total Applications Count (`applications.length`).
  - Active Applied Count (`status === "applied"`).
  - Shortlisted Count (`status === "shortlisted"`).
  - Scheduled Interviews Count (`status === "interview"`).
- **Recent Activity Slices**: Displays top 5 recent opportunities and top 5 recent application cards.

### 10.2 First-Time Candidate Onboarding Flow (Improved Today)
A critical UX enhancement implemented today resolved the candidate profile handling. In earlier implementations, missing candidate profiles produced abrupt backend errors on dashboard load.

- **Profile Verification Logic**: The dashboard now asynchronously queries `getCandidateProfiles()` and executes a linear lookup matching `Number(profile.user_id) === Number(user.id)`.
- **Onboarding Banner**: If no candidate profile exists (`!hasProfile`), the dashboard displays a welcoming onboarding card:
  - Tag: *"Getting started"*.
  - Heading: *"Complete your profile"*.
  - Description: *"Welcome to ClearHire! Add your skills, location and resume to prepare your profile for job applications. You can update these details whenever you need to."*
  - CTA Button: *"Complete profile →"* linking directly to `/profile`.
- This ensures new candidates understand the prerequisite of completing their profile before submitting job applications.

### 10.3 Candidate Profile Management (`CandidateProfilePage.jsx`)
- **Data Fetching & Linear Lookup**: Calls `getCandidateProfiles()` and locates the user's record using `profiles.find(item => item.user_id === user?.id)`.
- **Dynamic Form Population**: Populates state for existing profiles or leaves clean inputs for first-time creation.
- **Profile Fields Managed**:
  - `headline`: Professional summary headline (e.g., *Frontend Developer*).
  - `bio`: Extended background details.
  - `location`: City or region (e.g., *Hyderabad, India*).
  - `skills`: Comma-separated technical competencies.
  - `resume_url`: External link to hosted portfolio or PDF resume.
- **Upsert Workflow**:
  - If a profile exists: dispatches `updateCandidateProfile(profile.id, formData)` (`PUT /candidates/{profile_id}`).
  - If no profile exists: dispatches `createCandidateProfile(formData)` (`POST /candidates`).

### 10.4 Applications Overview (`ApplicationsPage.jsx`)
- **API Integration**: Queries `getMyApplications()` (`GET /applications/my-applications`).
- **Application Card Component (`ApplicationCard.jsx`)**:
  - Displays Application ID, Job ID, and localized formatted date (`toLocaleDateString("en-IN")`).
  - **Dynamic Status Styling**:
    - `applied`: Blue indicator (`bg-blue-50 text-blue-700`).
    - `under_review`: Yellow indicator (`bg-yellow-50 text-yellow-700`).
    - `shortlisted`: Green indicator (`bg-green-50 text-green-700`).
    - `interview`: Purple indicator (`bg-purple-50 text-purple-700`).
    - `rejected`: Red indicator (`bg-red-50 text-red-700`).
    - `offer`: Emerald indicator (`bg-emerald-50 text-emerald-700`).
  - Expected response turnaround timeframe (in days).

---

# 11. Recruiter Portal and Job Management

The recruiter workspace provides full control over employer profiles, job requisitions, and applicant pipelines.

### 11.1 Recruiter Dashboard (`RecruiterDashboard.jsx`)
- Concurrently queries `getMyJobs()` and `getCompanies()` via `Promise.all`.
- Identifies the recruiter's company via `companiesData.find(item => item.user_id === user?.id)`.
- Renders high-level summary cards:
  - Published Jobs Count.
  - Company Configuration Status (Company Name or *"Not configured"*).
  - Account Role Badge (*"Recruiter"*).
- Provides quick links to create jobs, view active listings, and update employer branding.

### 11.2 Company Profile Management (`CompanyProfilePage.jsx`)
- Manages organization profiles in `companies` table.
- **Fields**:
  - `name`: Official organization name.
  - `description`: Company overview.
  - `website`: Official website URL.
  - `location`: Headquarters location.
  - `industry`: Business domain (e.g. *Technology, Finance*).
- **Dynamic Create / Update**: Automatically switches between `createCompany()` (`POST /companies`) and `updateCompany()` (`PUT /companies/{company_id}`) based on existing profile detection.

### 11.3 Job Creation Workflow (`CreateJobPage.jsx`)
- Interactive form for posting vacancies to `POST /jobs`.
- **Managed Fields**: `title`, `description`, `location`, `employment_type` (default *"Full-time"*), `experience_level`, `salary_min`, `salary_max`, `skills`, and `application_deadline`.
- **Client-Side Salary Validation**: Asserts that `salary_min <= salary_max` before network dispatch. If invalid, halts submission and displays: *"Minimum salary cannot be greater than maximum salary."*
- **Date Transformation**: Converts HTML5 date inputs into standard ISO-8601 strings (`new Date(deadline + "T23:59:59").toISOString()`).
- On successful creation, navigates seamlessly to the recruiter's job list (`/recruiter/jobs`).

### 11.4 Recruiter Jobs Management (`RecruiterJobsPage.jsx`)
- Fetches recruiter's posted requisitions via `getMyJobs()` (`GET /jobs/my-jobs`).
- Displays salary range formatting, employment classification, and posting status.
- **Actions Provided**:
  - Link to public posting view (`/jobs/:jobId`).
  - Direct link to applicant pipeline (`/recruiter/jobs/:jobId/applications`).
  - Permanent Job Deletion: Triggers `window.confirm` modal followed by `deleteJob(jobId)` (`DELETE /jobs/{job_id}`). Optimistically removes the deleted job from local React state.

---

# 12. Recruiter Applicant Review and Interview Scheduling

Recruiters manage inbound candidate submissions through `JobApplicationsPage.jsx` and the embedded `ScheduleInterviewForm.jsx`.

### 12.1 Job Applications Page (`JobApplicationsPage.jsx`)
- **API Integration**: Concurrently loads the job requisition (`getJob(jobId)`) and its candidate submissions (`getJobApplications(jobId)` via `GET /applications/job/{job_id}`).
- **Status Management**:
  - Provides a status update dropdown featuring all valid backend status states:
    `applied`, `under_review`, `shortlisted`, `interview`, `rejected`, `offer`.
  - Changing the dropdown value triggers `updateApplication(applicationId, { status: newStatus })` (`PUT /applications/{application_id}`).
  - State updates reflect immediately in the UI upon successful backend response.
- **Embedded Scheduling**: Integrates `ScheduleInterviewForm` directly within each candidate application card.

### 12.2 Interview Scheduling Component (`ScheduleInterviewForm.jsx`)
- Provides recruiters with a form to book evaluation rounds with applicants.
- **Form Fields**:
  - `scheduled_at`: Native `datetime-local` input for selecting date and time.
  - `interview_type`: Dropdown with evaluation types present in the codebase:
    `Technical`, `HR`, `Managerial`, `Behavioral`, `Final`.
  - `meeting_link`: Virtual conference URL (e.g. Google Meet, Zoom).
  - `notes`: Optional candidate agenda or preparation instructions.
- **Datetime Transformation**:
  - Reads local datetime input and converts it to UTC ISO string:
    ```javascript
    scheduled_at: new Date(formData.scheduled_at).toISOString()
    ```
- **API Dispatch**: Transmits payload to `POST /interviews` via `createInterview()`.
- Resets form state upon completion and triggers parent callback `onCreated(createdInterview)`.

---

# 13. Candidate Interviews and Notifications

ClearHire provides dedicated portals for candidates to monitor upcoming interview rounds and view stage notifications.

### 13.1 Candidate Interviews Page (`InterviewsPage.jsx`)
- **Aggregation Workflow**:
  1. Calls `getMyApplications()` (`GET /applications/my-applications`) to gather all application IDs submitted by the candidate.
  2. Dispatches parallel requests using `Promise.all` across applications to call `getApplicationInterviews(application.id)` (`GET /interviews/application/{application_id}`).
  3. Aggregates results using JavaScript's `.flat()` array method.
- **Interview Presentation**:
  - Displays interview type badge (`Technical`, `HR`, etc.).
  - Shows localized formatted schedule date and time (`toLocaleString("en-IN")`).
  - Displays application and job reference IDs.
  - Renders meeting hyperlink button if `meeting_link` is populated.
  - Renders recruiter notes and instructions.

### 13.2 Real-Time Notifications Inbox (`NotificationsPage.jsx`)
- **API Integration**: Calls `getNotifications()` (`GET /notifications`) on mount.
- **Unread Badge Calculation**: Calculates active unread alerts via `notifications.filter(n => !n.is_read).length`.
- **Card Presentation**:
  - Shows notification category type (`notification.type || "Notification"`).
  - Displays notification title (`notification.title`), detailed message (`notification.message`), and timestamp (`notification.created_at`).
  - Unread items display a dark indicator dot and distinct background shading (`bg-gray-50 border-gray-300`).
- **Mark As Read Action**:
  - For unread notifications, displays a "Mark as Read" button.
  - Dispatches `markNotificationRead(notificationId)` to `PUT /notifications/{notification_id}/read`.
  - Updates the notification record in local React state upon successful backend confirmation.

---

# 14. Responsive UI and Design System

The ClearHire interface was built with a curated design system using Tailwind CSS (v4) with `@tailwindcss/vite`, adhering to modern web design standards:

1. **Color Palette**:
   - Neutral background tones (`zinc-50`, `gray-50`, `white`).
   - Deep contrast foregrounds (`zinc-950`, `gray-900`) for primary buttons and typographic hierarchy.
   - Stage indicators using subtle tint-and-text combinations (`blue-50/700`, `green-50/700`, `amber-50/800`, `purple-50/700`).
2. **Typography**:
   - Built on `Inter`, system font fallbacks, with smooth letter tracking (`tracking-[-0.04em]` on headings).
   - High typographic hierarchy scaling from `text-xs` utility captions to `text-6xl`/`text-7xl` hero display titles.
3. **Responsive Grid Layouts**:
   - Dynamic columns: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3` for job catalogues.
   - Dashboard layouts: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` for KPI statistics.
   - Split views: `lg:grid-cols-[1.6fr_0.9fr]` for balanced candidate activity columns.
4. **Responsive Navigation**:
   - Desktop: Shows full pill-shaped navigation group (`hidden md:flex`).
   - Mobile: Preserves brand identity, dynamic authentication status, and primary action buttons.
   - *Note*: An off-canvas mobile hamburger menu drawer remains pending for future refinement.

---

# 15. Python Practice – JSON Serialization

As part of today's technical practice, a Python script (`Task 25/JsonSerialization.py`) was created and executed to understand the mechanics of JSON data serialization and deserialization in backend environments.

### 15.1 Python Program Implementation

```python
import json

applications = [
    {
        "application_id": 101,
        "candidate": "K Sai Suchith",
        "job": "Frontend Developer Intern",
        "status": "Applied"
    },
    {
        "application_id": 102,
        "candidate": "Rahul",
        "job": "Python Backend Intern",
        "status": "Shortlisted"
    },
    {
        "application_id": 103,
        "candidate": "Ananya",
        "job": "Data Science Intern",
        "status": "Under Review"
    }
]

# 1. Serialize in-memory Python dictionaries to a formatted JSON string
json_data = json.dumps(applications, indent=4)
print("Serialized JSON:")
print(json_data)

# 2. Serialize and write Python data to a physical JSON file
with open("applications.json", "w") as file:
    json.dump(applications, file, indent=4)

print("\nData saved to applications.json")

# 3. Read and deserialize JSON file back into native Python objects
with open("applications.json", "r") as file:
    loaded_applications = json.load(file)

print("\nDeserialized Python Data:")
print(loaded_applications)

# 4. Iterate over deserialized data
print("\nApplication Details:")
for application in loaded_applications:
    print(f"Application ID: {application['application_id']}")
    print(f"Candidate: {application['candidate']}")
    print(f"Job: {application['job']}")
    print(f"Status: {application['status']}")
    print("-" * 30)
```

### 15.2 Core Functions Explained

| Method | Source | Destination | ClearHire Architecture Relevance |
|---|---|---|---|
| `json.dumps()` | Python Object (dict/list) | JSON Formatted `str` | Formatting payloads for API response logging or Redis caching. |
| `json.loads()` | JSON Formatted `str` | Python Object (dict/list) | Parsing inbound webhook string bodies into Python structures. |
| `json.dump()` | Python Object (dict/list) | File Pointer | Writing database backup snapshots or export records to disk. |
| `json.load()` | File Pointer | Python Object (dict/list) | Seeding database fixtures and mock application records from disk. |

### 15.3 Connection to ClearHire Full-Stack Data Pipeline

This serialization practice mirrors the HTTP communication boundary between React and FastAPI:

```
Browser JavaScript Object
           │
           ▼ (Axios JSON.stringify)
HTTP Request Body (JSON String over wire)
           │
           ▼
FastAPI Server (Pydantic model deserializes JSON into Python structures)
           │
           ▼
SQLAlchemy persists data to PostgreSQL tables
           │
           ▼
SQLAlchemy model converted to Pydantic Response Schema
           │
           ▼ (FastAPI json.dumps serialization)
HTTP Response Body (JSON String over wire)
           │
           ▼ (Axios response.json() parsing)
Browser JavaScript Object in React State
```

---

# 16. React Concepts – Rendering Lifecycle and State Transitions

Understanding the React rendering lifecycle was essential for building ClearHire's dynamic pages. The lifecycle coordinates state changes, asynchronous operations, and DOM reconciliation.

### 16.1 The React Lifecycle Stages

```
1. Mount Phase
   ├── Component initializes with default state (useState)
   ├── First Render executed -> DOM nodes committed
   └── Side Effects triggered (useEffect with dependency array)
           │
2. Asynchronous API Execution
   ├── Axios dispatches HTTP request to FastAPI backend
   └── UI displays loading skeleton / progress placeholder
           │
3. Update Phase (Re-render)
   ├── Axios Promise resolves with response data
   ├── State setter function invoked (e.g., setJobs(data))
   ├── React schedules re-render with updated state values
   └── Virtual DOM diffed -> Browser DOM updated with JobCards
           │
4. Unmount Phase
   └── Cleanup functions executed (e.g. resetting timers or abort flags)
```

### 16.2 Concrete ClearHire Implementation Example

In `JobsPage.jsx`:
1. **Initial Mount**:
   ```javascript
   const [jobs, setJobs] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   ```
   On first render, `loading` is `true`. React renders the loading placeholder:
   ```jsx
   {loading && <div>Loading available jobs...</div>}
   ```
2. **Effect Execution**:
   ```javascript
   useEffect(() => {
     const loadJobs = async () => {
       try {
         setLoading(true);
         const data = await getJobs();
         setJobs(data);
       } catch (err) {
         setError(err.response?.data?.detail || "Unable to load jobs.");
       } finally {
         setLoading(false);
       }
     };
     loadJobs();
   }, []);
   ```
   The empty dependency array `[]` ensures `loadJobs()` executes once when the component mounts.
3. **State Transition & Re-render**:
   When `setJobs(data)` and `setLoading(false)` are executed, React detects state mutations and triggers a re-render. The condition `!loading && !error && jobs.length > 0` becomes active, replacing the loader with the rendered `JobCard` elements.
4. **Race Condition Prevention**:
   In `CandidateDashboard.jsx`, an `active` boolean flag pattern is employed in `useEffect` cleanup to prevent setting state on an unmounted component if the user navigates away before the network request resolves:
   ```javascript
   useEffect(() => {
     let active = true;
     checkCandidateProfile().then(() => {
       if (!active) return;
       // safely update state
     });
     return () => { active = false; };
   }, [user?.id]);
   ```

---

# 17. Problem Solving / DSA – Search Algorithm Basics

Today's frontend development applied fundamental searching algorithms to match in-memory data records retrieved from REST APIs.

### 17.1 Linear Search in ClearHire

In several portal workflows, the frontend receives a collection of entities and must locate a specific record matching the authenticated user. Examples from today's code:

1. **Candidate Profile Lookup (`CandidateProfilePage.jsx`)**:
   ```javascript
   const currentProfile = profiles.find(
     (item) => item.user_id === user?.id
   );
   ```
2. **Company Profile Matching (`RecruiterDashboard.jsx`)**:
   ```javascript
   const currentCompany = companiesData.find(
     (item) => item.user_id === user?.id
   );
   ```
3. **Profile Existence Check (`CandidateDashboard.jsx`)**:
   ```javascript
   const profileExists = profiles.some(
     (profile) => Number(profile.user_id) === Number(user.id)
   );
   ```

### 17.2 Algorithmic Analysis of Linear Search

JavaScript's `Array.prototype.find()` and `Array.prototype.some()` execute an internal **Linear Search**:

```
Input: Array of N records [R_0, R_1, R_2, ..., R_{N-1}], Target: user_id

Step 1: Set index i = 0
Step 2: If i >= N, return undefined (Record Not Found)
Step 3: Compare R_i.user_id == target
Step 4: If match, return R_i (Found)
Step 5: Increment i = i + 1, go to Step 2
```

- **Time Complexity**:
  - **Best Case**: $O(1)$ — Target is the very first element in the array.
  - **Worst Case**: $O(n)$ — Target is at the final index or absent from the array, requiring all $n$ comparisons.
  - **Average Case**: $O(n)$ — Target is located midway through the collection.
- **Space Complexity**:
  - $O(1)$ auxiliary space — Iteration requires only an internal index pointer.

### 17.3 Algorithmic Trade-Offs

- **Suitability for ClearHire Client**: For modest dataset sizes returned per page (typically $n \le 100$ records), linear search is optimal due to zero preprocessing overhead and cache locality.
- **Alternative Approaches for Large Datasets**: If collections scale to tens of thousands of client-side records, data should either be indexed in an $O(1)$ hash map lookup structure (`Map<user_id, Profile>`) or binary search $O(\log n)$ on presorted identifiers.

---

# 18. Testing and Verification

Verification for Task 25 focused on client-side compilation, routing integrity, and manual end-to-end user flows.

### Completed Verifications:
- **Build and Compilation**: Verified Vite compiles JSX, Tailwind CSS utility directives, and React dependencies without syntax or bundle errors.
- **Route Authorization Verification**:
  - Unauthenticated access to `/dashboard`, `/applications`, `/profile`, `/recruiter/dashboard` was confirmed to redirect to `/login`.
  - Authenticated candidates attempting to access `/recruiter/*` were confirmed to redirect safely to `/`.
  - Authenticated users accessing `/login` or `/register` were confirmed to redirect to `/`.
- **Axios Token Interception**: Confirmed outgoing HTTP requests attach `Authorization: Bearer <token>` when an active session exists in `localStorage`.
- **Onboarding Flow Verification**: Verified that candidates without a profile record receive the *"Complete your profile"* onboarding banner on `/dashboard` rather than a crash or unhandled error.
- **Form Validations**: Tested salary boundary validation (`salary_min <= salary_max`) in `CreateJobPage`, confirming that invalid bounds halt submission.
- **State Feedback**: Confirmed loading spinners, empty states, and backend error detail messages display properly across all views.

### Pending Testing:
- Comprehensive automated end-to-end test suites (Cypress/Playwright) remain pending.
- Component unit test coverage (React Testing Library / Vitest) is pending.
- Formal Postman API test collection execution remains pending for the next phase.

---

# 19. Technologies Used

The following technologies were directly utilized in today's implementation:

- **React 19**: Modern UI library using functional components, hooks, and context.
- **JavaScript (ES6+)**: Core programming language for frontend logic and asynchronous workflows.
- **Vite 8**: Modern, high-speed frontend build tool and local development server.
- **Tailwind CSS 4 (`@tailwindcss/vite`)**: Utility-first CSS styling framework.
- **Axios**: Promise-based HTTP client for browser API requests and interceptors.
- **React Router 7 (`react-router-dom`)**: Declarative client-side routing and authorization guards.
- **Python**: Execution of JSON serialization practice script.
- **FastAPI**: Backend REST API framework serving job, candidate, company, and application endpoints.
- **SQLAlchemy ORM**: Relational database ORM interfacing with PostgreSQL.
- **PostgreSQL**: Relational database storing ClearHire records.
- **Pydantic v2**: Request payload validation and response serialization schemas.
- **Git & GitHub**: Version control tracking project files.

---

# 20. Task Status

| Work Item | Category | Status |
|---|---|---|
| Central Axios client & interceptor (`services/api.js`) | API Integration | Completed |
| Modular API service modules (`services/*.js`) | API Integration | Completed |
| Authentication Context & token persistence (`AuthContext`) | Authentication | Completed |
| Client-side routing & route guards (`AppRoutes`) | Routing | Completed |
| Dynamic, role-aware Navbar component (`Navbar.jsx`) | Component UI | Completed |
| Landing page with application preview (`LandingPage.jsx`) | Page UI | Completed |
| Public job catalog with status states (`JobsPage.jsx`) | Page UI | Completed |
| Reusable job summary card (`JobCard.jsx`) | Component UI | Completed |
| Job details page with dynamic route (`JobDetailsPage.jsx`) | Page UI | Completed |
| Job application submission form (`ApplyJobForm.jsx`) | Component UI | Completed |
| Candidate dashboard with statistics (`CandidateDashboard.jsx`)| Page UI | Completed |
| First-time candidate profile onboarding banner | UX / Workflow | Completed |
| Candidate profile create/update page (`CandidateProfilePage.jsx`)| Page UI | Completed |
| Candidate applications history page (`ApplicationsPage.jsx`) | Page UI | Completed |
| Reusable application status card (`ApplicationCard.jsx`) | Component UI | Completed |
| Recruiter dashboard with company overview (`RecruiterDashboard.jsx`)| Page UI | Completed |
| Company profile create/update page (`CompanyProfilePage.jsx`)| Page UI | Completed |
| Job requisition creation page (`CreateJobPage.jsx`) | Page UI | Completed |
| Recruiter job management & deletion (`RecruiterJobsPage.jsx`) | Page UI | Completed |
| Recruiter application management (`JobApplicationsPage.jsx`) | Page UI | Completed |
| Interview scheduling form component (`ScheduleInterviewForm.jsx`)| Component UI | Completed |
| Candidate interviews schedule page (`InterviewsPage.jsx`) | Page UI | Completed |
| Real-time notifications inbox page (`NotificationsPage.jsx`) | Page UI | Completed |
| Python JSON serialization practice program (`JsonSerialization.py`)| Programming Practice | Completed |
| Mobile off-canvas hamburger navigation menu drawer | Component UI | Pending |
| Automated frontend unit & integration testing suite | Testing | Pending |
| Postman API collection verification | Testing | Pending |
| Remote repository GitHub push for Task 25 | Version Control | Pending |

---

# 21. Learning Outcomes

Today's implementation provided practical, hands-on experience in:

1. **Centralized HTTP Client Architecture**: Mastering Axios instances, base URL abstraction, and request interceptors to automatically transmit Bearer JWT authorization tokens without polluting component logic.
2. **Context-Driven Authentication Lifecycle**: Structuring global authentication providers using React Context to manage tokens in `localStorage`, bootstrap sessions via `/auth/me`, and avoid state flickering with `loading` guards.
3. **Declarative Route Guarding in React Router**: Building composable route wrappers (`PublicRoute`, `ProtectedRoute`, `RoleRoute`) to isolate public, candidate-only, and recruiter-only views.
4. **Resilient UI State Management**: Designing predictable user experiences by explicitly handling `loading`, `error`, `empty`, and `success` states across every data-driven page.
5. **Component Reusability and Modularity**: Creating decoupled, specialized components (`JobCard`, `ApplicationCard`, `ApplyJobForm`, `ScheduleInterviewForm`) that encapsulate discrete UI responsibilities.
6. **Graceful User Onboarding UX**: Enhancing the candidate dashboard by gracefully detecting missing candidate profiles and rendering an onboarding banner rather than triggering backend errors.
7. **Client-Side Form Validation**: Implementing defensive form validation (such as ensuring minimum salary does not exceed maximum salary) and normalizing ISO-8601 datetimes before API dispatch.
8. **Python JSON Serialization Mastery**: Deepening understanding of `json.dumps()`, `json.loads()`, `json.dump()`, and `json.load()` and mapping their roles to the end-to-end client-server serialization pipeline.
9. **React Rendering Lifecycle**: Tracing component mount sequences, side-effect triggers via `useEffect`, reconciliation re-renders, and cleanup mechanisms.
10. **Practical Application of Search Algorithms**: Analyzing the algorithmic trade-offs, step-by-step mechanics, and $O(n)$ time complexity of Linear Search in JavaScript array lookups.

---

# 22. Challenges

Key challenges encountered and addressed during today's implementation:

1. **Managing Authentication Race Conditions on Page Refresh**: When a user refreshed an authenticated page, routes initially rendered before `/auth/me` could finish validating the token in `localStorage`, leading to premature redirects to `/login`. This was solved by introducing a `loading` state in `AuthContext` that pauses route guard redirection until the initial user profile check resolves.
2. **Graceful First-Time Candidate Profile Onboarding**: Initially, opening the candidate dashboard without an existing profile record caused queries to fail, presenting an intimidating error to newly registered candidates. This was redesigned into a welcoming onboarding flow that detects missing profiles via `getCandidateProfiles()` and displays a helpful *"Complete your profile"* card linking directly to `/profile`.
3. **Cross-Timezone Datetime Normalization for Interviews**: Inputting interview times via HTML5 `<input type="datetime-local">` yields local browser timestamps. To ensure consistent backend storage in PostgreSQL timezone-aware columns, the value was transformed via `new Date(formData.scheduled_at).toISOString()` before API submission.
4. **Coordinating Multi-Resource Data Aggregation**: The candidate `InterviewsPage` required aggregating scheduled rounds across multiple individual applications. This was resolved using `Promise.all` over `getMyApplications()`, querying `getApplicationInterviews()` for each application ID, and flattening the combined array using `.flat()`.
5. **Decoupling Network Logic from Visual Components**: Preventing API fetch duplication across components was resolved by introducing a dedicated `services/` layer that encapsulates endpoints into clean, reusable asynchronous functions.
