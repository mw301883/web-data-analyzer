import os
from pymongo import MongoClient
from passlib.hash import bcrypt

client = None
db = None
_users = None

def init_db():
    global client, db, _users
    mongo_uri = os.environ.get("MONGO_URI", "mongodb://data-analyzer-mongo:27017/web-data-analyzer")
    client = MongoClient(mongo_uri)
    db = client.get_database()
    _users = db.users
def get_users_collection():
    global _users
    if _users is None:
        raise Exception("DB not initialized. Call init_db() first.")
    return _users

def ensure_admin_user():
    global _users
    username = os.environ.get("ADMIN_USERNAME", "admin")
    password = os.environ.get("ADMIN_PASSWORD", "admin")

    if not _users.find_one({'username': username}):
        hashed_pw = bcrypt.hash(password)
        _users.insert_one({'username': username, 'password': hashed_pw})
        print(f"✅ Utworzono domyślnego użytkownika: {username}/{password}")
