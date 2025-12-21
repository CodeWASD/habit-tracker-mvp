from flask import Blueprint, request, jsonify
import hashlib
from storage import read_db, write_db

auth_bp = Blueprint("auth", __name__)


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


@auth_bp.route("/register", methods=["POST"])
def register():
    data = read_db()
    users = data.get("users", [])

    payload = request.get_json()
    username = payload.get("username")
    password = payload.get("password")

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    if any(u["username"] == username for u in users):
        return jsonify({"error": "User already exists"}), 400

    users.append({
        "username": username,
        "password": hash_password(password)
    })

    data["users"] = users
    write_db(data)

    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = read_db()
    users = data.get("users", [])

    payload = request.get_json()
    username = payload.get("username")
    password = payload.get("password")

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    hashed = hash_password(password)
    user = next(
        (u for u in users if u["username"] == username and u["password"] == hashed),
        None
    )

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": "Login successful"}), 200
