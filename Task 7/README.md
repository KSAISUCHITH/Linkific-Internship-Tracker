# Task 7 – FastAPI, REST APIs, SQLite CRUD & DSA

## Task Overview

This task focused on learning backend API development using FastAPI, REST APIs, HTTP methods, JSON data exchange, client-server communication, SQLite database integration, SQLAlchemy, Pydantic validation, API testing using Postman, and Python & DSA practice.

As part of the practical work, a small full-stack CRUD application named **BookNest – Book Library Manager** was developed using React, FastAPI, and SQLite.

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
- Connect a React frontend with a FastAPI backend
- Test APIs using Postman and Swagger UI
- Practice Python and DSA problems
- Manage project files and dependencies

## Components

### FastAPI Fundamentals

- **FastAPI Installation** - Set up FastAPI and its development environment
- **Uvicorn** - Run the FastAPI application using an ASGI server
- **API Routing** - Create routes and endpoints for different operations
- **Basic APIs** - Create API endpoints using FastAPI
- **Automatic Documentation** - Use Swagger UI to view and test API endpoints

### REST APIs

- **REST API** - Understand communication between applications using HTTP
- **GET** - Retrieve data from the server
- **POST** - Create new resources
- **PUT** - Completely update an existing resource
- **PATCH** - Partially update an existing resource
- **DELETE** - Remove an existing resource

### JSON

- **JSON** - Understand JSON as a data exchange format
- **Dictionary to JSON** - Understand conversion between Python dictionaries and JSON
- **JSON to Dictionary** - Understand conversion between JSON and Python objects
- **API Responses** - Return JSON data from FastAPI endpoints
- **Request Bodies** - Receive JSON data through API requests

### Client-Server Architecture

- **Client** - React frontend sends requests to the backend
- **Server** - FastAPI processes requests and returns responses
- **HTTP Communication** - Understand request and response flow
- **Frontend-Backend Communication** - Connect the React frontend with FastAPI APIs
- **Environment Variables** - Configure API URLs using `.env` files

### SQLite & Database

- **SQLite** - Use a lightweight local database for persistent data storage
- **SQLAlchemy** - Connect FastAPI with SQLite and perform database operations
- **Database Model** - Define the structure of the books table
- **Database Session** - Create and manage database connections
- **CRUD Operations** - Create, Read, Update, and Delete database records
- **Persistent Storage** - Store book data so that it remains available after refreshing the application

### Pydantic

- **Data Validation** - Validate incoming API request data
- **BookCreate** - Define the data required when creating a book
- **BookResponse** - Define the structure of API responses
- **Field Validation** - Ensure incoming book data follows the required data types

### Project – BookNest CRUD Application

- **Landing Page** - Create a landing page for the BookNest application
- **Library Page** - Display and manage the book collection
- **Create Book** - Add a new book to the SQLite database
- **Get Books** - Retrieve all books from the database
- **Get Book** - Retrieve a specific book using its ID
- **Update Book** - Update existing book information
- **Delete Book** - Remove a book from the database
- **Search Books** - Search books by title or author
- **Book Cover Upload** - Upload and display book cover images
- **Frontend Integration** - Connect the React frontend with the FastAPI backend

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Check API status |
| POST | `/books` | Create a new book |
| GET | `/books` | Get all books |
| GET | `/books/{book_id}` | Get a specific book |
| PUT | `/books/{book_id}` | Update a book |
| DELETE | `/books/{book_id}` | Delete a book |

## Frontend Features

- **Landing Page** - Introduces the BookNest application
- **Library Dashboard** - Displays the stored book collection
- **Add Book** - Opens a form to add a new book
- **Edit Book** - Allows existing book information to be modified
- **Delete Book** - Removes a book after confirmation
- **Search** - Search the collection by book title or author
- **Book Cards** - Display book details in an organized layout
- **Image Upload** - Upload a book cover from the local computer
- **Navigation** - Navigate between the landing page and library page

## Backend Features

- **FastAPI Server** - Provides the backend API
- **REST Endpoints** - Handles book-related operations
- **SQLite Database** - Provides persistent local storage
- **SQLAlchemy ORM** - Handles database operations
- **Pydantic Schemas** - Validates API request and response data
- **CORS Configuration** - Allows communication between the React frontend and FastAPI backend
- **Environment Configuration** - Uses `.env` for database and frontend configuration


## DSA - Python Practice

1. **Valid Parentheses**
   - Check whether brackets are properly balanced using a stack
   - Handles `()`, `{}`, and `[]`

2. **Linear Search**
   - Search for an element by checking each element sequentially
   - Return the index if the element is found

3. **Binary Search**
   - Search for an element in a sorted list by repeatedly dividing the search range into two halves