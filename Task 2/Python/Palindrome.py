Word = input("Enter a word to check: ")

reversed = Word[::-1]

if Word == reversed:
    print("Palindrome")
else:
    print("Not Palindrome")