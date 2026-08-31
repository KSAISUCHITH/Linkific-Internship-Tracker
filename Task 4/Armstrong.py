num = int(input("Enter a number to check: "))

temp = num
digits = len(str(num))
sum = 0

while temp > 0:
    digit = temp % 10
    sum += digit ** digits
    temp //=10

if sum == num:
    print("Armstrong Number")
else:
    print("Not an Armstrong Number")
