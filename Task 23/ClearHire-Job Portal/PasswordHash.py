from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(
    password: str,
    password_hash: str,
) -> bool:
    return pwd_context.verify(
        password,
        password_hash,
    )

password = "MySecurePassword123"

hashed_password = hash_password(password)

print("Original Password:", password)
print("Hashed Password:", hashed_password)

is_valid = verify_password(
    password,
    hashed_password,
)

print("Password Valid:", is_valid)