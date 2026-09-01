def missing_num(nums):
    l = len(nums)

    for i in range(l):
        if i not in nums:
            return i

nums = [0,1,2,3,4,6,7]
print(missing_num(nums))  