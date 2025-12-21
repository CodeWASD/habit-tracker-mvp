from flask import Flask, jsonify
from routes.auth import auth_bp
from routes.habits import habits_bp

app = Flask(__name__)

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(habits_bp, url_prefix="/api/habits")

if __name__ == "__main__":
    app.run(debug=True)
