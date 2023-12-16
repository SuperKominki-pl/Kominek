from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/api/home", methods=["GET"])
def return_home():
    return jsonify({
    "message": "seewruuk to kozak"
    })

if __name__ == "__main__":
    app.run(port=8080)
