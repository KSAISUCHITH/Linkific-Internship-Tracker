def pairSum(nums, target):
    seen = set()

    for num in nums:
        required = target - num

        if required in seen:
            return [required, num]

        seen.add(num)

    return []


nums = [2, 7, 11, 15]
target = 9

print(pairSum(nums, target))