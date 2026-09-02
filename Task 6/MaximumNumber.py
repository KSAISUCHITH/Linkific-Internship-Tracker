def Max(arr):
    maximum = arr[0]

    for num in arr:
        if num > maximum:
            maximum = num

    return maximum

arr = [10, 25, 7, 42, 18]
print(Max(arr))