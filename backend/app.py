from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def health_check():
    return jsonify({
        "status": "ok",
        "message": "Habit Tracker backend is running"
    })

if __name__ == "__main__":
    app.run(debug=True)

