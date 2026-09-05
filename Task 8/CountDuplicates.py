def count_values(arr):
    frequency = {}

    for num in arr:
        if num in frequency:
            frequency[num] += 1
        else:
            frequency[num] = 1

    return frequency


arr = [1, 2, 2, 3, 3, 3, 4]

print(count_values(arr))