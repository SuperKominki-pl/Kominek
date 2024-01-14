from flask import Flask, jsonify, request

app = Flask(__name__)

# Data simulating information about the fireplace
fireplace = {
    "temperature": 25,
    "color": "red",
    "mode": "normal"
}

@app.route('/info', methods=['GET'])
def get_info():
    return jsonify(fireplace)

@app.route('/change_temperature', methods=['POST'])
def change_temperature():
    if not request.is_json:
        return jsonify({"error": "Invalid JSON format"}), 400

    data = request.get_json()
    if 'temperature' not in data:
        return jsonify({"error": "Missing 'temperature' in JSON"}), 400

    try:
        temperature = float(data['temperature'])
        fireplace['temperature'] = temperature
        return jsonify({"message": "Temperature changed"}), 200
    except ValueError:
        return jsonify({"error": "Invalid value for 'temperature'"}), 400

@app.route('/change_color', methods=['POST'])
def change_color():
    if not request.is_json:
        return jsonify({"error": "Invalid JSON format"}), 400

    data = request.get_json()
    if 'color' not in data:
        return jsonify({"error": "Missing 'color' in JSON"}), 400

    fireplace['color'] = data['color']
    return jsonify({"message": "Color changed"}), 200

@app.route('/change_mode', methods=['POST'])
def change_mode():
    if not request.is_json:
        return jsonify({"error": "Invalid JSON format"}), 400

    data = request.get_json()
    if 'mode' not in data:
        return jsonify({"error": "Missing 'mode' in JSON"}), 400

    fireplace['mode'] = data['mode']
    return jsonify({"message": "Mode changed"}), 200

if __name__ == '__main__':
    app.run(debug=True)
