# Task 5 – React Fundamentals & Tourism Landing Page

## Task Overview
This task covers the fundamentals of React development, including JSX, components, props, state, React Hooks, Virtual DOM, and Single Page Applications. It culminates in converting a landing page into a responsive and interactive tourism website called ExploreIndia, along with practice on Python and classic DSA problems.

## Learning Goals
- Understand React installation and project structure
- Learn JSX and functional components
- Understand component-based architecture
- Learn how props are used to pass data between components
- Understand state and dynamic UI updates
- Learn commonly used React Hooks
- Understand the Virtual DOM and Single Page Applications
- Build a responsive and interactive tourism landing page
- Practice Python data structures and DSA problems
- Apply React concepts in a real-world frontend application

## Components

### React Fundamentals
- **React Installation** - Set up a React application using Vite
- **React Project Structure** - Understand the purpose of files and folders in a React project
- **JSX** - Write HTML-like syntax inside JavaScript
- **Components** - Create reusable functional components
- **Props** - Pass data from parent components to child components
- **State** - Manage dynamic data within React components

### React Hooks
- **useState** - Manage component state and update the UI dynamically
- **useEffect** - Handle side effects such as document updates and other external operations
- **useContext** - Access shared data between components without passing props through multiple levels
- **useRef** - Reference DOM elements and maintain values between renders

### React Concepts
- **Component-Based Architecture** - Divide the application into reusable components
- **Virtual DOM** - Understand how React efficiently updates the UI
- **Single Page Application (SPA)** - Understand dynamic page updates without full page reloads
- **Conditional Rendering** - Display UI elements based on application state
- **Event Handling** - Handle user interactions such as clicks and input changes
- **Array.map()** - Dynamically generate UI elements from data
- **Array.filter()** - Filter data based on search and category selection

### DSA - Python Practice
1. **Dictionary vs List** - Compare Python lists and dictionaries
   - Lists store ordered values and use indexes for access
   - Dictionaries store key-value pairs and use keys for access
   - Understand suitable use cases for each data structure

2. **Missing Number** - Find the missing number from a sequence
   - Checks numbers from `0` to `n`
   - Uses the `not in` operator to identify the missing value
   - Input: List of numbers
   - Output: Missing number

3. **Two Sum** - Find two numbers whose sum equals the target
   - Uses nested `for` loops to check pairs of elements
   - Returns the indexes of the two matching elements
   - Input: Array of numbers and target value
   - Output: Indexes of the two elements

### Project - ExploreIndia Tourism Landing Page
- **Navbar** - Responsive navigation and theme toggle
- **Hero** - Tourism introduction and call-to-action buttons
- **DestinationCard** - Reusable destination card component
- **Destinations** - Displays and filters available destinations
- **DestinationModal** - Displays detailed destination information
- **About** - Provides information about the tourism platform
- **Footer** - Contains navigation links and website information

### Interactive Features
- Search destinations
- Filter destinations by category
- Favorite destinations
- View destination details
- Dark/Light mode
- Smooth scrolling
- Responsive navigation
- Hover effects and transitions

## Project Structure
```text
Task 5/
├── README.md
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── DestinationCard.jsx
│   │   ├── Destinations.jsx
│   │   ├── DestinationModal.jsx
│   │   ├── About.jsx
│   │   └── Footer.jsx
│   ├── data/
│   │   └── destinations.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── public/
├── package.json
└── vite.config.js