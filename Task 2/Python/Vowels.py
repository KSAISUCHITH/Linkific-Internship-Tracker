word = input("Enter a word to check: ")

vowels = 0
consonants = 0

for char in word:
    if char in 'aeiou':
        vowels+=1
    else:
        consonants+=1

print("Vowels: ",vowels)
print("Consonants: ",consonants)
    
    