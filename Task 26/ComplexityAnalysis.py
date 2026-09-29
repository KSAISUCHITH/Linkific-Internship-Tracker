# Task-26: Python DSA Practice
# Topic: Search Optimization
# Focus: Time Complexity and Efficient Data Structures


# ---------------------------------------
# 1. Linear Search
# Time Complexity: O(n)
# ---------------------------------------

def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i

    return -1


numbers = [10, 25, 30, 45, 50, 65, 80]

print("Linear Search:")
print(linear_search(numbers, 50))


# ---------------------------------------
# 2. Binary Search
# Time Complexity: O(log n)
#
# IMPORTANT:
# Array must be sorted.
# ---------------------------------------

def binary_search(arr, target):
    left = 0
    right = len(arr) - 1

    while left <= right:
        middle = left + (right - left) // 2

        if arr[middle] == target:
            return middle

        elif arr[middle] < target:
            left = middle + 1

        else:
            right = middle - 1

    return -1


print("\nBinary Search:")
print(binary_search(numbers, 50))


# ---------------------------------------
# 3. Hash Map Lookup
# Average Time Complexity: O(1)
# ---------------------------------------

def create_lookup(arr):
    lookup = {}

    for i, value in enumerate(arr):
        lookup[value] = i

    return lookup


lookup = create_lookup(numbers)

print("\nHash Map Lookup:")
print(lookup.get(50, -1))


# ---------------------------------------
# 4. Find Duplicate
# Using Hash Set
#
# Time: O(n)
# Space: O(n)
# ---------------------------------------

def contains_duplicate(arr):
    seen = set()

    for value in arr:
        if value in seen:
            return True

        seen.add(value)

    return False


print("\nDuplicate Check:")
print(contains_duplicate([10, 20, 30, 20]))


# ---------------------------------------
# 5. Two Sum
# Optimized using Hash Map
#
# Brute Force: O(n²)
# Optimized: O(n)
# ---------------------------------------

def two_sum(arr, target):
    seen = {}

    for i, value in enumerate(arr):
        required = target - value

        if required in seen:
            return [seen[required], i]

        seen[value] = i

    return []


numbers2 = [2, 7, 11, 15]

print("\nTwo Sum:")
print(two_sum(numbers2, 9))