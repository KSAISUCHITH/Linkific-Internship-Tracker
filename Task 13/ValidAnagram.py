def isAnagram(s, t):
    return sorted(s) == sorted(t)


s = "listen"
t = "silent"

print(isAnagram(s, t))