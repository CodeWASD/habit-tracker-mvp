import json
import os

DB_PATH = "backend/data/db.json"

def load_db():
    if not os.path.exists(DB_PATH):
        
        return {"users": [], "habits": [], "records": []}
    with open(DB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_db(data):
    
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with open(DB_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
