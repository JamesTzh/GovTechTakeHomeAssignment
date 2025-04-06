import hashlib

def anonymize_username(username):
    hashed_username = hashlib.sha256(username.encode()).hexdigest()
    return hashed_username