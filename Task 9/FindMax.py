def find_max(arr):
    maximum = arr[0]

    for num in arr:
        if num > maximum:
            maximum = num

    return maximum


arr = [10, 25, 7, 40, 15]
print(find_max(arr))