from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import re

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fireplaces.db'
db = SQLAlchemy(app)


class Fireplace(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    temperature = db.Column(db.Float)
    color = db.Column(db.String(7))  # Hex color code (e.g., #RRGGBB)
    mode = db.Column(db.String(50))
    status = db.Column(db.Boolean)

    def to_dict(self):
        return {
            "id": self.id,
            "temperature": self.temperature,
            "color": self.color,
            "mode": self.mode,
            "status": "On" if self.status else "Off"
        }


# Create tables based on the defined models
with app.app_context():
    db.create_all()


@app.route('/info/<int:fireplace_id>', methods=['GET'])
def get_info(fireplace_id):
    """
       Funkcja zwracająca informacje o kominku o podanym ID
       :param fireplace_id: id kominka int
       :return: json w formacie:
            "id": int,
            "temperature": float,
            "color": string zawierający hexadecymalny kolor,
            "mode": string z nazwą trybu,
            "status": bool (True -> "On", False -> "Off")
    """
    fireplace = Fireplace.query.get(fireplace_id)
    if fireplace:
        return jsonify(fireplace.to_dict())
    else:
        return jsonify({"error": f"Fireplace {fireplace_id} not found"}), 404


@app.route('/change_temperature/<int:fireplace_id>', methods=['POST'])
def change_temperature(fireplace_id):
    """
         Funkcja zmieniająca temperaturę w kominku o podanym ID
         :param fireplace_id: id kominka int
         :return: json w formacie "error"/"message": treść;
                  kod HTTP
    """
    fireplace = Fireplace.query.get(fireplace_id)
    if not fireplace:
        return jsonify({"error": f"Fireplace {fireplace_id} not found"}), 404

    if not request.is_json:
        return jsonify({"error": "Invalid JSON"}), 400

    data = request.get_json()
    if 'temperature' not in data:
        return jsonify({"error": "'temperature' not found in JSON"}), 400

    try:
        temperature = float(data['temperature'])
        fireplace.temperature = temperature
        db.session.commit()
        return jsonify({"message": "Temperature changed"}), 200
    except ValueError:
        return jsonify({"error": "Invalid 'temperature'"}), 400


@app.route('/change_color/<int:fireplace_id>', methods=['POST'])
def change_color(fireplace_id):
    """
         Funkcja zmieniająca kolor kominka o podanym ID
         :param fireplace_id: id kominka int
         :return: json w formacie "error"/"message": treść;
                  kod HTTP
    """

    fireplace = Fireplace.query.get(fireplace_id)
    if not fireplace:
        return jsonify({"error": f"Fireplace {fireplace_id} not found"}), 404

    if not request.is_json:
        return jsonify({"error": "Invalid JSON"}), 400

    data = request.get_json()
    if 'color' not in data:
        return jsonify({"error": "'color' is missing in JSON"}), 400

    new_color = data['color']
    if not is_valid_color_format(new_color):
        return jsonify({"error": "Invalid color format. Use hexadecimal format (#RRGGBB or #RGB)"}), 400

    fireplace.color = new_color
    db.session.commit()
    return jsonify({"message": "Color changed"}), 200


@app.route('/change_mode/<int:fireplace_id>', methods=['POST'])
def change_mode(fireplace_id):
    """
         Funkcja zmieniająca tryb kominka o podanym ID
         :param fireplace_id: id kominka int
         :return: json w formacie "error"/"message": treść;
                  kod HTTP
    """
    fireplace = Fireplace.query.get(fireplace_id)
    if not fireplace:
        return jsonify({"error": f"Fireplace {fireplace_id} not found"}), 404

    if not request.is_json:
        return jsonify({"error": "Invalid JSON"}), 400

    data = request.get_json()
    if 'mode' not in data:
        return jsonify({"error": "'mode' is missing in JSON"}), 400

    fireplace.mode = data['mode']
    db.session.commit()
    return jsonify({"message": "Mode changed"}), 200


@app.route('/change_status/<int:fireplace_id>', methods=['POST'])
def change_status(fireplace_id):
    """
         Funkcja włączająca/wyłączająca kominek o podanym ID
         :param fireplace_id: id kominka int
         :return: json w formacie "error"/"message": treść;
                  kod HTTP
    """
    fireplace = Fireplace.query.get(fireplace_id)
    if not fireplace:
        return jsonify({"error": f"Fireplace {fireplace_id} not found"}), 404

    if not request.is_json:
        return jsonify({"error": "Invalid JSON"}), 400

    data = request.get_json()
    if 'status' not in data:
        return jsonify({"error": "'status' is missing in JSON"}), 400

    fireplace.status = bool(data['status'])
    db.session.commit()
    return jsonify({"message": "Status changed"}), 200


@app.route('/add_fireplace', methods=['POST'])
def add_fireplace():
    """
      Funkcja dodająca kominek
       :return: json w formacie {"error"/"message": treść, "id": id_dodanego_kominka;
                  kod HTTP
    """

    if not request.is_json:
        return jsonify({"error": "Invalid JSON"}), 400

    data = request.get_json()
    new_fireplace = Fireplace(
        temperature=data.get('temperature', 25),
        color=data.get('color', '#FF0000'),
        mode=data.get('mode', 'normal'),
        status=bool(data.get('status', True))
    )

    db.session.add(new_fireplace)
    db.session.commit()
    return jsonify({"message": "Fireplace added", "id": new_fireplace.id}), 201


if __name__ == '__main__':
    app.run(debug=True)
