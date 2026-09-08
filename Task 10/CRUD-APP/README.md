# Food Menu Manager (CRUD Application)

A beginner-friendly full-stack application built to demonstrate **CRUD** (Create, Read, Update, Delete) operations using **React** (Vite) on the frontend and **FastAPI** (with **SQLAlchemy** and **SQLite**) on the backend.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technologies Used](#technologies-used)
3. [Project Structure](#project-structure)
4. [How to Run the Backend](#how-to-run-the-backend)
5. [How to Run the Frontend](#how-to-run-the-frontend)
6. [API Endpoints](#api-endpoints)
7. [CRUD Operations Mapping](#crud-operations-mapping)
8. [How React Communicates with FastAPI](#how-react-communicates-with-fastapi)

---

## 1. Project Overview

The **Food Menu Manager** allows restaurant owners or staff to manage their food menu items. Each food item consists of:
- **id**: Unique identifier (auto-incremented integer)
- **name**: Food item name (e.g., "Margherita Pizza")
- **category**: Category name (e.g., "Pizza", "Burger", "Beverage")
- **price**: Item price (e.g., 250.00)

When the backend starts up for the first time, it automatically initializes the SQLite database (`food_menu.db`) and seeds three default food items if empty:
1. *Margherita Pizza* (Pizza) - ₹250
2. *Veg Burger* (Burger) - ₹150
3. *Cold Coffee* (Beverage) - ₹120

---

## 2. Technologies Used

### Frontend
- **React (v18)** - Component-based UI library
- **Vite** - High-performance local development server and bundler
- **JavaScript (ES6+)** - Logic and DOM interactions
- **Vanilla CSS** - Clean, responsive, and lightweight styling without bulky frameworks
- **Fetch API** - Native browser API for HTTP communication with backend

### Backend
- **Python (3.10+)** - Backend language
- **FastAPI** - Modern, high-performance web framework for building RESTful APIs
- **Uvicorn** - Lightning-fast ASGI web server
- **SQLAlchemy** - Python SQL toolkit and Object-Relational Mapper (ORM)
- **SQLite** - Serverless, file-based relational database (`food_menu.db`)
- **Pydantic** - Data validation and settings management using Python type hints
- **FastAPI APIRouter** - Modular routing for clean code separation

---

## 3. Project Structure

```
food-menu-manager/
│
├── backend/
│   ├── main.py              # FastAPI app setup, CORS, lifespan, and root endpoint
│   ├── database.py          # SQLAlchemy engine, session maker, get_db, and DB seeder
│   ├── models.py            # SQLAlchemy 'Food' database table model
│   ├── schemas.py           # Pydantic schemas (FoodCreate, FoodUpdate, FoodResponse)
│   ├── requirements.txt     # Python dependencies
│   └── routes/
│       ├── __init__.py      # Package marker
│       └── foods.py         # APIRouter containing all CRUD endpoints
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component (CRUD handlers, form, and table)
│   │   ├── main.jsx         # React application entry point
│   │   └── App.css          # Clean, minimal CSS styling
│   ├── index.html           # HTML template
│   ├── vite.config.js       # Vite configuration
│   └── package.json         # Frontend dependencies and scripts
│
└── README.md                # Project documentation
```

---

## 4. How to Run the Backend

### Step 1: Navigate to the backend folder
```bash
cd backend
```

### Step 2: Create a virtual environment
```bash
python -m venv venv
```

### Step 3: Activate the virtual environment
- **Windows (Command Prompt / PowerShell):**
  ```powershell
  .\venv\Scripts\activate
  ```
- **macOS / Linux:**
  ```bash
  source venv/bin/activate
  ```

### Step 4: Install dependencies
```bash
pip install -r requirements.txt
```
*(or manually: `pip install fastapi uvicorn sqlalchemy pydantic`)*

### Step 5: Start the FastAPI development server
```bash
uvicorn main:app --reload
```
The backend will run at: **http://127.0.0.1:8000**  
Interactive API Docs (Swagger UI): **http://127.0.0.1:8000/docs**

---

## 5. How to Run the Frontend

### Step 1: Open a new terminal and navigate to the frontend folder
```bash
cd frontend
```

### Step 2: Install npm dependencies
```bash
npm install
```

### Step 3: Start the Vite development server
```bash
npm run dev
```
The React frontend will run at: **http://localhost:5173**

---

## 6. API Endpoints

All food-related endpoints are grouped under the `/api` prefix:

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | API health check message | `200 OK` |
| `GET` | `/api/foods` | Get all food items | `200 OK` |
| `GET` | `/api/foods/{id}` | Get a single food item by ID | `200 OK` (or `404`) |
| `POST` | `/api/foods` | Create a new food item | `201 Created` |
| `PUT` | `/api/foods/{id}` | Update an existing food item | `200 OK` (or `404`) |
| `DELETE` | `/api/foods/{id}` | Delete a food item | `200 OK` (or `404`) |

---

## 7. CRUD Operations Mapping

| Operation | HTTP Verb | FastAPI Route | React Handler | Description |
| :--- | :--- | :--- | :--- | :--- |
| **C**REATE | `POST` | `/api/foods` | `handleSubmit` (add mode) | Inserts a new food item into SQLite |
| **R**EAD | `GET` | `/api/foods` | `fetchFoods` | Fetches all items on page load and after changes |
| **U**PDATE | `PUT` | `/api/foods/{id}` | `handleSubmit` (edit mode) | Updates item details by its ID |
| **D**ELETE | `DELETE` | `/api/foods/{id}` | `handleDelete` | Removes item after confirmation dialog |

---

## 8. How React Communicates with FastAPI

1. **REST APIs & Fetch**:
   - The React UI uses standard browser `fetch()` to send HTTP requests to `http://127.0.0.1:8000/api/foods`.
   - Data is exchanged using standard JSON payloads (with `'Content-Type': 'application/json'`).

2. **CORS (Cross-Origin Resource Sharing)**:
   - Since the React frontend runs on port `5173` and the FastAPI backend runs on port `8000`, the backend uses `CORSMiddleware` in `main.py` to permit cross-origin requests.

3. **Data Flow**:
   ```
   [User Action] 
         │
         ▼
   [React State (useState)] 
         │  (fetch request)
         ▼
   [FastAPI APIRouter (/api/foods)] 
         │  (Pydantic validation)
         ▼
   [SQLAlchemy ORM (models.py)] 
         │  (SQL queries)
         ▼
   [SQLite Database (food_menu.db)]
   ```
