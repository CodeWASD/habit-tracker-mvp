from flask import Flask
from backend.routes.auth import auth

app = Flask(__name__)
app.register_blueprint(auth)

@app.route("/")
def home():
    return "Habit Tracker Backend is running"

if __name__ == "__main__":
    app.run(debug=True)

