class Solution:
    def maxSubArray(self, nums):
        current_sum = nums[0]
        maximum_sum = nums[0]

        for i in range(1, len(nums)):
            current_sum = max(nums[i], current_sum + nums[i])
            maximum_sum = max(maximum_sum, current_sum)

        return maximum_sum