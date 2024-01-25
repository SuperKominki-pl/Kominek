from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import datetime

app = Flask(__name__)

# Konfiguracja SQLAlchemy
user = 'fireplace'
password = 'I<KrWL;Ii80Ce9j'
host = 'localhost'
database = 'fireplacesdb'
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql://{user}:{password}@{host}/{database}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
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


class EnergyUsage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fireplace_id = db.Column(db.Integer, nullable=False)
    energy_consumed = db.Column(db.Float)
    timestamp = db.Column(db.DateTime, default=datetime)

    def to_dict(self):
        return {
            "id": self.id,
            "fireplace_id": self.fireplace_id,
            "energy_consumed": self.energy_consumed,
            "timestamp": self.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }


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
        return jsonify({"error": f"Fireplace {fireplace_id}{fireplace} not found"}), 404


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


@app.route('/add_energy_usage', methods=['POST'])
def add_energy_usage():
    """
    Funkcja dodająca nowy wpis do tabeli zużycia energii.
    :return: JSON w formacie: "error"/"message": "treść"
             kod HTTP
    """
    if not request.is_json:
        return jsonify({"error": "Invalid JSON"}), 400

    data = request.get_json()
    new_energy_usage = EnergyUsage(
        fireplace_id=data.get('fireplace_id'),
        energy_consumed=data.get('energy_consumed')
    )

    db.session.add(new_energy_usage)
    db.session.commit()
    return jsonify({"message": "Energy usage added", "id": new_energy_usage.id}), 201


@app.route('/get_energy_usage/<int:fireplace_id>/<string:time_interval>', methods=['GET'])
def get_energy_usage(fireplace_id, time_interval):
    """
    Funkcja zwracająca zużycie energii kominka z podanym id w podanym interwale czasowym.
    :param fireplace_id: id kominka.
    :param time_interval: interwał czasowy: należący do ['days', 'weeks', 'months'].
    :return: json ze zużyciem energii.
    """

    valid_intervals = ['days', 'weeks', 'months']

    if time_interval not in valid_intervals:
        return jsonify({"error": "Invalid time interval"}), 400

    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=7)  # Default: last 7 days

    if time_interval == 'weeks':
        start_date = end_date - timedelta(weeks=4)  # Last 4 weeks
    elif time_interval == 'months':
        start_date = end_date - timedelta(days=365)  # Last 12 months

    energy_data = EnergyUsage.query.filter_by(fireplace_id=fireplace_id).filter(
        EnergyUsage.timestamp.between(start_date, end_date)
    ).all()

    return jsonify([entry.to_dict() for entry in energy_data])


if __name__ == '__main__':
    app.run(host='51.68.155.42')
