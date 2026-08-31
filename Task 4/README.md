# Task 2 – Python Fundamentals & Student Management CLI

## Task Overview
This task covers core Python programming concepts, from variables and data types through object-oriented programming, exception handling, and file handling. It culminates in a Student Management CLI application that applies all these concepts together, along with practice on classic DSA problems.

## Learning Goals
- Understand variables, data types, and control flow
- Master functions and loops
- Learn object-oriented programming basics (classes, objects, inheritance)
- Implement robust exception handling
- Work with file reading and writing
- Apply all concepts in a real command-line application
- Practice algorithm problem-solving

## Components

### Core Python Concepts
- **Variables** - declaration, assignment, naming conventions
- **Data Types** - int, float, str, bool, list, tuple, dict, set
- **Functions** - definition, parameters, return values, default/keyword arguments
- **Loops** - for and while loops, break, continue, nested loops

### Object-Oriented Programming (OOP)
- Classes and objects
- __init__ constructor
- Instance vs class attributes
- Methods
- Basics of inheritance and encapsulation

### Error and File Handling
- **Exception Handling** - try, except, else, finally, custom exceptions
- **File Handling** - reading/writing files, working with file modes, using with statements

### DSA - Python Algorithms
1. **PrimeNumber.py** - Check whether a number is prime
   - Uses iterative division checks up to the square root of the number
   - Input: Number from user
   - Output: Prime or not prime
2. **ArmstrongNumber.py** - Check whether a number is an Armstrong number
   - Sums digits raised to the power of the digit count and compares to original
   - Input: Number from user
   - Output: Armstrong or not Armstrong
3. **BinarySearch.py** - Search for an element in a sorted array
   - Implements binary search using iterative halving
   - Input: Sorted array and target value
   - Output: Index of element or not found
4. **SecondLargest.py** - Find the second largest number in a list
   - Single-pass comparison approach to track top two values
   - Input: Array of numbers
   - Output: Second largest value

### Project - Student Management CLI
- **student_management.py** - Main CLI application
- Add, view, update, and delete student records
- Data persisted using file handling
- Input validation with exception handling

## Project Structure
```text
Task 2/
├── README.md
├── basics/
│   ├── variables.py
│   ├── data_types.py
│   ├── functions.py
│   └── loops.py
├── oop/
│   └── oop_basics.py
├── exception_handling/
│   └── exception_practice.py
├── file_handling/
│   └── file_practice.py
├── dsa_practice/
│   ├── PrimeNumber.py
│   ├── ArmstrongNumber.py
│   ├── BinarySearch.py
│   └── SecondLargest.py
└── student_management/
    ├── student_management.py
    └── students.txt
```

## Technologies Used
- **Language**: Python 3
- **Tools**: VS Code, Git, GitHub

## How to Run

### Student Management CLI
```bash
python student_management/student_management.py
```

### Prime Number Check
```bash
python dsa_practice/PrimeNumber.py
# Enter a number when prompted
```

### Armstrong Number Check
```bash
python dsa_practice/ArmstrongNumber.py
# Enter a number when prompted
```

### Binary Search
```bash
python dsa_practice/BinarySearch.py
# Enter the sorted array and target value when prompted
```

### Second Largest Number
```bash
python dsa_practice/SecondLargest.py
# Enter the list of numbers when prompted
```

## Key Concepts Covered
- **Variables and Data Types** - Foundation of Python programming
- **Functions and Loops** - Reusable and repeatable logic
- **OOP Basics** - Classes, objects, and encapsulation
- **Exception Handling** - Graceful error management
- **File Handling** - Persistent data storage
- **Recursion and Iteration** - Applied in DSA problems
- **Searching Algorithms** - Binary search implementation

## Deliverables
- Fully functional Student Management CLI
- Four working Python DSA solutions
- Proper project structure and organization
- Clean, well-documented code
- GitHub repository updated