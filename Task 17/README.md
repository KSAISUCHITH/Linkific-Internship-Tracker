# Task-17

# Debugging, API Testing & Bug Fixing

## Project Overview
BookNest is a full-stack library management application built with React on the frontend and FastAPI on the backend, backed by a PostgreSQL database. The application allows users to browse a shared Main Library, manage their own Personal Library (borrowing, downloading, and returning books), and interact with books through Favorites and Ratings.

Today's task focused on debugging existing issues in BookNest, testing the FastAPI backend independently using Postman, testing frontend behavior using browser developer tools, identifying root causes of real bugs, fixing them, and verifying the application through regression testing. The purpose was to improve the stability and reliability of the existing project rather than add new features.

**Date:** 17 September 2026

---

# 1. Task Objectives

- Learn and apply systematic debugging techniques rather than making random code changes
- Debug existing issues present in the BookNest application
- Test FastAPI backend APIs independently using Postman
- Test frontend functionality and behavior across the application
- Use Browser Developer Tools to inspect console output, network requests, and rendered layout
- Identify the root cause of each issue before applying a fix
- Fix the identified bugs without breaking existing functionality
- Re-test the application after each fix to confirm resolution
- Perform regression testing across previously working features
- Document all resolved issues clearly
- Practice Python debugging and DSA problem solving (Binary Search, Find Missing Number)

---

# 2. Debugging Techniques

## 2.1 Introduction to Debugging
Debugging is the process of locating and correcting defects in an application by reasoning from observed symptoms back to their underlying cause, rather than guessing at fixes. Today's work applied this process to real issues found in BookNest.

## 2.2 Reading Error Messages
Error messages, console warnings, and network response details were read carefully before making any change, since they typically indicate the exact component, endpoint, or condition responsible for the failure.

## 2.3 Debugging Workflow
A consistent workflow was followed for each issue:

Observe Symptom
↓
Reproduce the Issue
↓
Inspect Relevant Code / Network / Console
↓
Identify Root Cause
↓
Apply Fix
↓
Re-test
↓
Regression Check


## 2.4 Identifying Root Causes
Rather than treating symptoms in isolation (e.g., simply hiding an overflow or suppressing an error), the underlying cause was traced in each case — such as an incorrect responsive breakpoint, a globally rendered component, or invalid data already present in the database.

## 2.5 Regression Testing
After each fix, previously working functionality was re-checked to confirm that the change did not introduce a new issue elsewhere in the application.

---

# 3. Frontend Debugging

## 3.1 React Debugging
React component behavior was inspected directly in the browser to confirm which components were rendering, under what conditions, and with what props/state, particularly for the Header component and route-based rendering.

## 3.2 Browser Developer Tools
Chrome DevTools were used throughout today's debugging session for inspecting the DOM, console output, and network activity.

## 3.3 Console Debugging
The browser console was checked for JavaScript errors and warnings while reproducing each issue, helping confirm whether a problem originated on the frontend or was a result of a backend response.

## 3.4 Network Tab
The Network tab was used to inspect actual API requests and responses sent between React and FastAPI, including request payloads, response status codes, and response bodies.

## 3.5 Responsive Testing
The BookNest frontend was tested at multiple screen sizes — mobile, tablet, and desktop — using DevTools' device toolbar, which is how the tablet layout issue described below was identified.

---

# 4. Bugs Identified and Fixed

## 4.1 Bug #1 — Tablet Responsive Layout Issue

**Symptom:**
- Desktop/laptop view was working correctly.
- Mobile view was working correctly.
- Tablet view had horizontal overflow.
- The header navigation required more width than was available on tablet-sized screens.
- A horizontal scrollbar appeared.
- Parts of the navigation extended outside the viewport.

**Root Cause:**
The `Header` component used the `md` breakpoint to switch from the mobile hamburger menu to the full desktop navigation. Tablet-sized screens fall above the `md` breakpoint but do not have enough horizontal space for the full navigation, so they were incorrectly receiving the desktop layout.

**Fix:**
Changed the responsive breakpoint in `Header.jsx` from `md` to `xl`.

The navigation now behaves approximately as:
- Mobile → hamburger menu
- Tablet → hamburger menu
- Smaller desktop screens → hamburger menu
- Larger desktop screens (`xl` and above) → full navigation

The existing design and navigation functionality were preserved — only the breakpoint at which the layout switches was changed.

**Testing:**
Mobile, tablet, and desktop viewport sizes were tested using DevTools, and the horizontal overflow no longer occurs at tablet widths.

## 4.2 Bug #2 — Header Visible on Authentication Pages

**Symptom:**
- The main BookNest navigation header was visible on the Login and Register pages.
- Authentication pages should present a focused authentication interface without the main application navigation.

**Root Cause:**
The `Header` component was rendered globally in `App.jsx`, so it appeared on every route by default, including `/login` and `/register`.

**Fix:**
Used React Router's `useLocation()` hook in `App.jsx` to check the current route, and conditionally rendered the `Header` component. The Header is now hidden for:
- `/login`
- `/register`

It continues to render normally on all other BookNest pages.

**Testing:**
The Login and Register pages were re-tested and confirmed to no longer display the header. The rest of the application was also checked to confirm the header still appears as expected on all other routes.

## 4.3 Bug #3 — Invalid Publication Year

**Symptom:**
- The database contained an existing book record with a publication year of `0`.
- This value was invalid according to the backend validation rules.
- The invalid value caused the `/books` API response validation to fail.

**Root Cause:**
An existing database record contained an invalid publication year, while the Pydantic `BookResponse` schema required `year >= 1000`. The backend validation was working correctly — it was correctly detecting invalid data that already existed in the database.

**Fix:**
- The invalid database record was corrected by updating the publication year to the book's actual valid publication year.
- Backend validation on the schema was also confirmed/reinforced using a Pydantic constraint similar to:
```python
year: int = Field(..., ge=1000, le=2100)
```

**Testing:**
`/books` was re-tested and confirmed to work correctly after the record was corrected. The database was also checked for any other records with similarly invalid publication years.

**Note:** This was a data-integrity issue discovered *because* backend validation correctly flagged it during testing — it does not reflect a flaw in the validation logic itself, but rather confirms that the validation added in the previous task is functioning as intended.

---

# 5. API Testing with Postman

Postman was used to test the FastAPI backend independently of the React frontend, allowing each endpoint to be verified in isolation with controlled request data.

## 5.1 Postman Setup
A Postman workspace was configured with the base URL of the local FastAPI server (`http://localhost:8000`) and requests were organized by feature area (authentication, books, favorites, ratings, personal library).

## 5.2 Testing Authentication APIs
`/auth/login` was tested with valid credentials to confirm successful authentication and JWT issuance. `/auth/me` was tested both with and without a valid token to confirm authenticated user data is returned correctly and that unauthenticated requests are rejected.

## 5.3 Testing Protected APIs
Endpoints requiring authentication (`/auth/me`, `/favorites`, `/my-library`) were tested with and without a Bearer token to confirm protected behavior.

## 5.4 Testing Book APIs
Book retrieval endpoints (`/books`, `/books/{id}`) were tested for both existing and non-existent book IDs. The Admin-only `/books` POST endpoint was also tested using a non-admin/unauthorized request to confirm access is denied.

## 5.5 Testing Invalid Requests
Requests with invalid or out-of-range data (such as an invalid rating value) were sent to confirm that backend validation correctly rejects them.

## 5.6 Testing HTTP Status Codes
Responses were checked to confirm that the correct HTTP status codes were being returned for different scenarios (success, unauthorized, not found, validation error).

## 5.7 API Error Response Testing
Error responses were inspected to confirm they returned a clear message/detail field rather than an unhandled exception or empty body.

### API Testing Summary

| API | Method | Test | Expected Result | Status |
|---|---|---|---|---|
| `/auth/login` | POST | Valid login | Successful authentication | Passed |
| `/auth/me` | GET | Valid JWT | User information returned | Passed |
| `/auth/me` | GET | No JWT | Unauthorized response | Tested |
| `/books` | GET | Retrieve books | Books returned | Passed |
| `/books/{id}` | GET | Existing book | Book returned | Tested |
| `/books/{id}` | GET | Non-existent book | 404 response | Tested |
| `/favorites` | GET | Authenticated user | User favorites returned | Tested |
| `/books/{id}/favorite` | POST | Add favorite | Favorite added | Tested |
| `/books/{id}/rating` | POST | Valid rating | Rating processed | Tested |
| `/books/{id}/rating` | POST | Invalid rating | Validation error | Tested |
| `/my-library` | GET | Authenticated user | Personal library returned | Tested |
| `/books` | POST | Unauthorized/non-admin | Access denied | Tested |

*"Passed" indicates the test was run and produced the expected result. "Tested" indicates the scenario was exercised and produced a reasonable response consistent with expectations, without every response detail being formally recorded.*

## 5.8 Postman Request Configuration Issue

During login testing, the request body was initially being sent as raw text rather than as JSON. This caused FastAPI to reject the request, since it expected a JSON object matching the `LoginRequest` model rather than a plain text body.

**Resolution:** The Postman request body type was changed from `Body → raw → Text` to `Body → raw → JSON`, and the `Content-Type: application/json` header was confirmed. After this correction, the login API responded correctly.

This was a **Postman request configuration issue**, not a defect in the BookNest backend code — the FastAPI endpoint was correctly rejecting a malformed request in both cases.

---

# 6. Backend Debugging and Validation

## 6.1 FastAPI Debugging
FastAPI's automatic interactive documentation (`/docs`) and terminal logs were used alongside Postman to observe how incoming requests were being processed and where failures occurred.

## 6.2 Pydantic Validation
Pydantic validation errors returned by FastAPI were reviewed to understand exactly which field and constraint caused a request or response to fail.

## 6.3 Authentication Debugging
JWT-related behavior was checked by testing protected endpoints with valid, missing, and invalid tokens to confirm authentication was being enforced correctly.

## 6.4 Database Debugging
The PostgreSQL database was inspected directly to locate the record with an invalid publication year (`0`), confirming the source of the `/books` response validation failure.

## 6.5 Exception Handling
Existing `HTTPException` usage and error responses (introduced in the previous task) were reviewed during testing to confirm they behaved consistently under the scenarios tested today.

## 6.6 API Response Validation
The publication year issue demonstrated how FastAPI's response-model validation can surface pre-existing invalid data in the database — the validation layer flagged the bad record rather than silently returning invalid data to the frontend.

---

# 7. Frontend and Backend Integration Testing

## 7.1 React to FastAPI Communication
After each fix, the React frontend was used against the running FastAPI backend to confirm the two layers continued to work together correctly.

## 7.2 Axios Requests
Axios requests from the frontend were observed in the Network tab to confirm they matched the requests verified independently in Postman.

## 7.3 Authentication Flow
The full login flow was tested through the UI — entering credentials, receiving a token, and accessing a protected page — to confirm consistency with the Postman-level authentication testing.

## 7.4 Error Handling
Frontend error handling (introduced in the previous task) was checked to confirm it still displayed appropriate messages for the error scenarios exercised today, such as accessing protected data without a token.

## 7.5 Responsive Testing
The frontend was re-tested across mobile, tablet, and desktop viewports after the Header fixes to confirm both the layout and header-visibility fixes worked together correctly.

---

# 8. Testing and Verification

## 8.1 API Testing
Core authentication and book-related APIs were tested using Postman, as detailed in Section 5.

## 8.2 Authentication Testing
Login was tested through Postman with valid credentials, and protected endpoint behavior was tested with and without a valid token.

## 8.3 Book Functionality Testing
Book retrieval was tested for both existing and non-existent book IDs, and `/books` was retested after correcting the invalid publication year in the database.

## 8.4 Frontend Testing
The Login and Register pages were tested to confirm the header is no longer displayed, and the rest of the application was checked to confirm the header still displays correctly elsewhere.

## 8.5 Responsive Testing
Mobile, tablet, and desktop viewports were tested to confirm the tablet horizontal overflow issue no longer occurs.

## 8.6 Error Scenario Testing
Validation errors (e.g., invalid rating values) and unauthorized/forbidden access scenarios were tested to confirm correct API behavior.

## 8.7 Regression Testing
After all three fixes, previously working features (Main Library browsing, Personal Library actions, Favorites, Ratings, authenticated navigation) were re-checked to confirm none were affected by today's changes.

### Testing Summary

| Area | What Was Tested | Result |
|---|---|---|
| Login (Postman) | Valid credentials | JWT issued successfully |
| Protected APIs | With/without token | Access correctly allowed/denied |
| Book retrieval | Existing and non-existent IDs | Correct data / 404 behavior |
| Invalid book data | Publication year = 0 | Flagged by validation, then corrected |
| Header on auth pages | Login, Register | Header correctly hidden |
| Tablet layout | Tablet viewport width | Overflow resolved |
| Regression | Main Library, Personal Library, Favorites, Ratings | Continued working as before |

---

# 9. Bug Report

| Bug ID | Bug | Root Cause | Fix | Status |
|---|---|---|---|---|
| BUG-001 | Tablet horizontal overflow | Desktop navigation displayed at `md` breakpoint | Changed navigation breakpoint to `xl` | Fixed |
| BUG-002 | Header visible on Login/Register | Header rendered globally in `App.jsx` | Conditionally hide Header using `useLocation()` | Fixed |
| BUG-003 | Publication year = 0 | Existing invalid database record | Corrected database record; confirmed schema validation (`ge=1000, le=2100`) | Fixed |

---

# 10. DSA / Coding Practice

## 10.1 Debug a Python Function
As part of today's debugging practice, a Python function containing a logical error was reviewed and corrected. This involved tracing the function's execution step by step, comparing actual output against expected output, and identifying where the logic diverged — reinforcing the same systematic debugging approach applied to the BookNest bugs.

## 10.2 Binary Search
- **Problem**: Given a sorted array and a target value, find the index of the target, or determine that it does not exist.
- **Approach**: Maintain `low` and `high` pointers spanning the search range. Repeatedly compute the middle index, compare the middle value to the target, and narrow the range to the left or right half accordingly, until the target is found or the range is empty.
- **Step-by-step logic**:
  1. Set `low = 0`, `high = len(arr) - 1`.
  2. While `low <= high`: compute `mid = (low + high) // 2`.
  3. If `arr[mid] == target`, return `mid`.
  4. If `arr[mid] < target`, set `low = mid + 1`.
  5. Otherwise, set `high = mid - 1`.
  6. If the loop ends without finding the target, return -1.

```python
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
```

- **Time Complexity**: O(log n)
- **Space Complexity**: O(1)

## 10.3 Find Missing Number
- **Problem**: Given an array containing `n` distinct numbers from `0` to `n`, find the one number missing from the sequence.
- **Approach**: Use XOR. XOR-ing all numbers from `0` to `n` together, and then XOR-ing that result with all numbers actually present in the array, cancels out every number that appears in both sets, leaving only the missing number.
- **Why XOR works**: XOR-ing a number with itself results in 0, and XOR-ing any number with 0 leaves it unchanged. Since every present number appears exactly once in both the full range and the array, they cancel out in pairs, leaving only the missing number.

```python
def find_missing_number(nums):
    n = len(nums)
    result = n
    for i in range(n):
        result ^= i ^ nums[i]
    return result
```

- **Time Complexity**: O(n)
- **Space Complexity**: O(1)

---

# 11. Learning Outcomes

- Applied a systematic debugging workflow instead of making random code changes
- Practiced reading error messages, console output, and stack traces to locate the source of a problem
- Learned to trace symptoms back to root causes rather than fixing surface-level effects
- Gained hands-on experience testing a FastAPI backend independently using Postman
- Reinforced understanding of HTTP methods and status codes through real request/response testing
- Practiced React debugging using component inspection and conditional rendering logic
- Used Browser Developer Tools for console debugging, network inspection, and responsive testing
- Learned to inspect and correct invalid data directly in the PostgreSQL database
- Practiced regression testing to confirm fixes did not break existing functionality
- Documented bugs and fixes in a clear, structured format suitable for a bug report
- Practiced Python debugging by identifying and correcting a logical error in a function
- Implemented and understood Binary Search and its logarithmic time complexity
- Implemented and understood the XOR-based approach to the Find Missing Number problem

---

# 12. Challenges Faced

- Identifying the exact root cause of the tablet responsive issue rather than the more general "mobile vs desktop" assumption
- Handling intermediate tablet-sized breakpoints correctly without disrupting the existing mobile and desktop layouts
- Understanding why the header appeared globally on authentication pages despite route-specific expectations
- Diagnosing invalid database data that was only exposed indirectly through a backend response validation failure
- Correctly configuring Postman for JSON requests after initially sending a raw text body
- Interpreting API validation errors precisely enough to distinguish configuration issues from actual backend bugs
- Testing authenticated and protected endpoints thoroughly, covering both allowed and denied scenarios
- Ensuring that each of the three fixes did not introduce new issues elsewhere in the application
- Performing consistent regression testing across previously implemented BookNest features

---

# 13. Technologies Used

| Technology | Purpose |
|---|---|
| React | Frontend development and debugging |
| Tailwind CSS | Responsive layout |
| Axios | API communication |
| FastAPI | Backend API |
| Python | Backend logic and DSA practice |
| Pydantic | Request/response validation |
| PostgreSQL | Database |
| Postman | API testing |
| Browser Developer Tools | Frontend and network debugging |
| VS Code | Development and debugging |
| Git & GitHub | Version control |

---

# 14. Conclusion

Today's task focused primarily on practical debugging and testing rather than building new features. Three real issues were identified and resolved: a tablet-specific responsive layout overflow, the navigation header incorrectly appearing on the Login and Register pages, and an invalid publication year already present in the database. FastAPI APIs were tested independently using Postman, covering authentication, protected endpoints, book retrieval, and validation scenarios, while frontend behavior was verified using browser developer tools across mobile, tablet, and desktop viewports. Database data was checked directly when backend validation correctly exposed an invalid existing record, and regression testing was performed afterward to confirm that all three fixes preserved existing BookNest functionality. As a result of this work, the application is more stable, its API behavior is better verified, and the debugging process itself was documented for future reference.