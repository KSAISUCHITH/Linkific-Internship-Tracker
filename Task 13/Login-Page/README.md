# Task 13 – JWT Authentication 

## Project Overview
For this internship task, a standalone JWT Authentication application was developed using React for the frontend and FastAPI for the backend. The application demonstrates a complete authentication and authorization workflow using JWT tokens, password hashing, protected APIs, and protected React routes.

This is a separate authentication project and is not part of the BookNest application.

The application uses a local PostgreSQL database to store registered users. Passwords are securely hashed before being stored. After a successful login, the FastAPI backend generates a JWT access token, which the React frontend stores and uses when accessing protected backend APIs.

**Architecture:**

React → Axios → FastAPI → SQLAlchemy → PostgreSQL


**Authenticated requests:**

React → Axios + JWT Bearer Token → FastAPI → JWT Verification → SQLAlchemy → PostgreSQL


## Learning Goals
- Understand authentication and authorization workflows
- Implement secure password hashing with bcrypt
- Generate, verify, and expire JWT tokens
- Build protected FastAPI endpoints
- Build protected React routes
- Integrate Axios for frontend-backend communication
- Handle errors gracefully across frontend and backend
- Practice string-based DSA problems

## Technologies Used

### Frontend
- React
- JavaScript
- Axios
- React Router
- CSS

### Backend
- Python
- FastAPI
- Pydantic
- SQLAlchemy
- JWT
- bcrypt
- CORS

### Database
- PostgreSQL

### Configuration
- .env environment variables
- .gitignore

## Database

A dedicated PostgreSQL database, `jwt_auth_db`, was created for this application, separate from the existing BookNest database.

A `users` table is created via SQLAlchemy with:
- id (primary key)
- username (unique)
- email (unique)
- password_hash

jwt_auth_db
│
└── users
├── id
├── username
├── email
└── password_hash



## Environment Variables

Sensitive configuration is kept out of source code using a `.env` file, including:
- PostgreSQL database URL
- JWT secret key
- JWT algorithm
- JWT expiration time

A `.env.example` file provides placeholder values, and `.env` is included in `.gitignore`. The frontend also uses an environment variable for the FastAPI backend URL.

## Project Structure
```text
Task 13/
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── requirements.txt
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── auth.py
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Home.jsx
│   │   ├── api/
│   │   │   └── axios.js
│   │   └── routes/
│   │       └── ProtectedRoute.jsx
│   └── .env
├── dsa_practice/
│   ├── longest_common_prefix.py
│   └── valid_anagram.py
└── README.md
```

## Backend Structure
- **main.py** - FastAPI app, CORS, registration/login/protected endpoints, DB init
- **database.py** - SQLAlchemy engine, session, base model, DB dependency
- **models.py** - SQLAlchemy `User` model
- **schemas.py** - Pydantic schemas for registration, login, JWT response, user response
- **auth.py** - Password hashing/verification, JWT generation/decoding/validation, current-user authentication

## Core Features

### User Registration

User → React Register Page → Axios POST → FastAPI /register
→ Validate Data → Check Existing Username/Email
→ Hash Password → Store User → PostgreSQL

Duplicate usernames or emails are rejected with an appropriate error.

### Password Hashing
Passwords are never stored as plain text. Each password is hashed using bcrypt before being saved, and the original password cannot be retrieved from the stored hash.

Plain Password → bcrypt → Password Hash → PostgreSQL


### User Login

User → React Login Page → Axios POST /login → FastAPI
→ Find User → Verify Password Hash → Generate JWT → Return JWT to React

Incorrect credentials return a generic authentication error without revealing whether the username or password was wrong.

### JWT Authentication
After login, FastAPI generates a JWT containing user identity information and an expiration time, signed using a secret key and algorithm from environment variables.


Login → JWT Generated → Returned to React → Stored
→ Sent With Protected Requests → Verified by FastAPI → Access Granted

### JWT Verification
Protected endpoints extract the token from the `Authorization: Bearer <JWT>` header, decode and verify it, check expiration, and identify the user. Invalid or expired tokens return `401 Unauthorized`.

### Protected API
The `/me` endpoint returns the authenticated user's data:


GET /me

- No token → `401 Unauthorized`
- Valid token → returns id, username, email

## React Frontend

Three main routes:
- `/login` - authenticate existing users
- `/register` - create new accounts
- `/home` - protected page shown after authentication, displaying a welcome message with the username

## Axios Integration
A reusable Axios instance is configured with the FastAPI backend URL for registration, login, and protected requests. No direct connection exists between React and PostgreSQL.

### Axios JWT Interceptor
A request interceptor automatically attaches the stored JWT to outgoing requests:

React API Request → Axios Interceptor → Retrieve JWT → Add Authorization Header → FastAPI



## Protected React Routes
The `/home` route checks authentication before rendering. Unauthenticated users are redirected to `/login`. On app start, the JWT is verified against the backend `/me` endpoint rather than trusting local storage alone.

## Loading States
Loading indicators (e.g. "Logging in...", "Creating account...", "Checking authentication...") are shown during API calls, with buttons disabled to prevent duplicate submissions. A `finally` block resets loading state regardless of outcome.

## Error Handling
User-friendly messages are shown for:
- Invalid credentials
- Duplicate username
- Duplicate email
- Backend unavailable
- Invalid/expired JWT
- Database failure

Sensitive details (credentials, tracebacks, JWT secrets) are never exposed to the user.

### Database Connection Error Flow

React → Axios Request → FastAPI → Attempt DB Operation
→ PostgreSQL Unavailable → FastAPI Handles Error
→ Safe Error Response → React Error Message

## Logout

Authenticated User → Logout → Remove JWT → Clear Auth State → Redirect to Login


After logout, `/home` is no longer accessible.

## CORS
React (`http://localhost:5173`) and FastAPI (`http://localhost:8000`) run on different ports, so FastAPI is configured to allow requests from the frontend origin.

## DSA / Python Practice
- **Password Hashing** - implemented and understood why passwords must be hashed
- **String Comparison** - comparing strings for equality
- **Longest Common Prefix** - find the longest shared prefix across a list of strings
- **Valid Anagram** - check whether two strings contain the same characters with the same frequency


## Testing Performed
- **Registration** - new user creation, hashed password storage, duplicate username/email rejection
- **Login** - valid credentials, incorrect password, non-existent username, JWT generation
- **Protected API** - `/me` with no token, invalid token, expired token, valid token
- **Protected Frontend** - unauthenticated redirect, successful login/navigation, refresh persistence, logout
- **Error Handling** - FastAPI stopped, PostgreSQL stopped, PostgreSQL restarted

## Technologies Recap
- **Language**: Python 3, JavaScript
- **Frontend**: React, Axios, React Router
- **Backend**: FastAPI, Pydantic, SQLAlchemy, bcrypt, JWT
- **Database**: PostgreSQL
- **Tools**: VS Code, Git, GitHub

## Learning Outcomes
- Authentication and authorization
- User registration and login
- Password hashing and verification
- JSON Web Tokens and expiration
- Bearer authentication
- Protected APIs and protected React routes
- Axios API communication and interceptors
- CORS configuration
- Loading states and API/database error handling
- SQLAlchemy ORM and PostgreSQL integration
- Environment variables and secure credential management
- React Router and session/logout handling
- Longest Common Prefix and Valid Anagram problems

## Deliverables
- Functional Registration and Login pages
- PostgreSQL database for user storage
- SQLAlchemy database integration
- Secure bcrypt password hashing
- JWT-based authentication with protected FastAPI APIs
- Protected React routes
- Axios-based frontend-backend communication with automatic JWT authorization
- Welcome page displaying the authenticated username
- Logout functionality
- Loading indicators and user-friendly error messages
- Backend/database failure handling
- .env configuration and .gitignore protection
- DSA practice using Python
- Updated GitHub repository