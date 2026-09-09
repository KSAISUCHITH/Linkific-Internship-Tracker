def find_missing(arr, n):
    expected_sum = n * (n + 1) // 2
    actual_sum = sum(arr)
    return expected_sum - actual_sum

arr = [1, 2, 3, 5]
n = 5
print(find_missing(arr, n))