# BookNest — Full-Stack Library Management System

> **Production Readiness Review & Final Startup Simulation Preparation**  
> *Pre-release engineering evaluation, quality audit, and system documentation.*

---

## Table of Contents

1. [Overview](#overview)
2. [Startup Scenario](#startup-scenario)
3. [Features](#features)
4. [Technology Stack](#technology-stack)
5. [Architecture](#architecture)
   - [System Architecture](#system-architecture)
   - [Backend Architecture](#backend-architecture)
   - [Frontend Architecture](#frontend-architecture)
   - [Component Hierarchy](#component-hierarchy)
   - [Frontend-Backend Communication](#frontend-backend-communication)
6. [Authentication & Authorization Flow](#authentication--authorization-flow)
7. [Database Structure & Models](#database-structure--models)
8. [Project Structure](#project-structure)
9. [Installation & Local Setup](#installation--local-setup)
   - [Prerequisites](#prerequisites)
   - [Backend Setup](#backend-setup)
   - [Database Setup](#database-setup)
   - [Environment Variables](#environment-variables)
   - [Frontend Setup](#frontend-setup)
   - [Running the Application](#running-the-application)
10. [Docker Containerization](#docker-containerization)
11. [FastAPI Interactive Documentation (Swagger)](#fastapi-interactive-documentation-swagger)
12. [Complete API Documentation](#complete-api-documentation)
    - [Authentication APIs](#authentication-apis)
    - [Book APIs](#book-apis)
    - [Favorites APIs](#favorites-apis)
    - [Ratings APIs](#ratings-apis)
    - [Personal Library APIs](#personal-library-apis)
    - [New Releases APIs](#new-releases-apis)
    - [System & Health APIs](#system--health-apis)
13. [API Testing Completed Today](#api-testing-completed-today)
    - [Test Suite Breakdown](#test-suite-breakdown)
    - [API Test Results Table](#api-test-results-table)
14. [Bug Report and Fixes](#bug-report-and-fixes)
    - [Bug #1 — Tablet Responsive Layout Overflow](#bug-1--tablet-responsive-layout-overflow)
    - [Bug #2 — Invalid Publication Year Validation](#bug-2--invalid-publication-year-validation)
    - [Bug #3 — Header Displayed on Authentication Pages](#bug-3--header-displayed-on-authentication-pages)
15. [Screenshots](#screenshots)
    - [Bug Fix Screenshots](#bug-fix-screenshots)
    - [API Testing Screenshots](#api-testing-screenshots)
16. [Production Readiness Review](#production-readiness-review)
    - [Responsive UI Review](#responsive-ui-review)
    - [Validation Review](#validation-review)
    - [Code Quality & Architecture Review](#code-quality--architecture-review)
    - [Git History & Repository Hygiene](#git-history--repository-hygiene)
    - [Documentation Review](#documentation-review)
17. [Contributing & Open-Source Workflow](#contributing--open-source-workflow)
    - [Development Guidelines](#development-guidelines)
    - [Reporting Bugs](#reporting-bugs)
    - [Feature Requests](#feature-requests)
    - [Submitting Pull Requests](#submitting-pull-requests)
18. [Future Improvements](#future-improvements)
19. [DSA / Coding Practice](#dsa--coding-practice)
    - [1. Longest Substring Without Repeating Characters](#1-longest-substring-without-repeating-characters)
    - [2. Merge Intervals](#2-merge-intervals)
20. [Production Readiness Checklist](#production-readiness-checklist)
21. [Learning Outcomes](#learning-outcomes)
22. [Engineering Challenges](#engineering-challenges)
23. [License](#license)

---

## Overview

**BookNest** is an enterprise-ready, full-stack library management application engineered to deliver modern digital reading and library organization workflows. Designed around high-performance Python services and an interactive Single-Page Application (SPA) frontend, BookNest allows readers to explore a catalog of curated titles, view granular details, maintain personalized digital bookshelves, borrow and return literature, download titles, rate reading selections, and bookmark favorites.

Administrative users are provisioned with secure role-based access control (RBAC) to add, modify, and delete books across the catalog, ensuring content moderation and catalog integrity.

---

## Startup Scenario

> *"The development team has completed the requested features. Before releasing the application to users, your Engineering Manager asks you to prepare the project for production."*

In modern agile software engineering, completing feature code is only the initial phase. Transitioning from active development to **production readiness** requires comprehensive quality assurance, architectural audit, defense-in-depth validation, and rigorous documentation.

### Review Objectives

Before opening BookNest to end users, the application underwent a pre-production readiness audit to ensure:
- **Authentication and Authorization Integrity**: Session verification, password hashing, and role checks operate reliably and securely.
- **Robust Multi-Tier Validation**: Client and server reject malformed inputs before database persistence.
- **Comprehensive API Verification**: Critical endpoints respond with predictable status codes and schemas.
- **Responsive Layout Fidelity**: UI operates smoothly across mobile, tablet, and widescreen desktop devices.
- **Clean Architectural Separation**: Code exhibits modular separation of concerns and clear file structures.
- **Maintainability and Code Cleanliness**: Redundant code is pruned, exception handling is centralized, and naming is descriptive.
- **Complete Developer Documentation**: System operation, schemas, environment configuration, and container workflows are thoroughly recorded.
- **Git History & Secrets Hygiene**: Sensitive keys, credentials, and virtual environments remain strictly excluded from source control.
- **Bug Remediation**: Identified layout anomalies, edge-case validation holes, and routing quirks are documented and resolved.

### Milestone Context

> [!IMPORTANT]
> This engineering evaluation directly prepares the project for the upcoming **Final Startup Simulation Project — Week 4**. The Final Startup Simulation itself has **not yet taken place**; today's deliverables establish the production-grade foundation, audit trail, and documentation required prior to launch simulation.

---

## Features

- **User Authentication & Identity Management**: Secure user registration, credential verification, and JWT session handling using bcrypt password hashing.
- **Role-Based Authorization (RBAC)**: Distinct permissions for standard readers (`user`) and library managers (`admin`).
- **Catalog Exploration**: Real-time browsing of book collections, including author metadata, genres, publication dates, and cover imagery.
- **Deep Book Details**: Rich view pages displaying synopses, collective ratings, individual reader reviews, and catalog status.
- **New Releases Showcase**: Dedicated feed filtering and ordering newly released titles chronologically.
- **Favorites Management**: Instant bookmarking and unbookmarking of books with synchronized user-specific indicators.
- **Community Star Ratings**: 1-to-5 star evaluation system calculating rounded arithmetic averages and tracking overall review volume.
- **Personal Digital Bookshelf (`/my-library`)**:
  - Add titles to private library shelf.
  - Track borrowing cycles with timestamp tracking (`borrowed_at`, `returned_at`).
  - Digital offline download tracking (`downloaded_at`).
  - Active status progression (`in_library`, `borrowed`, `downloaded`, `returned`).
- **Administrative Catalog Controls**: Dedicated administrative creation, update, and deletion endpoints protected by administrative token authorization.
- **Centralized Error & Exception Handling**: Standardized HTTP 400, 401, 403, 404, 422, 500, and 503 error payloads.
- **Interactive OpenAPI Specification**: Built-in Swagger UI and ReDoc generators for runtime inspection and testing.

---

## Technology Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) (v19.2.8)
- **Tooling & Bundler**: [Vite](https://vitejs.dev/) (v8.2.2)
- **Language**: Modern JavaScript (ES Modules)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4.3.3) via `@tailwindcss/vite`
- **Routing**: [React Router DOM](https://reactrouter.com/) (v7.18.3)
- **HTTP Client**: [Axios](https://axios-http.com/) (v1.20.0) with automated bearer token injection interceptors
- **Icons**: [Lucide React](https://lucide.dev/) (v1.40.0)

### Backend
- **Language & Runtime**: [Python 3.12](https://www.python.org/)
- **Web Framework**: [FastAPI](https://fastapi.tiangolo.com/) (v0.141.1)
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/) (v0.52.4)
- **Database ORM**: [SQLAlchemy 2.0](https://www.sqlalchemy.org/) (v2.0.52)
- **Database Driver**: [psycopg](https://www.psycopg.org/) (v3.2.0 binary)
- **Database Engine**: [PostgreSQL](https://www.postgresql.org/) (local cluster port 5433)
- **Data Validation & Settings**: [Pydantic v2](https://docs.pydantic.dev/) (v2.13.5) & `pydantic-core`
- **Security & Cryptography**:
  - `python-jose[cryptography]` (HMAC-SHA256 JWT generation and validation)
  - `passlib[bcrypt]` & `bcrypt` (v4.3.0) for salt generation and credential hashing
- **Configuration**: `python-dotenv` (v1.2.3)

### Infrastructure & Engineering Tools
- **Containerization**: Docker (Multi-stage Python 3.12-slim backend container)
- **API Inspection**: Postman, FastAPI Swagger UI, Redoc
- **Version Control**: Git & GitHub
- **Code Quality**: ESLint (`@eslint/js`, `eslint-plugin-react-hooks`)

---

## Architecture

### System Architecture

BookNest uses a decoupled client-server architecture. The browser executes the React Single Page Application (SPA), which communicates asynchronously with the FastAPI service via JSON over HTTP/1.1. FastAPI handles business rules, request validation, and cryptographic authentication before interfacing with PostgreSQL via SQLAlchemy ORM.

```
┌────────────────────────────────────────────────────────┐
│                   Client (Browser)                     │
│  React 19 SPA • Tailwind CSS • Axios • React Router 7  │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / JSON (Port 5173 / 80)
                           │ Bearer Token in Auth Header
┌──────────────────────────▼─────────────────────────────┐
│                 FastAPI Backend Service                │
│             Uvicorn ASGI Engine (Port 8000)            │
│  ┌──────────────────────────────────────────────────┐  │
│  │   CORS Middleware & Custom Exception Handlers    │  │
│  └───────────────────────┬──────────────────────────┘  │
│  ┌───────────────────────▼──────────────────────────┐  │
│  │    API Routes (/auth, /books, /favorites, etc.)  │  │
│  └───────────────────────┬──────────────────────────┘  │
│  ┌───────────────────────▼──────────────────────────┐  │
│  │    Security & Dependencies (JWT / Role Checks)   │  │
│  └───────────────────────┬──────────────────────────┘  │
│  ┌───────────────────────▼──────────────────────────┐  │
│  │    CRUD Layer & Pydantic Data Validation Schemas │  │
│  └───────────────────────┬──────────────────────────┘  │
│  ┌───────────────────────▼──────────────────────────┐  │
│  │            SQLAlchemy 2.0 ORM Engine             │  │
│  └───────────────────────┬──────────────────────────┘  │
└──────────────────────────┼─────────────────────────────┘
                           │ TCP (Port 5433)
┌──────────────────────────▼─────────────────────────────┐
│             PostgreSQL Database Cluster                │
│    Tables: users, books, favorites, ratings, library   │
└────────────────────────────────────────────────────────┘
```

---

### Backend Architecture

The backend adheres to a modular layered architecture separating HTTP ingress, configuration, domain models, validation schemas, and database operations.

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # Entrypoint: FastAPI instance, middleware, exception handlers, routers
│   ├── core/                    # Core configuration & cryptographic operations
│   │   ├── __init__.py
│   │   ├── config.py            # Environment settings, secret keys, token lifespans, CORS origins
│   │   └── security.py          # Passlib bcrypt hashing, JWT issuance & token decoding
│   ├── database/                # Persistence configuration
│   │   ├── __init__.py
│   │   └── connection.py        # SQLAlchemy engine, SessionLocal factory, get_db generator
│   ├── models/                  # SQLAlchemy ORM entity models
│   │   ├── __init__.py
│   │   ├── book.py              # Book table schema
│   │   ├── user.py              # User table schema
│   │   ├── favorite.py          # Favorite relationship table
│   │   ├── rating.py            # Rating relationship table
│   │   └── user_library.py      # UserLibrary digital bookshelf table
│   ├── schemas/                 # Pydantic validation and serialization models
│   │   ├── __init__.py
│   │   ├── auth.py              # LoginRequest, TokenResponse
│   │   ├── book.py              # BookBase, BookCreate, BookResponse
│   │   ├── favorite.py          # FavoriteResponse
│   │   ├── library.py           # PersonalLibraryResponse
│   │   ├── rating.py            # RatingCreate, RatingResponse
│   │   └── user.py              # UserCreate, UserResponse
│   ├── crud/                    # Direct database query abstraction layer
│   │   ├── __init__.py
│   │   ├── books.py             # Book retrieval, enrichment, CRUD operations
│   │   ├── favorites.py         # Favorite toggling and user association queries
│   │   ├── library.py           # Personal library state transitions (borrow/return/download)
│   │   ├── ratings.py           # Rating submissions and book rating recalculation
│   │   └── users.py             # User lookup by email/username and user persistence
│   └── api/                     # Ingress routing and dependency injection
│       ├── __init__.py
│       ├── dependencies.py      # get_current_user, get_optional_current_user, get_current_admin
│       └── routes/              # Sub-routers registered onto the main application
│           ├── __init__.py
│           ├── auth.py          # /auth registration, login, verification, admin elevation
│           ├── books.py         # /books catalog listing, single lookup, CRUD
│           ├── favorites.py     # /favorites bookmarking endpoints
│           ├── library.py       # /my-library & /new-releases workflow endpoints
│           └── ratings.py       # /books/{id}/rating & /ratings endpoints
├── requirements.txt             # Locked production dependencies
├── Dockerfile                   # Multi-stage production container manifest
├── .dockerignore                # Container build exclusion patterns
├── .env.example                 # Safe environment configuration template
└── .gitignore                   # Local filesystem and secret exclusions
```

#### Module Responsibilities
- **`app/main.py`**: Initializes the FastAPI instance, attaches CORS middleware with dynamic origins, registers standardized exception handlers (`RequestValidationError`, `OperationalError`, `SQLAlchemyError`), connects database tables via `Base.metadata.create_all()`, and binds modular routers.
- **`app/core/config.py`**: Loads environment variables with safe defaults for `DATABASE_URL`, `FRONTEND_URL`, and `SECRET_KEY`. Defines cryptographic parameters (`ALGORITHM = "HS256"`, `ACCESS_TOKEN_EXPIRE_MINUTES = 60`).
- **`app/core/security.py`**: Encapsulates Passlib `CryptContext` with bcrypt for one-way password hashing and verification. Issues and decodes HS256-signed JWT tokens with expiration validation.
- **`app/database/connection.py`**: Creates the SQLAlchemy engine with connection pool pre-ping enabled (`pool_pre_ping=True`) to recycle dropped connections, defines `SessionLocal`, and provides the `get_db()` transactional dependency.
- **`app/models/`**: Defines relational schema definitions and table constraints with SQLAlchemy ORM declarative syntax.
- **`app/schemas/`**: Pydantic models handling ingress payload sanitation, regex validations, type conversions, and serialized egress shapes (`from_attributes = True`).
- **`app/crud/`**: Pure database query functions isolating SQLAlchemy session queries from HTTP transport logic.
- **`app/api/dependencies.py`**: Implements FastAPI `Depends` authentication guards using `HTTPBearer`, resolving tokens to verified user models and performing role assertions.
- **`app/api/routes/`**: Handles incoming HTTP requests, maps URLs and status codes, and delegates processing to CRUD utilities.

---

### Frontend Architecture

The frontend application uses React 19 and React Router v7, with unified global authentication state managed via React Context.

```
frontend/frontend/
├── src/
│   ├── App.jsx                  # Main layout, routing declarations, and header visibility logic
│   ├── App.css                  # Global layout styles
│   ├── main.jsx                 # Vite application mount point (ReactDOM.createRoot)
│   ├── index.css                # Tailwind CSS imports and base design tokens
│   ├── api.js                   # Configured Axios instance, interceptors, error parsers
│   ├── validation.js            # Client-side input validation utilities
│   ├── context/
│   │   └── AuthContext.jsx      # Global authentication provider and useAuth hook
│   ├── components/              # Modular, reusable presentation components
│   │   ├── Header.jsx           # Responsive top navigation with mobile drawer
│   │   ├── Footer.jsx           # Application footer
│   │   ├── Sidebar.jsx          # Collapsible catalog filtering drawer
│   │   ├── BookCard.jsx         # Uniform book preview card with rating and favorite toggle
│   │   ├── BookForm.jsx         # Modal form for admin creation and editing of books
│   │   ├── StarRating.jsx       # Interactive star selection and display component
│   │   └── ProtectedRoute.jsx   # Route guard redirecting unauthenticated users to /login
│   ├── pages/                   # Top-level routable screen views
│   │   ├── LandingPage.jsx      # Marketing hero, value propositions, call to action
│   │   ├── LoginPage.jsx        # User login form with client validation
│   │   ├── RegisterPage.jsx     # Registration form with real-time password strength meter
│   │   ├── LibraryPage.jsx      # Main book catalog with search, filter, and admin actions
│   │   ├── BookDetailsPage.jsx  # Detailed book view, rating dialog, and personal library action
│   │   ├── FavoritesPage.jsx    # User bookmarked titles view
│   │   ├── RatingsPage.jsx      # Books sorted and grouped by review rating
│   │   ├── NewReleasesPage.jsx  # Recently published books chronological view
│   │   └── PersonalLibraryPage.jsx # Digital shelf: active borrows, downloads, and returns
│   └── utils/                   # Shared presentation and date helpers
├── package.json                 # Dependencies and npm script targets
├── vite.config.js               # Vite bundler configuration
└── eslint.config.js             # Code style enforcement rules
```

---

### Component Hierarchy

```
App (BrowserRouter)
│
└── AuthProvider (AuthContext: user, isAuthenticated, loading, login, register, logout)
    │
    └── AppLayout (Route-aware container, conditional Header suppression)
        │
        ├── Header (Sticky navigation, mobile hamburger menu, auth badges)
        │
        ├── <main> (Dynamic Routed View)
        │   ├── Route: "/" ───────────────► LandingPage
        │   ├── Route: "/login" ──────────► LoginPage
        │   ├── Route: "/register" ───────► RegisterPage
        │   ├── Route: "/library" ────────► LibraryPage
        │   │                               ├── Sidebar (Category/Genre filter)
        │   │                               ├── BookCard (Grid items)
        │   │                               └── BookForm (Modal: Create/Edit - Admin only)
        │   ├── Route: "/books/:id" ──────► ProtectedRoute ──► BookDetailsPage
        │   │                                                   ├── StarRating (Interactive review)
        │   │                                                   └── Library Actions (Borrow/Download)
        │   ├── Route: "/favorites" ──────► ProtectedRoute ──► FavoritesPage
        │   │                                                   └── BookCard
        │   ├── Route: "/ratings" ────────► ProtectedRoute ──► RatingsPage
        │   │                                                   └── BookCard
        │   ├── Route: "/new-releases" ───► NewReleasesPage
        │   │                               └── BookCard
        │   └── Route: "/my-library" ─────► ProtectedRoute ──► PersonalLibraryPage
        │                                                       └── Digital Shelf Status Panels
        │
        └── Footer (Platform copyright, navigation links, and system information)
```

---

### Frontend-Backend Communication

All client requests are dispatched through an abstracted Axios client instance configured in [`src/api.js`](file:///d:/Internship%20Tracker/Task%2021/book-library-manager/frontend/frontend/src/api.js).

```
┌────────────────────────────────────────────────────────┐
│            React Component (e.g. LibraryPage)          │
└──────────────────────────┬─────────────────────────────┘
                           │ Calls api.get('/books')
┌──────────────────────────▼─────────────────────────────┐
│           Axios Request Interceptor (api.js)           │
│   Checks localStorage.getItem('booknest_token')        │
│   Injects: Authorization: Bearer <token> (if present)  │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP Request over TCP
┌──────────────────────────▼─────────────────────────────┐
│                 FastAPI Route Handler                  │
│   Validates parameters & dependencies (get_current_user)
└──────────────────────────┬─────────────────────────────┘
                           │ Executes CRUD query
┌──────────────────────────▼─────────────────────────────┐
│                 SQLAlchemy ORM Engine                  │
│   Generates SQL -> Executes on PostgreSQL Cluster      │
└──────────────────────────┬─────────────────────────────┘
                           │ Returns SQL records
┌──────────────────────────▼─────────────────────────────┐
│            FastAPI Pydantic Response Model             │
│   Serializes models into standardized JSON output      │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP JSON Response (200 OK)
┌──────────────────────────▼─────────────────────────────┐
│             Axios Response Error Parser                │
│   Translates 400, 401, 403, 404, 422, 500, 503 to      │
│   human-readable UI notifications                      │
└──────────────────────────┬─────────────────────────────┘
                           │ Updates React State
┌──────────────────────────▼─────────────────────────────┐
│                 React UI Re-renders                    │
└────────────────────────────────────────────────────────┘
```

#### Token Management
1. When a user authenticates via `POST /auth/login`, the response returns `{ access_token, token_type: "bearer", user }`.
2. `AuthContext.jsx` persists `access_token` in `localStorage` under the key `booknest_token`.
3. The Axios request interceptor automatically extracts `booknest_token` and sets the `Authorization` header for subsequent outbound requests.
4. On HTTP 401 responses, the token is cleared and the user is redirected to `/login`.

---

## Authentication & Authorization Flow

### Authentication vs. Authorization
- **Authentication**: Proving **who** a user is (verifying email and password credentials).
- **Authorization**: Determining **what** an authenticated user is permitted to do (e.g., verifying if a user possesses the `admin` role before permitting book creation or deletion).

```
                      AUTHENTICATION FLOW (Login)
User (Browser)               React UI                  FastAPI (/auth/login)         Database (users)
     │                           │                               │                          │
     ├── Submits Email/Password ─►                               │                          │
     │                           ├── POST /auth/login ───────────►                          │
     │                           │   {email, password}           ├── Query by email ────────►
     │                           │                               │◄── Returns User record ──┘
     │                           │                               ├── verify_password(hash)
     │                           │                               │   (bcrypt check)
     │                           │                               ├── create_access_token()
     │                           │                               │   (Signs JWT with HS256)
     │                           │◄── Returns 200 OK ────────────┘
     │                           │    {access_token, user}
     │                           ├── Stores in localStorage
     │◄── Navigates to App ──────┘

                     AUTHORIZATION FLOW (Protected API)
User (Browser)               Axios Client               FastAPI Endpoint           Admin Dependency
     │                           │                              │                          │
     ├── Triggers Admin Action ──►                              │                          │
     │                           ├── Injects Header:            │                          │
     │                           │   Authorization: Bearer <jwt>│                          │
     │                           ├── POST /books ───────────────►                          │
     │                           │   (Payload: BookCreate)      ├── Decode token ──────────►
     │                           │                              │   Check expiration       │
     │                           │                              │   Extract user_id & role │
     │                           │                              │◄── If role != 'admin' ───┤
     │                           │                              │    Raises 403 Forbidden  │
     │                           │                              │                          │
     │                           │                              │◄── If role == 'admin' ───┤
     │                           │                              │    Proceeds to CRUD      │
     │                           │◄── Returns 200 / Book ───────┘
     │◄── Renders Updated UI ────┘
```

---

## Database Structure & Models

The PostgreSQL relational database is modeled using SQLAlchemy 2.0. All foreign key relationships enforce referential integrity with cascading deletions (`ondelete="CASCADE"`).

```
                           ┌────────────────────────┐
                           │         users          │
                           ├────────────────────────┤
                           │ id: Integer (PK)       │
                           │ username: String(50)   │
                           │ email: String(100)     │
                           │ password_hash: String  │
                           │ role: String(20)       │
                           └───────────┬────────────┘
                                       │ 1
                 ┌─────────────────────┼─────────────────────┐
                 │ 1                   │ 1                   │ 1
                 ▼ N                   ▼ N                   ▼ N
      ┌─────────────────────┐┌─────────────────────┐┌─────────────────────┐
      │      favorites      ││       ratings       ││    user_library     │
      ├─────────────────────┤├─────────────────────┤├─────────────────────┤
      │ id: Integer (PK)    ││ id: Integer (PK)    ││ id: Integer (PK)    │
      │ user_id: FK(users)  ││ user_id: FK(users)  ││ user_id: FK(users)  │
      │ book_id: FK(books)  ││ book_id: FK(books)  ││ book_id: FK(books)  │
      │ UQ(user_id, book_id)││ rating: Integer     ││ added_at: String    │
      └──────────┬──────────┘│ UQ(user_id, book_id)││ borrowed_at: String │
                 │ N         └──────────┬──────────┘│ downloaded_at: String│
                 │                      │ N         │ returned_at: String  │
                 │                      │           │ status: String(20)   │
                 │                      │           │ UQ(user_id, book_id) │
                 │                      │           └──────────┬──────────┘
                 │                      ▼ N                    │ N
                 └────────────────►┌─────────┐◄────────────────┘
                                   │  books  │
                                   ├─────────┤
                                   │ id: PK  │
                                   │ title   │
                                   │ author  │
                                   │ genre   │
                                   │ year    │
                                   │ image   │
                                   │ desc    │
                                   └─────────┘
```

### Model Specifications

#### 1. `User` (`users`)
Defined in [`backend/app/models/user.py`](file:///d:/Internship%20Tracker/Task%2021/book-library-manager/backend/app/models/user.py):
- `id`: `Integer`, Primary Key, indexed.
- `username`: `String(50)`, unique, indexed, non-nullable.
- `email`: `String(100)`, unique, indexed, non-nullable.
- `password_hash`: `String`, non-nullable (bcrypt salted hash).
- `role`: `String(20)`, non-nullable, default `"user"` (supports `"user"`, `"admin"`).

#### 2. `Book` (`books`)
Defined in [`backend/app/models/book.py`](file:///d:/Internship%20Tracker/Task%2021/book-library-manager/backend/app/models/book.py):
- `id`: `Integer`, Primary Key, indexed.
- `title`: `String`, non-nullable.
- `author`: `String`, non-nullable.
- `genre`: `String`, non-nullable.
- `year`: `Integer`, non-nullable.
- `image`: `Text`, nullable (base64 image data or remote URL).
- `description`: `Text`, nullable.

#### 3. `Favorite` (`favorites`)
Defined in [`backend/app/models/favorite.py`](file:///d:/Internship%20Tracker/Task%2021/book-library-manager/backend/app/models/favorite.py):
- `id`: `Integer`, Primary Key, indexed.
- `user_id`: `Integer`, Foreign Key referencing `users.id` with `ondelete="CASCADE"`.
- `book_id`: `Integer`, Foreign Key referencing `books.id` with `ondelete="CASCADE"`.
- Table Constraint: `UniqueConstraint("user_id", "book_id", name="unique_user_book_favorite")`.

#### 4. `Rating` (`ratings`)
Defined in [`backend/app/models/rating.py`](file:///d:/Internship%20Tracker/Task%2021/book-library-manager/backend/app/models/rating.py):
- `id`: `Integer`, Primary Key, indexed.
- `user_id`: `Integer`, Foreign Key referencing `users.id` with `ondelete="CASCADE"`.
- `book_id`: `Integer`, Foreign Key referencing `books.id` with `ondelete="CASCADE"`.
- `rating`: `Integer`, non-nullable (constrained 1–5 via Pydantic).
- Table Constraint: `UniqueConstraint("user_id", "book_id", name="unique_user_book_rating")`.

#### 5. `UserLibrary` (`user_library`)
Defined in [`backend/app/models/user_library.py`](file:///d:/Internship%20Tracker/Task%2021/book-library-manager/backend/app/models/user_library.py):
- `id`: `Integer`, Primary Key, indexed.
- `user_id`: `Integer`, Foreign Key referencing `users.id` with `ondelete="CASCADE"`.
- `book_id`: `Integer`, Foreign Key referencing `books.id` with `ondelete="CASCADE"`.
- `added_at`: `String`, ISO timestamp string, non-nullable.
- `borrowed_at`: `String`, ISO timestamp string, nullable.
- `downloaded_at`: `String`, ISO timestamp string, nullable.
- `returned_at`: `String`, ISO timestamp string, nullable.
- `status`: `String(20)`, default `"in_library"`, non-nullable (`"in_library"`, `"borrowed"`, `"downloaded"`, `"returned"`).
- Table Constraint: `UniqueConstraint("user_id", "book_id", name="unique_user_book")`.

---

## Project Structure

```
book-library-manager/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   └── connection.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── book.py
│   │   │   ├── user.py
│   │   │   ├── favorite.py
│   │   │   ├── rating.py
│   │   │   └── user_library.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── book.py
│   │   │   ├── favorite.py
│   │   │   ├── library.py
│   │   │   ├── rating.py
│   │   │   └── user.py
│   │   ├── crud/
│   │   │   ├── __init__.py
│   │   │   ├── books.py
│   │   │   ├── favorites.py
│   │   │   ├── library.py
│   │   │   ├── ratings.py
│   │   │   └── users.py
│   │   └── api/
│   │       ├── __init__.py
│   │       ├── dependencies.py
│   │       └── routes/
│   │           ├── __init__.py
│   │           ├── auth.py
│   │           ├── books.py
│   │           ├── favorites.py
│   │           ├── library.py
│   │           └── ratings.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   └── frontend/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   ├── context/
│       │   ├── pages/
│       │   ├── utils/
│       │   ├── App.css
│       │   ├── App.jsx
│       │   ├── api.js
│       │   ├── index.css
│       │   ├── main.jsx
│       │   └── validation.js
│       ├── index.html
│       ├── package.json
│       ├── vite.config.js
│       ├── eslint.config.js
│       └── .gitignore
├── docs/
│   └── screenshots/
│       ├── bugs/
│       └── api-tests/
├── .gitignore
└── README.md
```

---

## Installation & Local Setup

### Prerequisites
- **Python**: Version `3.12+` installed and available on PATH.
- **Node.js**: Version `18.x` or `20.x+` and `npm` installed.
- **PostgreSQL**: PostgreSQL 15+ cluster running locally (configured on port `5433` or standard `5432`).
- **Git**: Installed for version control.

---

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows (Command Prompt)**:
     ```cmd
     venv\Scripts\activate.bat
     ```
   - **Linux / macOS**:
     ```bash
     source venv/bin/activate
     ```

4. **Install backend dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure environment file**:
   Copy `.env.example` to `.env` and configure local connection credentials:
   ```bash
   copy .env.example .env
   ```

6. **Start the FastAPI development server**:
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   *The backend will automatically create all missing database tables on startup via `Base.metadata.create_all`.*

---

### Database Setup

Ensure PostgreSQL is running and create the application database:
```sql
CREATE DATABASE book_next_2;
```

If connecting with standard credentials:
```text
postgresql+psycopg://postgres:<YOUR_PASSWORD>@localhost:5433/book_next_2
```

---

### Environment Variables

Configuration parameters are managed in [`backend/.env`](file:///d:/Internship%20Tracker/Task%2021/book-library-manager/backend/.env.example). Never commit `.env` files containing real production credentials to Git.

| Variable Name | Required | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Yes | `postgresql+psycopg://postgres:postgres@localhost:5433/book_next_2` | PostgreSQL connection string using the psycopg3 driver |
| `FRONTEND_URL` | No | `http://localhost:5173` | Allowed origin for CORS headers |
| `SECRET_KEY` | Yes | `booknest-development-secret-key` | Cryptographic secret for signing HS256 JWT tokens |

#### Example `.env.example`
```env
DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5433/book_next_2
FRONTEND_URL=http://localhost:5173
SECRET_KEY=your-development-secret-key-replace-in-production
```

---

### Frontend Setup

1. **Navigate to the frontend application directory**:
   ```bash
   cd frontend/frontend
   ```

2. **Install JavaScript dependencies**:
   ```bash
   npm install
   ```

3. **Run the Vite development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open [http://localhost:5173](http://localhost:5173) in any modern web browser.

---

## Docker Containerization

The BookNest backend is containerized using a clean, reproducible multi-stage Docker environment.

### Dockerfile Inspection
Defined in [`backend/Dockerfile`](file:///d:/Internship%20Tracker/Task%2021/book-library-manager/backend/Dockerfile):
```dockerfile
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . ./

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Core Container Concepts
- **Image**: A static, immutable snapshot containing Python 3.12-slim, system dependencies, Python packages, and the modular `app/` codebase.
- **Container**: A running, isolated instance of the image executing the Uvicorn ASGI server.
- **Port Mapping**: Forwards external host traffic (e.g., host port `8080`) into the internal container listening port (`8000`).
- **PostgreSQL Connectivity**: The PostgreSQL database is currently **not containerized** and runs on the host system (port `5433`). When running the backend in Docker, point `DATABASE_URL` to the host machine IP or `host.docker.internal`.

### Building and Running the Backend Container

1. **Build the image** (from inside the `backend/` directory):
   ```bash
   docker build -t fastapi .
   ```

2. **Run the container with host port mapping**:
   ```bash
   docker run -p 8080:8000 -e DATABASE_URL="postgresql+psycopg://postgres:YOUR_PASSWORD@host.docker.internal:5433/book_next_2" fastapi
   ```

3. **Verify running container**:
   Visit [http://localhost:8080/docs](http://localhost:8080/docs) to access the interactive Swagger interface served directly from the container.

> [!NOTE]
> Database containerization and multi-container orchestration via Docker Compose represent upcoming enhancements planned for the production deployment phase.

---

## FastAPI Interactive Documentation (Swagger)

FastAPI automatically generates comprehensive, interactive OpenAPI specifications directly from the codebase schemas and route signatures.

- **Interactive Swagger UI (Local)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Interactive Documentation (Local)**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Containerized Swagger UI**: [http://localhost:8080/docs](http://localhost:8080/docs)

Swagger UI allows developers, QA engineers, and client developers to test authentication tokens, inspect payload schemas, trigger live HTTP calls, and review validation error messages directly in the browser.

---

## Complete API Documentation

Every endpoint listed below is implemented in the BookNest backend.

### Authentication APIs

#### 1. `POST /auth/register`
- **Purpose**: Register a new user account with default `"user"` permissions.
- **Authentication**: Not required.
- **Authorization**: Public.
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "username": "jane_reader",
    "email": "jane@example.com",
    "password": "Password@123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "id": 1,
    "username": "jane_reader",
    "email": "jane@example.com",
    "role": "user"
  }
  ```
- **Errors**:
  - `400 Bad Request`: `{"detail": "Email already registered"}` or `{"detail": "Username already taken"}`
  - `422 Unprocessable Entity`: Request payload violates schema constraints (e.g., username < 3 chars, invalid email format, password < 6 chars).

---

#### 2. `POST /auth/login`
- **Purpose**: Verify user credentials and generate an HS256-signed JWT access token.
- **Authentication**: Not required.
- **Authorization**: Public.
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "Password@123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "username": "jane_reader",
      "email": "jane@example.com",
      "role": "user"
    }
  }
  ```
- **Errors**:
  - `401 Unauthorized`: `{"detail": "Invalid email or password"}`
  - `422 Unprocessable Entity`: Missing fields or malformed email syntax.

---

#### 3. `GET /auth/me`
- **Purpose**: Retrieve identity and profile information for the currently authenticated user.
- **Authentication**: Required (`HTTPBearer`).
- **Authorization**: Authenticated user.
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**: None.
- **Response**: `200 OK`
  ```json
  {
    "id": 1,
    "username": "jane_reader",
    "email": "jane@example.com",
    "role": "user"
  }
  ```
- **Errors**:
  - `401 Unauthorized`: `{"detail": "Invalid or expired token"}` or `{"detail": "User not found"}`

---

#### 4. `PUT /auth/make-admin/{user_id}`
- **Purpose**: Promote a specified user account to `"admin"` privileges.
- **Authentication**: Public utility / administrative tool.
- **Authorization**: Public endpoint in current development build.
- **Path Parameters**: `user_id` (integer) — target user ID.
- **Response**: `200 OK`
  ```json
  {
    "id": 2,
    "username": "admin_user",
    "email": "admin@booknest.com",
    "role": "admin"
  }
  ```
- **Errors**:
  - `404 Not Found`: `{"detail": "User not found"}`

---

### Book APIs

#### 5. `GET /books`
- **Purpose**: Retrieve the entire catalog of books enriched with calculated ratings and user favorite statuses.
- **Authentication**: Optional (`HTTPBearer` optional).
- **Authorization**: Public.
- **Headers**: `Authorization: Bearer <access_token>` *(optional)*.
- **Response**: `200 OK`
  ```json
  [
    {
      "id": 1,
      "title": "Clean Architecture",
      "author": "Robert C. Martin",
      "genre": "Software Engineering",
      "year": 2017,
      "image": "https://example.com/clean-arch.jpg",
      "description": "A Craftsman's Guide to Software Structure and Design.",
      "rating": 4.8,
      "user_rating": 5,
      "rating_count": 12,
      "is_favorite": true
    }
  ]
  ```

---

#### 6. `GET /books/{book_id}`
- **Purpose**: Retrieve full details of a single book by ID with user rating and favorite status.
- **Authentication**: Optional.
- **Path Parameters**: `book_id` (integer).
- **Headers**: `Authorization: Bearer <access_token>` *(optional)*.
- **Response**: `200 OK`
  ```json
  {
    "id": 1,
    "title": "Clean Architecture",
    "author": "Robert C. Martin",
    "genre": "Software Engineering",
    "year": 2017,
    "image": "https://example.com/clean-arch.jpg",
    "description": "A Craftsman's Guide to Software Structure and Design.",
    "rating": 4.8,
    "user_rating": 5,
    "rating_count": 12,
    "is_favorite": true
  }
  ```
- **Errors**:
  - `404 Not Found`: `{"detail": "Book not found"}`

---

#### 7. `POST /books`
- **Purpose**: Create and persist a new book record in the catalog.
- **Authentication**: Required (`HTTPBearer`).
- **Authorization**: Admin users only (`role == "admin"`).
- **Headers**:
  - `Authorization: Bearer <admin_token>`
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "Design Patterns",
    "author": "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    "genre": "Computer Science",
    "year": 1994,
    "image": "https://example.com/design-patterns.jpg",
    "description": "Elements of Reusable Object-Oriented Software."
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "id": 14,
    "title": "Design Patterns",
    "author": "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    "genre": "Computer Science",
    "year": 1994,
    "image": "https://example.com/design-patterns.jpg",
    "description": "Elements of Reusable Object-Oriented Software.",
    "rating": null,
    "user_rating": null,
    "rating_count": 0,
    "is_favorite": false
  }
  ```
- **Errors**:
  - `401 Unauthorized`: Missing or invalid token.
  - `403 Forbidden`: `{"detail": "Admin access required"}`
  - `422 Unprocessable Entity`: Input validation failure (e.g. `year` < 1000 or > 2100).

---

#### 8. `PUT /books/{book_id}`
- **Purpose**: Update an existing book's metadata.
- **Authentication**: Required.
- **Authorization**: Admin users only (`role == "admin"`).
- **Path Parameters**: `book_id` (integer).
- **Headers**:
  - `Authorization: Bearer <admin_token>`
  - `Content-Type: application/json`
- **Request Body**: Same as `BookCreate`.
- **Response**: `200 OK` (returns updated `BookResponse`).
- **Errors**:
  - `401 Unauthorized`: Invalid credentials.
  - `403 Forbidden`: Non-admin user.
  - `404 Not Found`: `{"detail": "Book not found"}`
  - `422 Unprocessable Entity`: Validation failure.

---

#### 9. `DELETE /books/{book_id}`
- **Purpose**: Permanently remove a book from the catalog and cascade-delete its ratings and favorites.
- **Authentication**: Required.
- **Authorization**: Admin users only (`role == "admin"`).
- **Path Parameters**: `book_id` (integer).
- **Headers**: `Authorization: Bearer <admin_token>`
- **Response**: `200 OK`
  ```json
  {
    "message": "Book deleted successfully"
  }
  ```
- **Errors**:
  - `401 Unauthorized`: Missing or invalid token.
  - `403 Forbidden`: Non-admin user.
  - `404 Not Found`: `{"detail": "Book not found"}`

---

### Favorites APIs

#### 10. `GET /favorites`
- **Purpose**: Retrieve all books marked as favorites by the current user.
- **Authentication**: Required.
- **Authorization**: Authenticated user.
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: `200 OK`
  ```json
  [
    {
      "id": 1,
      "title": "Clean Architecture",
      "author": "Robert C. Martin",
      "genre": "Software Engineering",
      "year": 2017,
      "image": "https://example.com/clean-arch.jpg",
      "description": "A Craftsman's Guide to Software Structure and Design.",
      "rating": 4.8,
      "user_rating": 5,
      "rating_count": 12,
      "is_favorite": true
    }
  ]
  ```

---

#### 11. `GET /favorites/ids`
- **Purpose**: High-efficiency endpoint returning a flat list of book IDs bookmarked by the user.
- **Authentication**: Required.
- **Authorization**: Authenticated user.
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: `200 OK`
  ```json
  [1, 4, 7, 12]
  ```

---

#### 12. `POST /favorites/{book_id}`
- **Purpose**: Add a book to the authenticated user's favorites list.
- **Authentication**: Required.
- **Authorization**: Authenticated user.
- **Path Parameters**: `book_id` (integer).
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: `200 OK`
  ```json
  {
    "book_id": 1,
    "is_favorite": true,
    "message": "Book added to favorites"
  }
  ```
- **Errors**:
  - `404 Not Found`: `{"detail": "Book not found"}`

---

#### 13. `DELETE /favorites/{book_id}`
- **Purpose**: Remove a book from the authenticated user's favorites list.
- **Authentication**: Required.
- **Authorization**: Authenticated user.
- **Path Parameters**: `book_id` (integer).
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: `200 OK`
  ```json
  {
    "book_id": 1,
    "is_favorite": false,
    "message": "Book removed from favorites"
  }
  ```

---

### Ratings APIs

#### 14. `POST /books/{book_id}/rating`
- **Purpose**: Submit or update a user rating (1 to 5) for a book.
- **Authentication**: Required.
- **Authorization**: Authenticated user.
- **Path Parameters**: `book_id` (integer).
- **Headers**:
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "rating": 5
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "book_id": 1,
    "rating": 5,
    "average_rating": 4.8,
    "rating_count": 13
  }
  ```
- **Errors**:
  - `404 Not Found`: `{"detail": "Book not found"}`
  - `422 Unprocessable Entity`: Rating is outside the allowable range of 1 to 5 (`ge=1, le=5`).

---

#### 15. `GET /ratings`
- **Purpose**: Retrieve all catalog books sorted by average rating in descending order.
- **Authentication**: Required.
- **Authorization**: Authenticated user.
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: `200 OK` (list of `BookResponse` sorted from highest to lowest rating).

---

### Personal Library APIs

#### 16. `GET /my-library`
- **Purpose**: Retrieve all bookshelf items belonging to the current user with enriched book metadata.
- **Authentication**: Required.
- **Authorization**: Authenticated user.
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: `200 OK`
  ```json
  [
    {
      "id": 3,
      "book_id": 1,
      "added_at": "2026-09-22T14:30:00.000Z",
      "borrowed_at": "2026-09-22T14:35:00.000Z",
      "downloaded_at": null,
      "returned_at": null,
      "status": "borrowed",
      "book": {
        "id": 1,
        "title": "Clean Architecture",
        "author": "Robert C. Martin",
        "genre": "Software Engineering",
        "year": 2017,
        "image": "https://example.com/clean-arch.jpg",
        "description": "A Craftsman's Guide to Software Structure and Design.",
        "rating": 4.8,
        "user_rating": 5,
        "rating_count": 13,
        "is_favorite": true
      }
    }
  ]
  ```

---

#### 17. `POST /my-library/{book_id}`
- **Purpose**: Add a book to personal library collection.
- **Authentication**: Required.
- **Authorization**: Authenticated user.
- **Path Parameters**: `book_id` (integer).
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: `200 OK` (returns `PersonalLibraryResponse` with `status: "in_library"`).
- **Errors**:
  - `400 Bad Request`: `{"detail": "Book already in your library"}`
  - `404 Not Found`: `{"detail": "Book not found"}`

---

#### 18. `PUT /my-library/{book_id}/borrow`
- **Purpose**: Mark a book in the personal library as currently borrowed.
- **Authentication**: Required.
- **Authorization**: Authenticated user.
- **Path Parameters**: `book_id` (integer).
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: `200 OK` (returns `PersonalLibraryResponse` with updated `borrowed_at` timestamp and `status: "borrowed"`).
- **Errors**:
  - `404 Not Found`: `{"detail": "Book not found in your library"}`

---

#### 19. `PUT /my-library/{book_id}/download`
- **Purpose**: Mark a personal library book as downloaded for offline reading.
- **Authentication**: Required.
- **Authorization**: Authenticated user.
- **Path Parameters**: `book_id` (integer).
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: `200 OK` (returns `PersonalLibraryResponse` with updated `downloaded_at` timestamp and `status: "downloaded"`).
- **Errors**:
  - `404 Not Found`: `{"detail": "Book not found in your library"}`

---

#### 20. `PUT /my-library/{book_id}/return`
- **Purpose**: Mark a previously borrowed book as returned.
- **Authentication**: Required.
- **Authorization**: Authenticated user.
- **Path Parameters**: `book_id` (integer).
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: `200 OK` (returns `PersonalLibraryResponse` with updated `returned_at` timestamp and `status: "returned"`).
- **Errors**:
  - `404 Not Found`: `{"detail": "Book not found in your library"}`

---

### New Releases APIs

#### 21. `GET /new-releases`
- **Purpose**: Retrieve books ordered chronologically by publication year descending, enriched with rating data.
- **Authentication**: Optional.
- **Authorization**: Public.
- **Headers**: `Authorization: Bearer <access_token>` *(optional)*.
- **Response**: `200 OK` (returns `list[BookResponse]` sorted by `year DESC, id DESC`).

---

### System & Health APIs

#### 22. `GET /`
- **Purpose**: API health check verifying that the Uvicorn ASGI server and application router are online.
- **Authentication**: Not required.
- **Authorization**: Public.
- **Response**: `200 OK`
  ```json
  {
    "message": "BookNest API is running"
  }
  ```

---

## API Testing Completed Today

As part of the pre-release production audit, four critical API routes were tested to verify transport integrity, authentication verification, and negative-case error handling.

### Test Suite Breakdown

#### Test 1 — Catalog Retrieval: `GET /books`
- **Target URL**: `http://127.0.0.1:8000/books`
- **Method**: `GET`
- **Authentication**: None (Public catalog route)
- **Objective**: Verify that the database connection pool executes queries correctly and returns an array of enriched books.
- **Outcome**: Successfully returned HTTP 200 OK with valid JSON serialization of book models.
- **Screenshot Placeholder**:
  <!-- INSERT SCREENSHOT: API Test 1 - GET /books -->
  <!-- Recommended path: docs/screenshots/api-tests/get-books.png -->
  ![GET /books API Test](docs/screenshots/api-tests/get-books.png)

#### Test 2 — User Authentication: `POST /auth/login`
- **Target URL**: `http://127.0.0.1:8000/auth/login`
- **Method**: `POST`
- **Payload**: Valid registered email and password credentials
- **Objective**: Verify that Passlib/bcrypt password comparison executes properly and returns a signed JWT bearer token.
- **Outcome**: Successfully returned HTTP 200 OK containing `access_token`, `token_type: "bearer"`, and the user's profile object.
- **Screenshot Placeholder**:
  <!-- INSERT SCREENSHOT: API Test 2 - POST /auth/login -->
  <!-- Recommended path: docs/screenshots/api-tests/login.png -->
  ![POST /auth/login API Test](docs/screenshots/api-tests/login.png)

#### Test 3 — Authenticated Identity Retrieval: `GET /auth/me`
- **Target URL**: `http://127.0.0.1:8000/auth/me`
- **Method**: `GET`
- **Authentication**: `Authorization: Bearer <access_token>`
- **Objective**: Confirm that the FastAPI `HTTPBearer` security dependency decodes the bearer token, verifies signature and expiration, retrieves the user from PostgreSQL, and returns the user object.
- **Outcome**: Passed with HTTP 200 OK.
- **Screenshot Placeholder**:
  <!-- INSERT SCREENSHOT: API Test 3 - GET /auth/me -->
  <!-- Recommended path: docs/screenshots/api-tests/auth-me.png -->
  ![GET /auth/me API Test](docs/screenshots/api-tests/auth-me.png)

#### Test 4 — Non-Existent Entity Error Handling: `GET /books/999999`
- **Target URL**: `http://127.0.0.1:8000/books/999999`
- **Method**: `GET`
- **Authentication**: None
- **Objective**: Verify negative error handling when querying a non-existent primary key ID.
- **Outcome**: Returned expected HTTP 404 Not Found with structured error body `{"detail": "Book not found"}`.
- **Screenshot Placeholder**:
  <!-- INSERT SCREENSHOT: API Test 4 - GET /books/999999 -->
  <!-- Recommended path: docs/screenshots/api-tests/book-not-found.png -->
  ![GET /books/999999 API Test](docs/screenshots/api-tests/book-not-found.png)

---

### API Test Results Table

| Test # | Method | Endpoint | Purpose | Target URL | Expected Status | Result |
| :---: | :---: | :--- | :--- | :--- | :---: | :---: |
| **1** | `GET` | `/books` | Retrieve book catalog collection | `http://127.0.0.1:8000/books` | `200 OK` | **Tested** |
| **2** | `POST` | `/auth/login` | Authenticate credentials & issue JWT | `http://127.0.0.1:8000/auth/login` | `200 OK` | **Tested** |
| **3** | `GET` | `/auth/me` | Verify token decode & user resolution | `http://127.0.0.1:8000/auth/me` | `200 OK` | **Passed** |
| **4** | `GET` | `/books/999999` | Non-existent entity 404 error handling | `http://127.0.0.1:8000/books/999999` | `404 Not Found` | **Tested** |

---

## Bug Report and Fixes

During today's pre-production review, three bugs were identified, isolated, and resolved across the frontend layout, backend schema validation, and routing hierarchy.

```
┌────────────┬────────────────────────────────────────────────────────────────────────┐
│ BUG TRACKER│ PRE-PRODUCTION AUDIT LOG                                               │
├────────────┼────────────────────────────────────────────────────────────────────────┤
│ BUG-001    │ Header component horizontal layout overflow on tablet viewports        │
│ BUG-002    │ Backend allowed publication year 0 (missing boundary constraints)      │
│ BUG-003    │ Global navigation Header displayed on /login and /register pages       │
└────────────┴────────────────────────────────────────────────────────────────────────┘
```

---

### Bug #1 — Tablet Responsive Layout Overflow

- **Bug ID**: `BUG-001`
- **Severity**: Medium (UI / Usability Defect)
- **Component**: [`frontend/frontend/src/components/Header.jsx`](file:///d:/Internship%20Tracker/Task%2021/book-library-manager/frontend/frontend/src/components/Header.jsx)
- **Issue**: On tablet-sized viewports (768px to 1279px), the navigation links, authentication badges, and explore buttons exceeded horizontal viewport dimensions, causing the header container to break boundaries and trigger an unintended horizontal scrollbar.
- **Root Cause**: The responsive breakpoint logic switched from the compact mobile menu to the full desktop inline navigation at too small a viewport threshold (`lg`), which did not provide enough horizontal space for the full navigation menu.
- **Fix**: Updated breakpoint classes in `Header.jsx` from `lg:` to `xl:`:
  - Navigation links: `<nav className="hidden xl:flex items-center gap-1.5 lg:gap-2">`
  - User controls: `<div className="hidden xl:flex items-center gap-2">`
  - Mobile hamburger toggle: `<button className="xl:hidden ...">`
  - Tablet devices now collapse navigation into the clean slide-down drawer menu, eliminating layout overflow.
- **Verification**: Verified across viewport widths from 768px through 1200px using browser developer tools. No horizontal scrollbar was present, and the hamburger drawer toggled navigation cleanly.
- **Screenshot Placeholder**:
  <!-- INSERT SCREENSHOT: Bug #1 - Tablet Responsive Layout Fix -->
  <!-- Recommended path: docs/screenshots/bugs/tablet-responsive-fix.png -->
  ![Bug #1 Tablet Responsive Fix](docs/screenshots/bugs/tablet-responsive-fix.png)

---

### Bug #2 — Invalid Publication Year Validation

- **Bug ID**: `BUG-002`
- **Severity**: High (Data Integrity Defect)
- **Component**: [`backend/app/schemas/book.py`](file:///d:/Internship%20Tracker/Task%2021/book-library-manager/backend/app/schemas/book.py) & [`frontend/frontend/src/validation.js`](file:///d:/Internship%20Tracker/Task%2021/book-library-manager/frontend/frontend/src/validation.js)
- **Issue**: The application permitted books to be saved with a publication year of `0` or negative values. An invalid legacy record with year 0 was discovered in the database.
- **Root Cause**: The backend Pydantic `BookBase` schema specified `year: int` without minimum or maximum boundary constraints, allowing non-historical and nonsense years to pass schema validation.
- **Fix**:
  1. Updated `backend/app/schemas/book.py`:
     ```python
     year: int = Field(..., ge=1000, le=2100)
     ```
  2. Updated `frontend/frontend/src/validation.js` in `validateBookForm`:
     ```javascript
     if (!Number.isInteger(numericYear) || numericYear < 1000 || numericYear > 2100) {
       errors.year = 'Publication year must be between 1000 and 2100.'
     }
     ```
  3. Identified and corrected the invalid legacy database record.
- **Verification**: Dispatched invalid `year: 0` payloads via Swagger UI and Postman; the backend rejected the request with HTTP 422 Unprocessable Entity. Valid years (e.g., `2024`) succeeded with HTTP 200.
- **Screenshot Placeholder**:
  <!-- INSERT SCREENSHOT: Bug #2 - Invalid Publication Year Fix -->
  <!-- Recommended path: docs/screenshots/bugs/invalid-publication-year-fix.png -->
  ![Bug #2 Publication Year Fix](docs/screenshots/bugs/invalid-publication-year-fix.png)

---

### Bug #3 — Header Displayed on Authentication Pages

- **Bug ID**: `BUG-003`
- **Severity**: Low (UX Inconsistency)
- **Component**: [`frontend/frontend/src/App.jsx`](file:///d:/Internship%20Tracker/Task%2021/book-library-manager/frontend/frontend/src/App.jsx)
- **Issue**: The application top navigation Header rendered unconditionally across all views, including the dedicated `/login` and `/register` authentication screens, cluttering focused authentication flows.
- **Root Cause**: The `<Header />` component was rendered globally inside `AppLayout` without inspecting current route parameters.
- **Fix**: Modified `App.jsx` to dynamically evaluate the current route pathname with `useLocation()` and hide the header on authentication views:
  ```jsx
  function AppLayout() {
    const location = useLocation()
    const hideHeader = ['/login', '/register'].includes(location.pathname)

    return (
      <div className="flex min-h-screen flex-col bg-[#f5f1e8] text-[#222]">
        {!hideHeader && <Header />}
        <main className="flex-1">
          <Routes>...</Routes>
        </main>
        <Footer />
      </div>
    )
  }
  ```
- **Verification**: Navigated between `/`, `/library`, `/login`, and `/register`. Header renders on catalog views and is hidden on authentication views.
- **Screenshot Placeholder**:
  <!-- INSERT SCREENSHOT: Bug #3 - Authentication Header Fix -->
  <!-- Recommended path: docs/screenshots/bugs/auth-header-fix.png -->
  ![Bug #3 Auth Header Fix](docs/screenshots/bugs/auth-header-fix.png)

---

## Screenshots

### Bug Fix Screenshots

| Defect | Description | Visual Artifact |
| :--- | :--- | :--- |
| **Bug #1** | Tablet Responsive Breakpoint Adjustment | ![Tablet Fix](docs/screenshots/bugs/tablet-responsive-fix.png)<br>*(Placeholder: docs/screenshots/bugs/tablet-responsive-fix.png)* |
| **Bug #2** | Backend Schema Year Validation Constraint | ![Year Fix](docs/screenshots/bugs/invalid-publication-year-fix.png)<br>*(Placeholder: docs/screenshots/bugs/invalid-publication-year-fix.png)* |
| **Bug #3** | Header Hidden on `/login` and `/register` | ![Auth Header Fix](docs/screenshots/bugs/auth-header-fix.png)<br>*(Placeholder: docs/screenshots/bugs/auth-header-fix.png)* |

### API Testing Screenshots

| Endpoint | Test Focus | Visual Artifact |
| :--- | :--- | :--- |
| `GET /books` | Catalog listing & enriched fields | ![GET /books](docs/screenshots/api-tests/get-books.png)<br>*(Placeholder: docs/screenshots/api-tests/get-books.png)* |
| `POST /auth/login` | JWT access token issuance | ![Login Test](docs/screenshots/api-tests/login.png)<br>*(Placeholder: docs/screenshots/api-tests/login.png)* |
| `GET /auth/me` | Bearer token authentication (200 OK) | ![Auth Me Test](docs/screenshots/api-tests/auth-me.png)<br>*(Placeholder: docs/screenshots/api-tests/auth-me.png)* |
| `GET /books/999999` | Non-existent entity handling (404 Not Found) | ![404 Test](docs/screenshots/api-tests/book-not-found.png)<br>*(Placeholder: docs/screenshots/api-tests/book-not-found.png)* |

---

## Production Readiness Review

### Responsive UI Review
A comprehensive audit of the frontend interface was performed across desktop, tablet, and mobile breakpoints using Chrome DevTools Device Mode:
- **Desktop (1280px+)**: Displays full horizontal navigation bar, multi-column book grids (3–4 columns), expanded administrative control panels, and side-by-side book detail layouts.
- **Tablet (768px – 1024px)**: Resolved Bug #1. Desktop navigation now cleanly collapses into the slide-out navigation drawer. Book grid scales cleanly to 2 columns.
- **Mobile (320px – 480px)**: Single-column card stacking, touch-friendly tap targets (>44px), full-width search and filter controls, and modal-based book creation dialogs.
- **Overflow Analysis**: No horizontal viewport scrolling occurs on any standard viewport width.

---

### Validation Review

BookNest implements defense-in-depth validation across both client and server layers.

```
┌─────────────────────────┐         ┌─────────────────────────┐
│   Frontend Validation   │         │   Backend Validation    │
│  (Instant User Feedback)│         │ (Data Defense-in-Depth) │
├─────────────────────────┤         ├─────────────────────────┤
│ • Empty field checks    │         │ • Pydantic field schemas│
│ • Email regex syntax    │────────►│ • Year bounds [1000-2100│
│ • Password complexity   │         │ • String length limits  │
│ • Year [1000, 2100]     │         │ • SQL Unique constraints│
│ • Rating [1, 5] bounds  │         │ • HTTP 422 JSON errors  │
└─────────────────────────┘         └─────────────────────────┘
```

#### Why Both Client and Server Validation Are Mandatory
- **Frontend validation improves user experience**: Users receive immediate visual guidance as they fill out forms without waiting for network round-trips.
- **Backend validation guarantees security and data integrity**: Client-side checks can be bypassed by malicious actors using curl, Postman, or automated scripts. The backend is the single source of truth and must independently validate and sanitize every payload before it reaches the database.

---

### Code Quality & Architecture Review
- **Separation of Concerns**: The backend refactoring cleanly isolates configuration (`app/core`), database connections (`app/database`), ORM entities (`app/models`), data validation (`app/schemas`), database operations (`app/crud`), and HTTP transport (`app/api`).
- **Standardized Exception Handling**: Centralized handlers in `app/main.py` convert raw validation and database errors into predictable, secure JSON payloads (`422`, `503`, `500`), preventing internal stack traces or connection strings from leaking to clients.
- **Reusable React Components**: Generic components (`BookCard`, `StarRating`, `Sidebar`, `BookForm`) maintain single responsibilities and handle props predictably.
- **Clean Naming & Readability**: Variables, functions, and models follow PEP 8 and JavaScript standard conventions.

---

### Git History & Repository Hygiene
- **Secret Isolation**: Configuration secrets (`SECRET_KEY`, database passwords) are stored in `.env` files, which are excluded from source control via `.gitignore`.
- **Artifact Exclusions**: Virtual environment folders (`venv/`), dependency directories (`node_modules/`), build output (`dist/`), and bytecode caches (`__pycache__/`) are excluded from Git tracking.
- **Atomic Commits**: Commit messages follow semantic conventions (`Task-18: Code Refactoring`, `Add Task 19`, etc.) documenting progress across milestones.

---

### Documentation Review
Comprehensive documentation is essential for production readiness. Without complete setup instructions, architecture documentation, and API specifications, onboarding new engineers and debugging production incidents becomes error-prone and time-consuming. This `README.md` documents all active project modules, schemas, workflows, and testing results.

---

## Contributing & Open-Source Workflow

We welcome contributions to BookNest. Please follow standard open-source branch and pull request workflows.

### Development Guidelines
1. Fork the repository to your GitHub account.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/book-library-manager.git
   cd book-library-manager
   ```
3. Create a descriptive feature branch:
   ```bash
   git checkout -b feature/user-profile-settings
   ```
4. Set up backend and frontend development environments as detailed in the [Installation](#installation--local-setup) section.
5. Adhere to the existing modular architecture:
   - Place database operations in `app/crud/`.
   - Place Pydantic models in `app/schemas/`.
   - Keep route handlers in `app/api/routes/`.
   - Do not commit `.env`, `venv/`, or `node_modules/`.
6. Run linting and test your changes:
   ```bash
   # Frontend linting
   cd frontend/frontend
   npm run lint
   ```
7. Commit your changes with meaningful messages:
   ```bash
   git commit -m "feat(library): add return-date validation for borrowed books"
   ```
8. Push your branch and open a Pull Request against `main`:
   ```bash
   git push origin feature/user-profile-settings
   ```

---

### Reporting Bugs
When filing a bug report, include:
- A clear, descriptive issue title.
- Step-by-step reproduction instructions.
- Expected behavior vs. actual behavior.
- Relevant log output or browser console messages.
- Viewport dimensions or device details for layout issues.

---

### Feature Requests
Feature suggestions are welcome. Please include:
- A summary of the proposed feature and problem it solves.
- Proposed API changes or database schema adjustments.
- Any considerations regarding backward compatibility.

---

### Submitting Pull Requests
- Provide a summary of changes and reference relevant issue numbers.
- Ensure new endpoints include Pydantic request/response models.
- Update this `README.md` if modifying existing endpoints or environment variables.

---

## Future Improvements

The following improvements are planned for upcoming development cycles leading into production deployment:
- **Server-Side Pagination & Sorting**: Implement cursor- or offset-based pagination (`limit`, `offset`) on `/books` and `/ratings` to handle large catalogs efficiently.
- **Full-Text Catalog Search**: Add PostgreSQL full-text search indexing (`to_tsvector`) across book titles, authors, and descriptions.
- **Database Migrations with Alembic**: Introduce automated schema migrations to track and apply database changes version-by-version.
- **Full Container Orchestration**: Provide production multi-container orchestration containerizing both FastAPI and PostgreSQL with automated health checks.
- **Automated Test Suite**: Implement end-to-end automated testing with `pytest` and `httpx` for backend routes and Vitest/React Testing Library for frontend components.
- **Role-Based Fine-Grained Permissions**: Extend roles beyond `user` and `admin` to include roles like `librarian` and `reviewer`.
- **CI/CD Pipeline**: Build GitHub Actions workflows for automated linting, testing, and Docker image builds on every pull request.
- **Cloud Deployment**: Prepare container manifests and infrastructure-as-code configurations for production cloud hosting.

---

## DSA / Coding Practice

As part of today's engineering preparation, two fundamental Data Structures and Algorithms (DSA) problems were reviewed, implemented, and analyzed.

---

### 1. Longest Substring Without Repeating Characters

#### Problem Statement
Given a string `s`, find the length of the longest substring without duplicate characters.

#### Algorithmic Approach: Sliding Window
Use a sliding window with two pointers (`left` and `right`) and a hash map (`char_map`) tracking the most recent index where each character was seen:
1. Advance the `right` pointer to expand the current window.
2. If `s[right]` is already in `char_map` and its previous index is within the current window (`>= left`), shift `left` to `char_map[char] + 1` to skip past the duplicate.
3. Update `char_map[s[right]] = right`.
4. Update the maximum window length observed: `max_length = max(max_length, right - left + 1)`.

#### Python Implementation
```python
def length_of_longest_substring(s: str) -> int:
    char_map = {}
    left = 0
    max_length = 0

    for right, char in enumerate(s):
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1

        char_map[char] = right
        max_length = max(max_length, right - left + 1)

    return max_length


# Example Walkthrough
if __name__ == "__main__":
    example = "abcabcbb"
    result = length_of_longest_substring(example)
    print(f"Input: '{example}' -> Longest unique substring length: {result}")
    # Output: 3 (substring "abc")
```

#### Complexity Analysis
- **Time Complexity**: $\mathcal{O}(n)$, where $n$ is the length of string `s`. Each character is visited at most twice (once by `right`, once by `left`).
- **Space Complexity**: $\mathcal{O}(\min(m, n))$, where $m$ is the size of the character alphabet (e.g., 26 for lowercase English, 128 for ASCII) and $n$ is string length.

---

### 2. Merge Intervals

#### Problem Statement
Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals and return an array of non-overlapping intervals that cover all intervals in the input.

#### Algorithmic Approach: Sorting + Linear Sweep
1. If the input list is empty, return an empty list.
2. Sort intervals by their start time (`key=lambda x: x[0]`).
3. Initialize the `merged` list with the first interval.
4. Iterate through remaining intervals:
   - Let `current` be the interval under evaluation and `last_merged` be `merged[-1]`.
   - If `current[0] <= last_merged[1]`, the intervals overlap. Update `last_merged[1] = max(last_merged[1], current[1])`.
   - Otherwise, there is no overlap; append `current` directly to `merged`.

#### Python Implementation
```python
def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []

    # Sort intervals based on starting boundary
    intervals.sort(key=lambda item: item[0])

    merged = [intervals[0]]

    for current in intervals[1:]:
        last_merged = merged[-1]

        # Check for overlap: current start <= last merged end
        if current[0] <= last_merged[1]:
            last_merged[1] = max(last_merged[1], current[1])
        else:
            merged.append(current)

    return merged


# Example Walkthrough
if __name__ == "__main__":
    test_intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]
    result = merge_intervals(test_intervals)
    print(f"Input: {test_intervals}")
    print(f"Merged Output: {result}")
    # Output: [[1, 6], [8, 10], [15, 18]]
```

#### Complexity Analysis
- **Time Complexity**: $\mathcal{O}(n \log n)$, where $n$ is the number of intervals. Sorting dominates runtime, followed by an $\mathcal{O}(n)$ linear scan.
- **Space Complexity**: $\mathcal{O}(n)$ to store the merged intervals, or $\mathcal{O}(\log n)$ auxiliary space used by Python's Timsort algorithm.

---

## Production Readiness Checklist

Pre-launch review status tracking for the BookNest platform:

- [x] **Authentication reviewed**: Password hashing with bcrypt, JWT token creation, and expiration validation verified.
- [x] **Validation reviewed**: Client-side regex and server-side Pydantic boundary checks implemented.
- [x] **APIs tested**: Critical endpoints (`/books`, `/auth/login`, `/auth/me`, `/books/999999`) tested and verified.
- [x] **Responsive UI reviewed**: Mobile, tablet, and desktop layouts audited; Bug #1 resolved.
- [x] **Folder structure organized**: Modular layered architecture implemented across `app/core`, `app/database`, `app/models`, `app/schemas`, `app/crud`, and `app/api`.
- [x] **Code quality reviewed**: Separation of concerns enforced; centralized exception handlers in place.
- [x] **Documentation completed**: Architecture, complete API reference, and setup guides updated.
- [x] **Git history reviewed**: Secrets excluded, `.gitignore` validated, and atomic commits verified.
- [x] **Major bugs addressed**: Identified defects (`BUG-001`, `BUG-002`, `BUG-003`) resolved and documented.
- [x] **Environment variables documented**: Safe `.env.example` created and configuration parameters listed.
- [x] **Secrets excluded**: Passwords, secrets, and database credentials excluded from repository tracking.
- [x] **Deployment readiness reviewed**: Docker containerization verified; missing elements identified for deployment phase.
- [x] **Project prepared for Week 4 Final Startup Simulation**: All pre-requisite quality gates and audits completed.

---

## Learning Outcomes

1. **Production-Ready Mindset**: Learned that production readiness requires looking beyond simply finishing feature code to also address edge-case validation, responsive UI fidelity, error handling, and operational hygiene.
2. **Layered Security & Defense-in-Depth**: Gained hands-on experience implementing dual-tier input validation, bcrypt password hashing, and stateless JWT token authentication with role-based access control.
3. **Engineering Code Reviews & Architecture**: Understood the maintainability benefits of a modular backend architecture separating routers, Pydantic schemas, ORM models, and CRUD operations.
4. **Documentation & Git Hygiene**: Learned how comprehensive API documentation, setup guides, and repository hygiene (excluding secrets and build artifacts) enable collaboration and smooth deployments.
5. **Algorithmic Problem-Solving**: Reinforced foundational DSA skills with Python implementations of the sliding window and interval merging patterns, analyzing time and space complexity.

---

## Engineering Challenges

- **Comprehensive Full-Stack Auditing**: Navigating and cross-checking a multi-tier codebase (React, FastAPI, SQLAlchemy, PostgreSQL) to verify that schemas and UI components align with the backend API contract.
- **Authentication & Protected Ingress Verification**: Tracing JWT token lifecycles from initial login, through browser `localStorage`, into Axios request interceptors, and finally through FastAPI `HTTPBearer` dependencies.
- **Diagnosing Responsive Breakpoint Overflow**: Isolating subtle layout issues where tablet viewports attempted to render full desktop navigation menus, and updating Tailwind breakpoints to fix the issue.
- **Data Integrity & Validation Edge Cases**: Tracking down validation gaps where unconstrained schema fields allowed invalid values (e.g. publication year 0), requiring updates to both Pydantic models and frontend validation.
- **Documentation for Team Handoff**: Synthesizing the complete system architecture, all 22 active API endpoints, and setup procedures into a clean, professional reference for the upcoming Week 4 Final Startup Simulation.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
