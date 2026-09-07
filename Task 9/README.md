# Task 8 – React Hooks, React Router DOM, Multi-Page Routing & Dynamic UI

## Task Overview

This task focused on extending and scaling the **BookNest** full-stack application into a complete multi-page Single Page Application (SPA) using **React Router DOM**, modern **React Hooks (`useState`, `useEffect`)**, and dynamic client-side interactions.

The BookNest frontend was expanded from a basic two-view state into a fully routed client application featuring dedicated pages for **Landing, Library, Book Details, My Favorites, Ratings, and New Releases**. A responsive, persistent **Navigation Bar** was integrated, and reusable components like **StarRating** and enhanced **BookCard** were built to enable rich user interactions like dynamic favoriting, 1–5 star ratings, and real-time category filtering.

In parallel, the **FastAPI** backend and SQLite database were non-destructively enhanced with new models, schemas, and RESTful endpoints to persist user ratings, favorite collections, book descriptions, and date-sorted releases.

Along with React and full-stack development, core Data Structures & Algorithms (DSA) and Python problem solving were practiced, including **List Reversal, Finding the Maximum Value, Binary Search, and Valid Parentheses**.

---

## Learning Goals

- Master **React Hooks**: understand state management with `useState` and side effects with `useEffect`
- Understand the difference between `useState` and `useEffect`
- Master **React Router DOM** for client-side routing and Single Page Application (SPA) architecture
- Implement client-side navigation without full browser page reloads
- Create dynamic, route-driven pages using dynamic parameters (`useParams`)
- Design and build a persistent, responsive **Navigation Bar** using `NavLink` with active states
- Understand the **Component Lifecycle** in modern functional React and why Hooks replaced Class Components
- Build reusable UI components (**StarRating**, **BookCard**) for interactive user engagement
- Integrate dynamic full-stack CRUD, favorite toggling, and star ratings with a **FastAPI** backend
- Practice problem solving and DSA in Python:
  - Reverse a List
  - Find Maximum Value
  - Binary Search
  - Valid Parentheses

---

## Key Concepts & Architecture

### 1. React Hooks (`useState` & `useEffect`)

- **`useState`**:
  - Manages component-level state that changes over time based on user interactions (e.g., search queries, active category filters, rating selections, favorite status).
  - Triggers re-renders when state is updated, ensuring the UI reflects current application data.
- **`useEffect`**:
  - Manages side effects in functional components, such as fetching data from the FastAPI backend, subscribing to external data sources, and synchronizing state.
  - Controls execution timing via dependency arrays: runs on mount (`[]`), on specific state/prop changes (`[id]`), or cleanup on unmount.
- **Why Hooks Replaced Class Components**:
  - **Simplicity & Readability**: Eliminates `this` binding issues and boilerplate class syntax.
  - **Reusability**: Stateful logic can be extracted and shared via custom hooks.
  - **Colocation of Concerns**: Related logic (e.g., fetching and cleanup) stays together in one `useEffect` rather than split across `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`.

### 2. React Router DOM & Client-Side Routing

- **Single Page Application (SPA)**: The browser loads a single HTML document once. Route transitions update the DOM dynamically without white flashes or full-page server reloads.
- **`BrowserRouter`**: Wraps the application to provide HTML5 History API-based routing.
- **`Routes` & `Route`**: Defines declarative mappings between URL paths and page components.
- **`NavLink` & `Link`**: Handles internal navigation smoothly, providing active styling states for navigation menus.
- **`useParams`**: Extracts dynamic URL route parameters (e.g., extracting `id` from `/books/:id` on `BookDetailsPage`).

### 3. Star Rating & Favorites System

- **Reusable Star Rating (`StarRating.jsx`)**:
  - Interactive 1–5 star rating with hover preview, gold/amber active states, accessible tooltips, and numerical score badge.
  - Supports both interactive mode (to rate books) and read-only mode (for metric displays).
- **Dynamic Favorites**:
  - Direct favorite toggle on cards (`♡ Add to Favorites` → `♥ Favorited`) with optimistic UI updates.
  - Dedicated `/favorites` route displaying exclusively favorited books with instantaneous removal upon unfavoriting.

---

## Project Structure

```text
book-library-manager/
├── backend/
│   ├── books.db              # SQLite database (books, favorites, ratings)
│   ├── crud.py               # Database queries, enrichment, sorting & mutations
│   ├── database.py           # SQLAlchemy engine & session maker
│   ├── main.py               # FastAPI application, CORS & RESTful routes
│   ├── models.py             # SQLAlchemy models (Book, Favorite, Rating)
│   ├── schemas.py            # Pydantic validation schemas
│   ├── requirements.txt      # Python dependencies
│   └── venv/
│
└── frontend/
    └── frontend/
        ├── public/
        ├── src/
        │   ├── components/
        │   │   ├── BookCard.jsx       # Card displaying book, rating widget, details & favorite buttons
        │   │   ├── BookForm.jsx       # Modal form for adding/editing book details
        │   │   ├── Footer.jsx         # Global footer with branding and links
        │   │   ├── Header.jsx         # Persistent sticky navbar with NavLinks & mobile menu
        │   │   ├── Sidebar.jsx        # Category/genre filters and collection metrics
        │   │   └── StarRating.jsx     # Reusable interactive 1–5 star rating component
        │   │
        │   ├── pages/
        │   │   ├── LandingPage.jsx    # Hero landing page introducing BookNest
        │   │   ├── LibraryPage.jsx    # Complete catalog with search, filters, and CRUD
        │   │   ├── BookDetailsPage.jsx# Route /books/:id displaying full synopsis, rating & metadata
        │   │   ├── FavoritesPage.jsx  # Route /favorites showing exclusively favorited titles
        │   │   ├── RatingsPage.jsx    # Route /ratings showing books ordered from highest to lowest
        │   │   └── NewReleasesPage.jsx# Route /new-releases showing newest publications first
        │   │
        │   ├── App.css
        │   ├── App.jsx                # Client-side router configuration & layout
        │   ├── index.css              # Global styles & Tailwind imports
        │   └── main.jsx               # React DOM root render
        │
        ├── package.json
        ├── vite.config.js
        └── .env
```

---

## Application Routes

| Path | Page Component | Description |
| :--- | :--- | :--- |
| `/` | `LandingPage.jsx` | Welcome banner, features showcase, and call-to-action buttons |
| `/library` | `LibraryPage.jsx` | Full book collection, search bar, genre filter sidebar, and book addition |
| `/books/:id` | `BookDetailsPage.jsx` | Dynamic book view showing cover, synopsis, interactive ratings, and metadata |
| `/favorites` | `FavoritesPage.jsx` | Filtered view containing only user-favorited books with clean empty states |
| `/ratings` | `RatingsPage.jsx` | Top-rated showcase sorted by rating score with podium rank badges (`#1`, `#2`, `#3`) |
| `/new-releases` | `NewReleasesPage.jsx` | Collection sorted by publication year (newest releases first) |

---

## FastAPI Backend Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/books` | Retrieve all books with attached rating and favorite status |
| `GET` | `/books/{id}` | Retrieve single book details including synopsis, ratings, and favorite status |
| `POST` | `/books` | Add a new book to the library |
| `PUT` | `/books/{id}` | Update existing book information |
| `DELETE` | `/books/{id}` | Delete a book along with associated ratings and favorites |
| `GET` | `/favorites` | Retrieve all books currently in the user's favorites |
| `GET` | `/favorites/ids` | Retrieve list of favorited book IDs |
| `POST` | `/favorites/{id}` | Add book to favorites |
| `DELETE` | `/favorites/{id}` | Remove book from favorites |
| `POST` | `/books/{id}`/rating | Submit a 1–5 star rating for a book |
| `GET` | `/ratings` | Retrieve books sorted from highest rated to lowest |
| `GET` | `/new-releases` | Retrieve books sorted by newest publication year |

---

## Conceptual Review

### 1. Difference Between `useState` and `useEffect`

| Feature | `useState` | `useEffect` |
| :--- | :--- | :--- |
| **Purpose** | Declares and tracks reactive component state | Executes side effects (API calls, subscriptions, DOM mutations) |
| **Trigger** | Triggered explicitly by calling the state setter function | Runs automatically after render when dependencies change |
| **Return Value** | Array containing `[currentState, stateSetterFunction]` | Optional cleanup function returned to unsubscribe/cancel |
| **Timing** | Synchronously schedules a component re-render | Runs asynchronously after browser paint |

### 2. React Routing & Client-Side Navigation in SPAs

In traditional multi-page web applications, clicking a link requests a new HTML document from the server, causing a blank screen and full page reload.

In a Single Page Application using **React Router**:
1. Clicking a `<Link>` or `<NavLink>` intercepts the browser's default navigation event using `e.preventDefault()`.
2. The URL in the address bar is updated using the HTML5 `history.pushState()` API.
3. React Router matches the new URL path against configured `<Route>` elements.
4. The matching component is mounted into the DOM dynamically without reloading stylesheets, scripts, or application state.

---

## DSA & Python Practice

### 1. Reverse a List (`ListReversal.py`)

Reversing an array or list is a fundamental operation with applications in queue reversing, palindromes, and two-pointer algorithms.

```python
def reverse_list(arr):
    # Python slicing arr[::-1] achieves O(n) time and concise reversal
    return arr[::-1]

# Example usage:
arr = [1, 2, 3, 4, 5]
print("Reversed List:", reverse_list(arr))
# Output: [5, 4, 3, 2, 1]
```

- **Time Complexity**: $\mathcal{O}(n)$
- **Space Complexity**: $\mathcal{O}(n)$

---

### 2. Find Maximum Value (`FindMax.py`)

Iterating through a collection to locate the peak element without relying on built-in helpers.

```python
def find_max(arr):
    if not arr:
        return None

    maximum = arr[0]
    for num in arr:
        if num > maximum:
            maximum = num

    return maximum

# Example usage:
arr = [10, 25, 7, 40, 15]
print("Maximum Element:", find_max(arr))
# Output: 40
```

- **Time Complexity**: $\mathcal{O}(n)$
- **Space Complexity**: $\mathcal{O}(1)$

---

### 3. Binary Search (`BinarySearch.py`)

An efficient search algorithm operating on sorted sequences, cutting the search space in half with every step.

```python
def binary_search(arr, target):
    low = 0
    high = len(arr) - 1

    while low <= high:
        mid = (low + high) // 2

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1

    return -1

# Example usage:
arr = [1, 3, 5, 7, 9, 11]
target = 7
print(f"Target {target} found at index:", binary_search(arr, target))
# Output: 3
```

- **Time Complexity**: $\mathcal{O}(\log n)$
- **Space Complexity**: $\mathcal{O}(1)$

---

### 4. Valid Parentheses (`ValidParenthesis.py`)

A classic stack-based problem verifying that every opening bracket has an appropriate closing bracket in correct order.

```python
def is_valid(s):
    stack = []
    pairs = {
        ')': '(',
        '}': '{',
        ']': '['
    }

    for char in s:
        if char in pairs:
            # If closing bracket, check top of stack
            if not stack or stack.pop() != pairs[char]:
                return False
        else:
            # Push opening bracket
            stack.append(char)

    return len(stack) == 0

# Example usage:
s = "({[]})"
print(f"Is '{s}' valid?", is_valid(s))
# Output: True
```

- **Time Complexity**: $\mathcal{O}(n)$
- **Space Complexity**: $\mathcal{O}(n)$

---

## Deliverables Completed

1. **Multi-Page React Application**: Full client-side routing using `react-router-dom` across 6 distinct pages.
2. **Persistent Navigation Bar**: Extended `Header.jsx` with active link highlights and mobile navigation drawer.
3. **Dynamic User Interface**: Interactive 1–5 star rating system and real-time favorites toggle.
4. **FastAPI Backend Extensions**: REST endpoints for favorites, ratings, and release-year sorted queries.
5. **DSA & Python Implementations**: List Reversal, Maximum Value Search, Binary Search, and Valid Parentheses scripts.