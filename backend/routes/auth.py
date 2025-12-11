from flask import Blueprint, request, jsonify
import hashlib
from backend.database import load_db, save_db

auth = Blueprint("auth", __name__, url_prefix="/api")

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@auth.route("/register", methods=["POST"])
def register():
    data = load_db()
    users = data.get("users", [])

    username = request.json.get("username")
    password = request.json.get("password")

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    if any(u["username"] == username for u in users):
        return jsonify({"error": "User already exists"}), 400

    users.append({
        "username": username,
        "password": hash_password(password)
    })

    data["users"] = users
    save_db(data)
    return jsonify({"message": "User registered successfully"}), 201

@auth.route("/login", methods=["POST"])
def login():
    data = load_db()
    users = data.get("users", [])

    username = request.json.get("username")
    password = request.json.get("password")

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    hashed = hash_password(password)
    user = next((u for u in users if u["username"] == username and u["password"] == hashed), None)

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    # برای سادگی در این MVP، توکن حقیقی صادر نمی‌کنیم؛ فقط پیام موفقیت می‌دهیم.
    return jsonify({"message": "Login successful"}), 200
