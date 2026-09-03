arr = list(map(int, input("Enter elements: ").split()))
target = int(input("Enter element to search: "))

for i in range(len(arr)):
    if arr[i] == target:
        print("Element found at index:", i)
        break
else:
    print("Element not found")