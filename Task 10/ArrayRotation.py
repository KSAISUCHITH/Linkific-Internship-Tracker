arr = [1, 2, 3, 4, 5]
k = int(input("Enter the number of positions to rotate: "))

rotated_right = arr[-k:] + arr[:-k]  


rotated_left = arr[k:] + arr[:k] 

print("Right Rotation: ")
print(rotated_right)
print("Left Rotation: ")
print(rotated_left)