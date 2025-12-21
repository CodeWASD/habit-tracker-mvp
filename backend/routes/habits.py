from flask import Blueprint, request, jsonify
from datetime import date
from storage import read_db, write_db

habits_bp = Blueprint("habits", __name__)

@habits_bp.route("", methods=["POST"])
def add_habit():
    data = read_db()
    habits = data.get("habits", [])

    payload = request.get_json()
    title = payload.get("title")

    if not title:
        return jsonify({"error": "Title is required"}), 400

    new_id = max([h["id"] for h in habits], default=0) + 1

    habit = {
        "id": new_id,
        "title": title,
        "created_at": str(date.today()),
        "done_dates": []
    }

    habits.append(habit)
    data["habits"] = habits
    write_db(data)

    return jsonify(habit), 201

@habits_bp.route("", methods=["GET"])
def list_habits():
    data = read_db()
    return jsonify(data.get("habits", [])), 200


@habits_bp.route("/<int:habit_id>/done", methods=["POST"])
def mark_done(habit_id):
    data = read_db()
    habits = data.get("habits", [])
    today = str(date.today())

    for habit in habits:
        if habit["id"] == habit_id:
            if today not in habit["done_dates"]:
                habit["done_dates"].append(today)
                write_db(data)
            return jsonify(habit), 200

    return jsonify({"error": "Habit not found"}), 404

@habits_bp.route("/<int:habit_id>", methods=["DELETE"])
def delete_habit(habit_id):
    data = read_db()
    habits = data.get("habits", [])

    new_habits = [h for h in habits if h["id"] != habit_id]

    if len(new_habits) == len(habits):
        return jsonify({"error": "Habit not found"}), 404

    data["habits"] = new_habits
    write_db(data)
    return jsonify({"message": "Habit deleted"}), 200
