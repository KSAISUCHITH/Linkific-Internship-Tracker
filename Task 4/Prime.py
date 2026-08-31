num = int(input("Enter a number to check: "))

def CheckPrime(n):
    count = 0
    
    for i in range(1,n+1):
        if n%i == 0:
            count+=1

    if count<=2:
        return "Prime Number"
    else:
        return "Not a Prime Number"

print(CheckPrime(num))