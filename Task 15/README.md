# Task-15

# Implementation of Role-Based access control in the application(User,Admin)

## Project Overview
BookNest is a full-stack library management application built with React on the frontend and FastAPI on the backend, backed by a PostgreSQL database. The application allows users to browse a shared Main Library, manage their own Personal Library (borrowing, downloading, and returning books), and interact with books through Favorites and Ratings.

Today's task focused on strengthening the existing authentication system introduced in the previous task by implementing full Login/Logout functionality, properly protecting frontend routes and backend APIs, and implementing Role-Based Access Control (Admin/User). The purpose was to enhance the existing project rather than rebuild it.

## Features

- User registration and login with JWT-based authentication
- User logout with authentication state cleanup
- Role-based access control (Admin and User roles)
- Admin-only book Create, Update, and Delete operations
- Main Library for browsing all available books
- Personal Library per user (add, borrow, download, return, status/date tracking)
- User-specific Favorites
- User-specific Ratings, with an overall book rating calculated from all user ratings
- Search and filtering for books
- Protected React routes for authenticated pages
- Protected FastAPI APIs using authentication and authorization dependencies
- Axios-based API communication with the FastAPI backend
- Centralized handling of unauthorized and forbidden access
- Centralized error handling for authentication, invalid requests, missing resources, and database errors

## Technologies Used

### Frontend
- React
- JavaScript
- Axios
- React Router

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic

### Database
- PostgreSQL

### Authentication / Security
- JWT
- Passlib
- bcrypt (bcrypt==4.3.0)

## System Architecture / Application Flow
React Frontend
↓
Axios REST API requests
↓
FastAPI Backend
↓
Authentication / Authorization
↓
SQLAlchemy
↓
PostgreSQL


React handles the UI and sends requests via Axios to FastAPI. FastAPI validates and authorizes each request, then uses SQLAlchemy to interact with PostgreSQL. Data flows back through the same layers to the frontend.

## Work Completed Today

### 1. User Login
Login is implemented using the user's registered email and password. The backend verifies the submitted credentials against the stored password hash. On success, a JWT access token is generated and returned to the frontend, and the authentication state is maintained on the React side for the duration of the session.

### 2. User Logout
Logout clears the authentication state on the frontend. The stored JWT/authentication information is removed, and any previously accessible protected pages become unreachable again until the user logs back in.

### 3. JWT Authentication
JWT-based authentication is implemented using FastAPI. Each token contains user-related information such as the user ID and role. Protected requests include this token as a Bearer token in the `Authorization` header, and the backend validates the token before granting access to any protected resource.

### 4. Password Hashing
Passwords are never stored as plain text. Passlib is used for hashing and verification, with bcrypt as the underlying hashing algorithm (`bcrypt==4.3.0`).

- **Why bcrypt** – bcrypt is a slow, adaptive hashing algorithm designed specifically for passwords. Its deliberate computational cost makes brute-force and rainbow-table attacks significantly harder compared to fast general-purpose hash functions.
- **Hashing vs Encryption** – Encryption is reversible (data can be decrypted back to its original form with the right key). Hashing is one-way — a password hash cannot be converted back into the original password, which is exactly what is needed for credential storage.
- **Role of Salt** – bcrypt automatically generates and embeds a random salt into each hash. This ensures that two users with the same password end up with different hashes, preventing precomputed hash-lookup attacks.

**Password Flow**
Registration → Plain Password → bcrypt (with salt) → Password Hash → PostgreSQL
Login → Plain Password → bcrypt Verify → Compare Against Stored Hash → Success/Failure


### 5. Authentication vs Authorization
- **Authentication** verifies *who* the user is (login with valid credentials, resulting in a valid JWT).
- **Authorization** determines *what* an authenticated user is allowed to do (e.g., whether they hold the Admin role required for a given action).

A user can be successfully authenticated and still be denied access to a specific action if they are not authorized for it.

### 6. Protected React Routes
Protected routes were implemented on the frontend so that restricted pages cannot be accessed directly by unauthenticated users. Attempting to access a protected page without a valid authentication state redirects the user to the login page.

### 7. Protected FastAPI APIs
Backend APIs are protected using FastAPI authentication dependencies rather than relying on frontend restrictions alone. Requests with a missing or invalid JWT token are rejected at the backend regardless of what the frontend UI allows, since frontend-only protection can be bypassed by directly calling the API.

### 8. Role-Based Access Control
Basic Admin/User role-based access control was implemented:

- Admin users have additional permissions, including book Create, Update, and Delete operations.
- Normal users cannot perform Admin-only operations.
- Backend authorization dependencies verify the authenticated user's role before allowing the operation to proceed.

### 9. Unauthorized Access Handling
The following scenarios are handled explicitly:

| Scenario | Handling | Status Code |
|---|---|---|
| Invalid credentials during login | Login rejected with an authentication error | 401 Unauthorized |
| Missing authentication token | Request rejected before reaching business logic | 401 Unauthorized |
| Invalid or expired JWT token | Token validation fails, request rejected | 401 Unauthorized |
| Authenticated user without required role | Request rejected by role-based dependency | 403 Forbidden |

### 10. React Authentication Flow
Authentication state is managed in React using `AuthContext`, which shares authentication information (current user, role, token presence) across components. Axios is used for all communication with the FastAPI backend, and authenticated requests automatically include the JWT as a Bearer token.

## Authentication Flow

Registration
↓
Password Hashing
↓
Store Password Hash
↓
Login
↓
Verify Password
↓
Generate JWT
↓
Store Authentication State
↓
Protected Request
↓
Bearer JWT
↓
FastAPI Validates Token
↓
Check User / Role
↓
Allow or Reject Request


## Admin Functionality

Role-based access control distinguishes between Admin and User roles. Book Create, Update, and Delete operations are restricted to Admin users.

This restriction is enforced on the **backend** using FastAPI dependencies that check the authenticated user's role before allowing the operation to proceed — it is not simply hidden or disabled in the frontend UI. Non-admin requests to these endpoints are rejected regardless of what the frontend displays.

## Main Library

The Main Library contains the shared catalog of books available to all users. All authenticated users can browse and search the Main Library, while modification of book records is restricted to Admins as described above.

## Personal Library

Authenticated users can manage their own Personal Library independently of the Main Library. Supported actions include:

- **Add** – add a book from the Main Library to the user's Personal Library
- **Borrow** – mark a book as borrowed
- **Download** – mark a book as downloaded
- **Return** – mark a borrowed book as returned

Each entry tracks relevant status and dates, including when a book was added, borrowed, downloaded, and returned.

## Favorites and Ratings

Favorites and Ratings are implemented as user-specific data rather than being shared across the application.

- Each user can favorite a book independently of other users.
- Each user can rate a book independently, and their rating does not overwrite or affect another user's rating for the same book.
- An overall rating for each book is calculated from the individual ratings submitted by all users.

## Database Structure

Books are **not duplicated** for each user. A single book record exists in the Main Library, and user-specific interactions are maintained through separate relationship tables, including:

- `favorites` – links users to the books they have favorited
- `ratings` – links users to the ratings they have given individual books
- `user_library` – links users to books in their Personal Library, along with status and date tracking (borrowed, downloaded, returned)

## Backend Structure

```text
backend/
├── main.py
├── auth.py
├── dependencies.py
├── crud.py
├── models.py
├── schemas.py
├── database.py
└── requirements.txt
```

- **main.py** – FastAPI application and API routes
- **auth.py** – password hashing, password verification, JWT creation, JWT decoding
- **dependencies.py** – current-user authentication, optional authentication where required, Admin authorization
- **crud.py** – database operations
- **models.py** – SQLAlchemy database models
- **schemas.py** – Pydantic request/response validation
- **database.py** – PostgreSQL and SQLAlchemy database connection

## Frontend Structure

```text
frontend/
└── src/
    ├── api.js
    ├── App.jsx
    ├── components/
    ├── context/
    │   └── AuthContext.jsx
    ├── pages/
    └── routes/
        └── ProtectedRoute.jsx
```

- **components/** – reusable UI components
- **pages/** – route-level pages (Login, Register, Home, Library, etc.)
- **context/AuthContext.jsx** – manages and shares authentication state across the app
- **routes/ProtectedRoute.jsx** – guards routes that require authentication, redirecting unauthenticated users to login
- **api.js** – Axios instance configured with the backend base URL, used for all API communication, including attaching the JWT Bearer token to authenticated requests

## API Documentation

| Method | Endpoint | Purpose | Auth Required | Role Required |
|---|---|---|---|---|
| POST | `/auth/register` | Register a new user, hash and store password | No | — |
| POST | `/auth/login` | Verify credentials and issue a JWT access token | No | — |
| GET | `/auth/me` | Return the currently authenticated user's details | Yes | Any authenticated user |
| POST | `/books` | Create a new book | Yes | Admin |
| PUT | `/books/{id}` | Update an existing book | Yes | Admin |
| DELETE | `/books/{id}` | Delete a book | Yes | Admin |
| GET | `/books` | List/search the Main Library | Yes | Any authenticated user |
| POST | `/library` | Add/borrow/download/return a book in the Personal Library | Yes | Any authenticated user |
| POST | `/favorites` | Add or remove a favorite for the current user | Yes | Any authenticated user |
| POST | `/ratings` | Submit or update a rating for the current user | Yes | Any authenticated user |

## Installation / Setup Instructions

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd frontend
npm install
```

## Environment Variables

**Backend (`backend/.env`)**

**Frontend (`frontend/.env`)**

## API Testing

APIs were tested and documented using:

- **FastAPI Swagger UI** (`/docs`) – for exploring and testing endpoints directly from the browser
- **Thunder Client** – for manual request/response testing, including verifying 401/403 responses for missing tokens, invalid tokens, and insufficient role permissions

## Security

- JWT authentication is used to identify users on protected requests
- Passwords are hashed with bcrypt via Passlib and never stored as plain text
- Authentication (identity) and authorization (permissions) are handled as distinct, separate checks
- Backend API protection is enforced independently of frontend route protection
- React protected routes prevent unauthenticated navigation to restricted pages
- Role-based authorization restricts Admin-only operations at the backend
- `401 Unauthorized` is returned for missing/invalid/expired tokens; `403 Forbidden` is returned for authenticated users lacking the required role
- JWT tokens include an expiration time and are validated on every protected request

This reflects the current implementation only — refresh tokens, OAuth/social login, and email verification are not implemented at this stage.

## DSA / Coding Practice

### Two Sum
- **Objective**: Find two numbers in an array that add up to a given target and return their indices.
- **Approach**: Use a dictionary (hash map) to store previously seen numbers along with their indexes while iterating through the array.
- For each number, calculate `complement = target - current number` and check whether the complement already exists in the dictionary.
- If found, the current index and the stored index form the answer; otherwise, the current number and its index are added to the dictionary and iteration continues.
- **Time Complexity**: O(n)
- **Space Complexity**: O(n)

### Longest Common Prefix
- **Objective**: Find the longest prefix string common to all strings in a given list.
- **Approach**: Take the first string as the initial prefix, then compare it against each subsequent string, shortening the prefix from the end whenever a mismatch is found, until it matches the start of every string (or becomes empty).
- **Time Complexity**: O(n * m), where n is the number of strings and m is the length of the shortest string
- **Space Complexity**: O(1) (excluding the output string)

**Learning from these problems**: dictionary lookup optimization, efficient searching using hash maps, string processing techniques, time/space complexity analysis, and general Python problem-solving.

## Learning Outcomes

- Implemented JWT authentication end-to-end, including login and logout
- Learned the practical difference between authentication and authorization
- Implemented password hashing and verification using Passlib/bcrypt
- Implemented protected React routes and protected FastAPI APIs as two separate layers of protection
- Implemented Admin/User role-based access control
- Learned to handle unauthorized and forbidden access correctly using 401 and 403 status codes
- Managed authentication state in React using Context
- Integrated Axios for authenticated API communication
- Practiced dictionary/hash-map-based optimization through the Two Sum problem
- Practiced string processing and complexity analysis through the Longest Common Prefix problem
- Strengthened Python problem-solving skills through DSA practice alongside full-stack development

## Challenges

- Integrating authentication into the existing BookNest project without breaking previously working features
- Maintaining consistent authentication state in React across page reloads and navigation
- Protecting frontend routes and backend APIs as two independent layers rather than relying on one alone
- Correctly handling JWT validation and token expiration
- Implementing Admin/User authorization cleanly using FastAPI dependencies
- Distinguishing between and correctly returning 401 vs 403 errors depending on the failure reason
- Managing password hashing and verification reliably with the correct bcrypt version
- Ensuring existing Main Library, Personal Library, Favorites, and Ratings functionality continued working correctly after authentication and authorization changes

## Future Enhancements

- Pagination for large book catalogs
- Email verification during registration
- Refresh token support alongside JWT access tokens
- Admin dashboard for managing users and viewing library statistics
- Notifications for due/overdue borrowed books

## Deliverables

- Fully functional Login and Logout with JWT-based authentication
- Protected React routes and protected FastAPI APIs
- Role-based access control with Admin/User roles
- Proper handling of unauthorized (401) and forbidden (403) access
- Documented authentication-related and protected APIs
- Two DSA problems solved and documented (Two Sum, Longest Common Prefix)
- Updated project documentation covering authentication, authorization, security, and learning outcomes
- Updated GitHub repository