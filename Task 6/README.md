# Task 6 – FastAPI, REST APIs & SQLite CRUD

## Task Overview

This task covers the fundamentals of backend API development using FastAPI. It includes setting up a FastAPI application with Uvicorn, understanding API routing, HTTP methods, REST APIs, JSON, and client-server communication. The task culminates in building a CRUD API connected to a SQLite database and testing the APIs using Postman, along with Python and DSA practice.

## Learning Goals

- Install and configure FastAPI and Uvicorn
- Understand FastAPI project structure
- Learn API routing and endpoints
- Understand REST API architecture
- Learn HTTP methods such as GET, POST, PUT, PATCH, and DELETE
- Understand JSON data exchange
- Understand client-server communication
- Connect FastAPI with a SQLite database
- Perform CRUD operations using SQLAlchemy
- Validate API request data using Pydantic
- Test APIs using Postman
- Practice Python and DSA problems
- Update and manage the project using GitHub

## Components

### FastAPI Fundamentals
- **FastAPI Installation** - Set up FastAPI and its development environment
- **Uvicorn** - Run the FastAPI application using an ASGI server
- **API Routing** - Create routes and endpoints for different operations
- **Basic APIs** - Build simple API endpoints using FastAPI
- **Automatic Documentation** - Use Swagger UI to view and test API endpoints

### REST APIs
- **REST API** - Understand how applications communicate using HTTP
- **GET** - Retrieve data from the server
- **POST** - Create new resources
- **PUT** - Completely update an existing resource
- **PATCH** - Partially update an existing resource
- **DELETE** - Remove an existing resource

### JSON
- **JSON** - Understand JSON as a data exchange format
- **Dictionary to JSON** - Understand how Python dictionaries are converted to JSON
- **JSON to Dictionary** - Understand conversion between JSON and Python objects
- **API Responses** - Return JSON data from FastAPI endpoints
- **Request Bodies** - Receive JSON data through POST, PUT, and PATCH requests

### Client-Server Architecture
- **Client** - Sends requests to the backend server
- **Server** - Processes requests and returns responses
- **HTTP Communication** - Understand request and response flow
- **Frontend-Backend Communication** - Understand how applications communicate with APIs

### SQLite & Database
- **SQLite** - Use a lightweight local database for storing application data
- **SQLAlchemy** - Connect FastAPI with SQLite and perform database operations
- **Database Model** - Define the structure of the users table
- **Database Session** - Create and manage database connections
- **CRUD Operations** - Create, Read, Update, and Delete database records

### Pydantic
- **Data Validation** - Validate incoming API request data
- **UserCreate** - Define data required when creating a user
- **UserUpdate** - Define data required for complete updates
- **UserPatch** - Define optional fields for partial updates

### Project – FastAPI CRUD Application
- **Home API** - Verify that the FastAPI server is running
- **Create User** - Add a new user to the SQLite database
- **Get Users** - Retrieve all users from the database
- **Get User** - Retrieve a specific user using its ID
- **Update User** - Completely update user information
- **Patch User** - Partially update user information
- **Delete User** - Remove a user from the database

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Check API status |
| POST | `/users` | Create a new user |
| GET | `/users` | Get all users |
| GET | `/users/{id}` | Get a specific user |
| PUT | `/users/{id}` | Completely update a user |
| PATCH | `/users/{id}` | Partially update a user |
| DELETE | `/users/{id}` | Delete a user |

## DSA - Python Practice

1. **Reverse a List** - Reverse the elements of a Python list
   - Uses list slicing
   - Input: List of numbers
   - Output: Reversed list

2. **Find Maximum Number** - Find the largest number in a list
   - Iterates through the list
   - Compares each element with the current maximum
   - Input: List of numbers
   - Output: Maximum number

3. **Merge Two Sorted Arrays** - Combine two sorted arrays into one sorted array
   - Uses the two-pointer technique
   - Compares elements from both arrays
   - Input: Two sorted arrays
   - Output: Merged sorted array

4. **Remove Duplicates** - Remove repeated elements from a list
   - Identifies unique elements
   - Maintains a list containing non-duplicate values
   - Input: List containing duplicate values
   - Output: List containing unique values

## API Testing – Postman

- **POST Testing** - Send JSON data to create users
- **GET Testing** - Retrieve stored users
- **PUT Testing** - Completely update user information
- **PATCH Testing** - Partially update user information
- **DELETE Testing** - Delete users from the database
- **Response Verification** - Check API responses and status codes
- **Postman Collection** - Store all API requests in a single collection

## Project Structure

```text
Task 6/
├── README.md
├── FastAPI/
│   ├── .gitignore
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── requirements.txt
│   └── database.db
