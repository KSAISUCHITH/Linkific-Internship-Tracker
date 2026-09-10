# Task 12 – Connecting BookNest React Frontend to FastAPI with Axios

**Date:** 10/09/2026
**Project:** BookNest

## Task Overview

This task focused on connecting the existing **BookNest** React frontend with the existing **FastAPI** backend using **Axios**. The backend was already connected to a local **PostgreSQL** database through **SQLAlchemy** from previous work, so today's focus was purely on the frontend-to-backend communication layer.

The React application was updated to communicate with the existing FastAPI REST APIs using **Axios** instead of the previously used Fetch API. Axios was configured for making `GET`, `POST`, `PUT`, and `DELETE` requests for the existing BookNest features, with proper loading states and error handling added throughout.

Alongside the integration work, core client-server communication theory (API requests, JSON data, CORS, error handling, Fetch vs Axios) was studied, and Data Structures & Algorithms practice continued with two problems: **Merge Intervals** and **Find Pair Sum**.

---

## Learning Goals

- Replace the Fetch API with **Axios** in an existing React application
- Configure Axios for `GET`, `POST`, `PUT`, and `DELETE` requests against FastAPI
- Implement **loading states** to reflect in-progress API requests in the UI
- Implement **error handling** for failed requests, unreachable backend servers, and database connection failures
- Verify **CORS** configuration between React (one localhost port) and FastAPI (another localhost port)
- Understand **client-server communication**, API requests, and JSON data exchange
- Compare **Fetch vs Axios** and understand the advantages of Axios for frontend-backend communication
- Trace and test the complete data flow: React → Axios → FastAPI → SQLAlchemy → PostgreSQL → FastAPI → Axios → React
- Practice problem solving and DSA in Python:
  - Merge Intervals
  - Find Pair Sum

---

## Key Concepts & Architecture

### 1. Fetch vs Axios

| Aspect | Fetch API | Axios |
| :--- | :--- | :--- |
| **JSON Handling** | Requires manually calling `.json()` on the response | Automatically parses JSON responses |
| **Error Handling** | Does not reject on HTTP error status codes (e.g. 404, 500) — must check `response.ok` manually | Automatically rejects the promise on non-2xx responses, simplifying error handling |
| **Request Config** | Headers and body must be manually structured for every call | Cleaner config object with defaults (base URL, headers) reusable across requests |
| **Browser Support** | Native to modern browsers, no extra dependency | Requires installing the `axios` package |
| **Interceptors** | Not built-in | Supports request/response interceptors for centralized logic (e.g. logging, auth headers) |

Axios was adopted for BookNest because it simplifies error handling and JSON parsing, and makes it easier to centrally manage request configuration across all API calls.

### 2. Client-Server Communication & API Requests

- The React frontend (client) sends HTTP requests to the FastAPI backend (server) using Axios.
- Requests include the HTTP method, target URL, optional headers, and a JSON request body where applicable (`POST`/`PUT`).
- The backend responds with an HTTP status code and a JSON payload, which Axios automatically parses into a JavaScript object.

### 3. CORS (Cross-Origin Resource Sharing)

Since React (running on one localhost port) and FastAPI (running on another localhost port) are considered different origins by the browser, CORS must be enabled on the backend via `CORSMiddleware` to allow the frontend to make requests to it. This was verified today to ensure Axios calls from React are not blocked by the browser.

### 4. Loading States & Error Handling

| Scenario | Handling |
| :--- | :--- |
| **Request in progress** | UI displays a loading message/indicator while Axios awaits a response |
| **Backend unreachable** | User-friendly error message shown instead of a silent failure |
| **API request fails (non-2xx)** | Axios rejects the promise; error is caught and surfaced to the user |
| **Database connection unavailable** | FastAPI's error response is caught by Axios and displayed as a clear message |

This ensures the application never fails silently or shows stale/incorrect data when something goes wrong along the data flow.

### 5. Data Flow Architecture

React (Axios request)
↓
FastAPI (receives request)
↓
SQLAlchemy (queries/updates ORM models)
↓
PostgreSQL (reads/writes data)
↓
FastAPI (returns JSON response)
↓
Axios (parses response)
↓
React (renders data / loading / error state)


This flow was tested end-to-end for the main BookNest feature to confirm that data fetched from PostgreSQL is correctly retrieved through FastAPI and displayed in the React UI via Axios.

---

## Technologies Used

- React
- JavaScript
- Axios
- FastAPI
- Python
- SQLAlchemy
- PostgreSQL
- REST API
- JSON
- CORS

---

## Main Work Completed

1. Replaced existing React `fetch()` API calls with Axios.
2. Configured Axios for communication with FastAPI.
3. Implemented API calls for existing BookNest functionality.
4. Added loading states for API requests.
5. Added error handling for failed API requests.
6. Added handling for backend/server connection errors.
7. Added handling for database connection failures.
8. Configured/verified CORS between React and FastAPI.
9. Successfully displayed PostgreSQL database records in React.
10. Tested the complete data flow for the main BookNest feature.
11. Practiced Merge Intervals and Find Pair Sum in Python.
12. Updated the GitHub repository.

---

## DSA / Python Practice

### 1. Merge Intervals

Merges a list of overlapping intervals into a set of non-overlapping intervals:

```python
def merge_intervals(intervals):
    if not intervals:
        return []

    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]

    for current in intervals[1:]:
        last = merged[-1]
        if current[0] <= last[1]:
            last[1] = max(last[1], current[1])
        else:
            merged.append(current)

    return merged

intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]
print("Merged intervals:", merge_intervals(intervals))
# Output: Merged intervals: [[1, 6], [8, 10], [15, 18]]
```

- **Time Complexity**: $\mathcal{O}(n \log n)$ — dominated by sorting the intervals.
- **Space Complexity**: $\mathcal{O}(n)$ — for the merged output list.

---

### 2. Find Pair Sum

Finds a pair of numbers in an array that add up to a given target sum, using a hash set for a single-pass solution:

```python
def find_pair_sum(nums, target):
    seen = set()

    for num in nums:
        complement = target - num
        if complement in seen:
            return (complement, num)
        seen.add(num)

    return None

numbers = [2, 7, 11, 15]
target = 9
print("Pair with target sum:", find_pair_sum(numbers, target))
# Output: Pair with target sum: (2, 7)
```

- **Time Complexity**: $\mathcal{O}(n)$ — single pass through the array using a hash set.
- **Space Complexity**: $\mathcal{O}(n)$ — for storing seen elements in the set.

---

## Deliverables Completed

1. **Axios Integration**: Replaced Fetch API calls with Axios across the existing BookNest React frontend.
2. **Loading States**: Added loading indicators while API requests are in progress.
3. **Error Handling**: Added user-friendly error messages for backend, request, and database connection failures.
4. **CORS Verified**: Confirmed CORS configuration allows React and FastAPI to communicate across different localhost ports.
5. **End-to-End Data Flow Tested**: Verified the full React → Axios → FastAPI → SQLAlchemy → PostgreSQL flow for the main BookNest feature.
6. **DSA Implementations**: Completed scripts for Merge Intervals and Find Pair Sum.
7. **GitHub Updated**: Repository updated with today's code and documentation.

