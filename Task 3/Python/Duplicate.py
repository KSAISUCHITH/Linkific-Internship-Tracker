arr = [1,2,2,3,3,4,4,5,5]

dup = []

for i in range(len(arr)):
    for j in range(i+1,len(arr)):
        if arr[i]==arr[j] and arr[j] not in dup:
            dup.append(arr[j])

print("Duplicates",dup)