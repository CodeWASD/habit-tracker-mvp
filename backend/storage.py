import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DB_FILE = DATA_DIR / "db.json"

def read_db():
    if not DB_FILE.exists():
        return {"users": [], "habits": []}
    with open(DB_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def write_db(data):
    DATA_DIR.mkdir(exist_ok=True)
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
