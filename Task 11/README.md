# Task 11 – PostgreSQL Integration, FastAPI CRUD, React Integration & DSA

## Task Overview

This task focused on updating the existing **BookNest** full-stack application to use **PostgreSQL** as the database instead of SQLite. The existing application structure and database models were maintained while replacing the database connection with a locally running PostgreSQL database.

The backend uses **FastAPI** for REST API development, **SQLAlchemy** for ORM-based database interaction, and **Pydantic** for request validation and response serialization. PostgreSQL is used as the persistent database layer for storing BookNest application data.

The application supports complete **CRUD (Create, Read, Update, Delete)** operations. Records can be created, retrieved, updated, and deleted through FastAPI REST endpoints and the changes are persisted in PostgreSQL.

The task also covered fundamental database concepts such as SQL vs NoSQL, tables, primary keys, foreign keys, database relationships, and the difference between in-memory Python dictionaries and persistent databases.

In addition to backend and database development, Python DSA problems were practiced, including **Finding the Missing Number** and **Maximum Subarray**.

---

## Learning Goals

- Understand **PostgreSQL** installation and local database configuration
- Connect a **FastAPI** backend with PostgreSQL
- Use **SQLAlchemy ORM** to interact with PostgreSQL
- Create database tables using existing SQLAlchemy models
- Understand **Primary Keys** and **Foreign Keys**
- Understand different **Database Relationships**
- Implement **CRUD Operations** using FastAPI and PostgreSQL
- Understand **SQL** and basic SQL database operations
- Understand the difference between **SQL and NoSQL databases**
- Understand the difference between a Python **Dictionary and Database**
- Understand persistent data storage
- Retrieve and update records from PostgreSQL
- Connect the React frontend with the FastAPI backend
- Practice Python problem solving and DSA:
  - Find the Missing Number
  - Maximum Subarray

---

## Key Concepts & Architecture

### 1. PostgreSQL

**PostgreSQL** is an open-source relational database management system used to store and manage structured application data.

Unlike an in-memory Python dictionary, PostgreSQL provides persistent storage, meaning data remains available even after the application is stopped or restarted.

BookNest uses PostgreSQL as its local database.

---

### 2. FastAPI–PostgreSQL Architecture

The BookNest application follows this architecture:

```text
React Frontend
      ↓
FastAPI REST API
      ↓
SQLAlchemy ORM
      ↓
PostgreSQL Database