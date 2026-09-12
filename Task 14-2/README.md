# Task-14

# BookNest – Full-Stack Library Management Application

## Project Overview
BookNest is a full-stack library management application built with React on the frontend and FastAPI on the backend, backed by a PostgreSQL database. The application allows users to browse a shared Main Library, manage their own Personal Library (borrowing, downloading, and returning books), and interact with books through Favorites and Ratings.

This update extends the existing BookNest application based on new client requirements, adding authentication, role-based access control, and expanded personal library functionality on top of the previously implemented book management features.

## Features

- User registration and login with JWT-based authentication
- Role-based access control (Admin and User roles)
- Admin-only book Create, Update, and Delete operations
- Main Library for browsing all available books
- Personal Library per user (add, borrow, download, return, status/date tracking)
- User-specific Favorites
- User-specific Ratings, with an overall book rating calculated from all user ratings
- Search and filtering for books
- Protected React routes for authenticated pages
- Axios-based API communication with the FastAPI backend
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
- bcrypt

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

## Authentication and Authorization

**Registration**



Registration → Password Hashing (bcrypt) → PostgreSQL


**Login**

Protected Request → Bearer Token → FastAPI Validation → Authorization



Passwords are hashed using Passlib/bcrypt before being stored, and are never saved as plain text. On successful login, FastAPI issues a JWT access token, which the React frontend attaches to subsequent requests using the `Authorization: Bearer <token>` header. FastAPI dependencies validate the token and enforce authorization rules on protected endpoints.

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

Each entry tracks relevant status and dates, including when a book was added, borrowed, downloaded, and returned, so a user's library reflects their current interaction with each book.

## Favorites and Ratings

Favorites and Ratings are implemented as user-specific data rather than being shared across the application.

- Each user can favorite a book independently of other users.
- Each user can rate a book independently, and their rating does not overwrite or affect another user's rating for the same book.
- An overall rating for each book is calculated from the individual ratings submitted by all users.

This means the same book can be favorited and rated differently by different users at the same time.

## Database Structure

Books are **not duplicated** for each user. A single book record exists in the Main Library, and user-specific interactions are maintained through separate relationship tables, including:

- `favorites` – links users to the books they have favorited
- `ratings` – links users to the ratings they have given individual books
- `user_library` – links users to books in their Personal Library, along with status and date tracking (borrowed, downloaded, returned)

This structure keeps the book catalog centralized while still supporting independent, per-user state.

## Project Structure

```text
BookNest/
├── backend/
│   ├── main.py
│   ├── crud.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── auth.py
│   ├── dependencies.py
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── api/
│   └── .env
└── README.md
```

### Backend File Responsibilities
- **main.py** – FastAPI application, route registration, CORS configuration
- **crud.py** – database operations for books, favorites, ratings, and personal library entries
- **models.py** – SQLAlchemy models (User, Book, Favorite, Rating, UserLibrary)
- **schemas.py** – Pydantic schemas for request/response validation
- **database.py** – SQLAlchemy engine, session, and base model setup
- **auth.py** – password hashing, JWT generation and verification
- **dependencies.py** – FastAPI dependencies for current-user retrieval and role-based authorization

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


A `.env.example` file is provided with placeholder values, and `.env` is included in `.gitignore` to prevent credentials from being committed.

## Running the Application

### Run Backend
```bash
cd backend
uvicorn main:app --reload
```
Backend runs at: `http://localhost:8000`

### Run Frontend
```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:5173`

## API Testing

APIs were tested and documented using:

- **FastAPI Swagger UI** (`/docs`) – for exploring and testing endpoints directly from the browser
- **Thunder Client** – for manual request/response testing during development, including authentication headers and role-based access checks

## Security

- Passwords are hashed with bcrypt via Passlib and never stored as plain text
- JWT tokens are signed using a secret key stored in environment variables, not hardcoded
- Protected endpoints require a valid Bearer token
- Role-based authorization is enforced at the backend level for Admin-only operations
- Sensitive configuration (database credentials, JWT secret) is kept out of source control via `.gitignore`

## DSA / Coding Practice

### Merge Two Linked Lists
- Practiced merging two sorted linked lists into a single sorted linked list.
- Approach: iterative pointer manipulation, comparing node values from both lists and relinking nodes in order.
- Key data structure: Linked List
- Time Complexity: O(n + m)
- Space Complexity: O(1) (iterative, in-place relinking)

### Best Time to Buy and Sell Stock
- Practiced finding the maximum profit achievable from a single buy-sell transaction.
- Approach: single-pass traversal while tracking the minimum price seen so far and updating the maximum profit at each step.
- Key concept: tracking minimum buying price and maximum profit simultaneously
- Time Complexity: O(n)
- Space Complexity: O(1)

## Future Enhancements

- Pagination for large book catalogs
- Email verification during registration
- Refresh token support alongside JWT access tokens
- Admin dashboard for managing users and viewing library statistics
- Notifications for due/overdue borrowed books

## Learning Outcomes / Challenges

- Gained practical experience integrating React with FastAPI using Axios
- Implemented JWT-based authentication and role-based authorization end-to-end
- Learned to structure relationship tables to support per-user data without duplicating shared resources
- Handled backend-enforced authorization as opposed to frontend-only restrictions
- Practiced structuring a FastAPI backend into clear, responsibility-based modules
- Improved algorithmic thinking and time/space complexity analysis through DSA practice (Merge Two Linked Lists, Best Time to Buy and Sell Stock)
- Strengthened Python problem-solving skills through consistent DSA practice alongside full-stack development

## Deliverables

- Enhanced BookNest application with authentication and role-based access control
- Main Library and Personal Library functionality
- User-specific Favorites and Ratings
- Protected React routes and Axios-based API integration
- Search/filtering for books
- API documentation and testing via Swagger and Thunder Client
- Updated project documentation covering architecture, database design, APIs, security, and learning outcomes
- Two DSA problems solved and documented
- Updated GitHub repository
