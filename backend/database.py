import json
import os

DB_PATH = "backend/data/db.json"

def load_db():
    if not os.path.exists(DB_PATH):
        return {"users": [], "habits": [], "records": []}
    with open(DB_PATH, "r") as f:
        return json.load(f)

def save_db(data):
    with open(DB_PATH, "w") as f:
        json.dump(data, f, indent=4)
