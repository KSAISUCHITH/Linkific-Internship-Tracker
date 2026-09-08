# Task 10 – Full-Stack CRUD Application, FastAPI Routing, React Integration & DSA

## Task Overview

This task focused on building an end-to-end full-stack application called **Food Menu Manager** to demonstrate complete **CRUD (Create, Read, Update, Delete)** operations by connecting a **React (Vite)** frontend with a **FastAPI** backend using RESTful APIs.

The backend was structured following modern software engineering best practices by cleanly separating concerns into modular files: database configuration (`database.py`), SQLAlchemy ORM database models (`models.py`), Pydantic validation schemas (`schemas.py`), and modular endpoint routing (`routes/foods.py` using FastAPI's `APIRouter`). SQLite (`food_menu.db`) was configured as the local persistence layer.

The frontend was developed using **React** with a clean, functional UI in Vanilla CSS. It connects to the FastAPI backend using the native browser **Fetch API**, with Cross-Origin Resource Sharing (**CORS**) enabled. The application provides dynamic user feedback, client-side and server-side validation, form pre-population for editing, and interactive deletion confirmations.

In addition to full-stack development, core Data Structures & Algorithms (DSA) and Python problem-solving were practiced, including **Dictionary CRUD Operations, Finding the Second Largest Number, Merging Sorted Arrays, and Array Rotation**.

---

## Learning Goals

- Master **CRUD Operations** across the entire web stack (Database $\leftrightarrow$ Backend $\leftrightarrow$ Frontend)
- Understand **API Architecture** and client-server request-response lifecycles
- Organize a scalable backend folder structure with clean separation of concerns
- Learn **FastAPI APIRouter** for modular route organization
- Differentiate between SQLAlchemy **Models** (database tables) and Pydantic **Schemas** (data validation & serialization)
- Understand **REST API** fundamentals and core HTTP methods (`GET`, `POST`, `PUT`, `DELETE`)
- Master standard **HTTP Status Codes** (`200 OK`, `201 Created`, `404 Not Found`, `422 Unprocessable Entity`)
- Test and document APIs using **Postman** and interactive **Swagger UI** (`/docs`)
- Connect a **React** frontend to a **FastAPI** backend using native browser `fetch`
- Configure **CORS (Cross-Origin Resource Sharing)** to allow cross-port localhost communication
- Practice problem solving and DSA in Python:
  - Python Dictionary CRUD operations
  - Find the Second Largest Number in an array
  - Merge Two Sorted Arrays using two pointers
  - Array Rotation (Left and Right rotation)

---

## Key Concepts & Architecture

### 1. What is a REST API?

A **REST (Representational State Transfer) API** is an architectural style for building networked applications. It uses standard HTTP protocols and stateless communication to allow clients (like a React web app) to create, read, update, and delete resources on a server.

### 2. HTTP Methods & CRUD Mapping

| CRUD Operation | HTTP Verb | FastAPI Route | Status Code | Description |
| :--- | :--- | :--- | :--- | :--- |
| **C**REATE | `POST` | `/api/foods` | `201 Created` | Inserts a new food item into SQLite |
| **R**EAD (All) | `GET` | `/api/foods` | `200 OK` | Retrieves all food items from the menu |
| **R**EAD (One) | `GET` | `/api/foods/{id}` | `200 OK` / `404` | Retrieves a single item by unique ID |
| **U**PDATE | `PUT` | `/api/foods/{id}` | `200 OK` / `404` | Updates an existing food item by ID |
| **D**ELETE | `DELETE` | `/api/foods/{id}` | `200 OK` / `404` | Removes a food item from the database |

### 3. Request & Response Lifecycle & Status Codes

- **Request**: Sent from React via `fetch()`, containing HTTP method, target URL, optional headers (`Content-Type: application/json`), and request body (JSON payload).
- **Response**: Returned by FastAPI with an HTTP status code, response headers, and serialised JSON data.
- **Common HTTP Status Codes**:
  - `200 OK`: Standard response for successful `GET`, `PUT`, or `DELETE` requests.
  - `201 Created`: Standard response indicating a new resource was successfully created via `POST`.
  - `400 Bad Request`: Client provided malformed input data.
  - `404 Not Found`: The requested resource ID does not exist in the database.
  - `422 Unprocessable Entity`: Automatic FastAPI/Pydantic validation failure (e.g., negative price or missing required field).

### 4. Backend Architecture & Separation of Concerns

```
backend/
├── database.py   → Engine creation, SessionLocal factory, get_db dependency, and DB seeding
├── models.py     → SQLAlchemy ORM classes mapping directly to SQLite database tables
├── schemas.py    → Pydantic schemas validating incoming data & serializing API responses
├── routes/       → Modular APIRouter separating endpoint handlers from the main application
└── main.py       → App entrypoint, CORS configuration, lifespan events, and router registration
```

- **Models vs Schemas**:
  - **SQLAlchemy Models (`models.py`)**: Define the physical database structure, columns, types, and primary keys stored in SQLite (`food_menu.db`).
  - **Pydantic Schemas (`schemas.py`)**: Define the data contracts for client communication, performing type conversion, field constraints (`min_length`, `gt=0`), and response filtering.

### 5. Frontend & React-FastAPI Integration

- **State Management**: React `useState` hooks store the menu list, current form values (`name`, `category`, `price`), active editing ID (`editingId`), and notification alerts (`message`).
- **Data Fetching**: A `useEffect` hook triggers `fetchFoods()` on initial component mount.
- **Edit Mode**: Clicking "Edit" populates the input form, toggles the button to "Update Food", and displays a "Cancel" button.
- **Delete Confirmation**: Deletion triggers a native confirmation dialog before sending the `DELETE` request.
- **CORS Configuration**: FastAPI uses `CORSMiddleware` in `main.py` allowing origins like `http://localhost:5173` to make cross-origin REST requests.

---

## Project Structure

```text
Task 10/
├── ArrayRotation.py           # DSA: Left and right array rotation
├── MergeSorted.py             # DSA: Merging two sorted lists
├── SecondLargest.py           # DSA: Finding second largest element
├── README.md                  # Task 10 comprehensive documentation
│
└── CRUD-APP/                  # Full-stack Food Menu Manager application
    ├── backend/
    │   ├── database.py        # SQLAlchemy engine, session & init_db
    │   ├── models.py          # SQLAlchemy Food table model
    │   ├── schemas.py         # Pydantic validation schemas
    │   ├── main.py            # FastAPI entry point & CORS configuration
    │   ├── requirements.txt   # Python backend dependencies
    │   └── routes/
    │       ├── __init__.py    # Package marker
    │       └── foods.py       # APIRouter CRUD endpoints
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── App.jsx        # Main React CRUD component
    │   │   ├── App.css        # Clean, minimal CSS
    │   │   └── main.jsx       # React application entry point
    │   ├── index.html         # HTML template
    │   ├── vite.config.js     # Vite configuration (port 5173)
    │   └── package.json       # Frontend dependencies & scripts
    │
    └── README.md              # Project-level quick start guide
```

---

## How to Run the Application

### 1. Running the Backend (FastAPI)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd "Task 10/CRUD-APP/backend"
   ```

2. Create and activate a Python virtual environment:
   - **Windows:**
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS / Linux:**
     ```bash
     python -m venv venv
     source venv/bin/activate
     ```

3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI server with auto-reload:
   ```bash
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```
   - API Server: `http://127.0.0.1:8000`
   - Interactive Swagger Docs: `http://127.0.0.1:8000/docs`

---

### 2. Running the Frontend (React + Vite)

1. Open a separate terminal and navigate to the frontend directory:
   ```bash
   cd "Task 10/CRUD-APP/frontend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   - Application URL: `http://127.0.0.1:5173`

---

## API Testing (Postman & Swagger)

FastAPI automatically generates interactive OpenAPI documentation accessible at `http://127.0.0.1:8000/docs`.

### Testing Workflow:
1. **Health Check**: `GET http://127.0.0.1:8000/` $\rightarrow$ returns `{"message": "Food Menu API is running"}`
2. **List Items**: `GET http://127.0.0.1:8000/api/foods` $\rightarrow$ returns array of all menu items
3. **Create Item**: `POST http://127.0.0.1:8000/api/foods` with JSON body:
   ```json
   {
     "name": "Paneer Roll",
     "category": "Rolls",
     "price": 180.0
   }
   ```
   $\rightarrow$ returns `201 Created` with generated `id`.
4. **Get by ID**: `GET http://127.0.0.1:8000/api/foods/1` $\rightarrow$ returns single food object.
5. **Update Item**: `PUT http://127.0.0.1:8000/api/foods/1` with updated fields $\rightarrow$ returns updated food object.
6. **Delete Item**: `DELETE http://127.0.0.1:8000/api/foods/1` $\rightarrow$ returns `{"message": "Food item with id 1 deleted successfully"}`.

---

## DSA / Python Practice

### 1. Dictionary CRUD Operations

Practicing in-memory dictionary CRUD operations in Python:

```python
# In-memory dictionary data store
food_menu = {}

# CREATE: Add a new key-value pair
food_menu[1] = {"name": "Margherita Pizza", "category": "Pizza", "price": 250.0}
food_menu[2] = {"name": "Veg Burger", "category": "Burger", "price": 150.0}

# READ: Access an item by key
print("Item 1:", food_menu.get(1))

# UPDATE: Modify an existing item
if 2 in food_menu:
    food_menu[2]["price"] = 160.0

# DELETE: Remove an item
removed_item = food_menu.pop(1, None)
print("Removed:", removed_item)
print("Final Dictionary:", food_menu)
```

- **Time Complexity**:
  - Insert / Update: $\mathcal{O}(1)$ average
  - Lookup by Key: $\mathcal{O}(1)$ average
  - Delete by Key: $\mathcal{O}(1)$ average
- **Space Complexity**: $\mathcal{O}(n)$

---

### 2. Find the Second Largest Number (`SecondLargest.py`)

Finds the second largest value in an unsorted list in a single pass without sorting:

```python
numbers = [10, 25, 8, 40, 30]

largest = 0
second_largest = 0

for num in numbers:
    if num > largest:
        second_largest = largest
        largest = num
    elif num > second_largest and num != largest:
        second_largest = num

print("Second largest:", second_largest)
# Output: Second largest: 30
```

- **Time Complexity**: $\mathcal{O}(n)$ — single linear pass through the array.
- **Space Complexity**: $\mathcal{O}(1)$ — constant extra memory using two tracking variables.

---

### 3. Merge Sorted Arrays (`MergeSorted.py`)

Merges two pre-sorted lists into a single sorted list using a two-pointer technique:

```python
def merge(arr1, arr2):
    i = 0
    j = 0
    result = []

    while i < len(arr1) and j < len(arr2):
        if arr1[i] <= arr2[j]:
            result.append(arr1[i])
            i += 1
        else:
            result.append(arr2[j])
            j += 1

    result.extend(arr1[i:])
    result.extend(arr2[j:])

    return result

arr1 = [1, 3, 5]
arr2 = [2, 4, 6]

print(merge(arr1, arr2))
# Output: [1, 2, 3, 4, 5, 6]
```

- **Time Complexity**: $\mathcal{O}(n + m)$ where $n$ and $m$ are the lengths of the two arrays.
- **Space Complexity**: $\mathcal{O}(n + m)$ for the output list.

---

### 4. Array Rotation (`ArrayRotation.py`)

Rotates an array by $k$ positions both to the right and to the left using Python list slicing:

```python
arr = [1, 2, 3, 4, 5]
k = int(input("Enter the number of positions to rotate: "))

# Right rotation: last k elements move to the front
rotated_right = arr[-k:] + arr[:-k]

# Left rotation: first k elements move to the end
rotated_left = arr[k:] + arr[:k]

print("Right Rotation:", rotated_right)
print("Left Rotation:", rotated_left)
```

- **Time Complexity**: $\mathcal{O}(n)$ due to list slicing and concatenation.
- **Space Complexity**: $\mathcal{O}(n)$ to store the new rotated lists.

---

## Deliverables Completed

1. **Full-Stack CRUD Application**: Built the **Food Menu Manager** featuring full Create, Read, Update, and Delete capabilities.
2. **Modular FastAPI Backend**: Implemented structured backend architecture with `APIRouter`, SQLAlchemy ORM, Pydantic schemas, and SQLite persistence (`food_menu.db`).
3. **Responsive React Frontend**: Built interactive React UI using Fetch API, with client validation, edit mode, delete confirmation, and feedback banners.
4. **CORS & Integration**: Enabled cross-origin requests between React (port 5173) and FastAPI (port 8000).
5. **API Documentation**: Automated Swagger UI at `/docs` and verified REST endpoints.
6. **DSA Implementations**: Completed scripts for Dictionary CRUD, Second Largest Number, Merge Sorted Arrays, and Array Rotation.
7. **Clean Codebase**: Removed all unnecessary comments and refined header layout as requested.
