from flask import Blueprint, request, jsonify
import hashlib
from backend.database import load_db, save_db

auth = Blueprint("auth", __name__)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@auth.route("/register", methods=["POST"])
def register():
    data = load_db()
    users = data["users"]

    username = request.json.get("username")
    password = request.json.get("password")

    if any(u["username"] == username for u in users):
        return jsonify({"error": "User already exists"}), 400

    users.append({
        "username": username,
        "password": hash_password(password)
    })

    save_db(data)
    return jsonify({"message": "User registered successfully"}), 201

@auth.route("/login", methods=["POST"])
def login():
    data = load_db()
    users = data["users"]

    username = request.json.get("username")
    password = hash_password(request.json.get("password"))

    user = next((u for u in users if u["username"] == username and u["password"] == password), None)

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": "Login successful"}), 200
