numbers = [10, 25, 8, 40, 30]

largest = 0
second_largest = 0

for num in numbers:

    if num > largest:
        second_largest = largest
        largest = num

    elif num > second_largest and num != largest:
        second_largest = num

print("Second largest:", second_largest)