def removeDuplicates(arr):
    result = []

    for num in arr:
        if num not in result:
            result.append(num)

    return result

arr = [1, 2, 2, 3, 4, 4, 5]
print(removeDuplicates(arr))