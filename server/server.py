from flask import Flask, jsonify, request

app = Flask(__name__)

# Dane symulujące informacje o kominkach
fireplaces = [
    {
        "id": 1,
        "temperature": 25,
        "color": "red",
        "mode": "normal",
        "status": True
    },
]

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
    fireplace = find_fireplace(fireplace_id)
    if fireplace:
        return jsonify(fireplace)
    else:
        return jsonify({"error": f"Nie znaleziono kominka o identyfikatorze {fireplace_id}"}), 404


@app.route('/change_temperature/<int:fireplace_id>', methods=['POST'])
def change_temperature(fireplace_id):
    """
    Funkcja zmieniająca temperaturę w kominku o podanym ID
    :param fireplace_id: id kominka int
    :return: json w formacie "error"/"message": treść;
             kod HTTP
    """
    fireplace = find_fireplace(fireplace_id)
    if not fireplace:
        return jsonify({"error": f"Nie znaleziono kominka o identyfikatorze {fireplace_id}"}), 404

    if not request.is_json:
        return jsonify({"error": "Nieprawidłowy format JSON"}), 400

    data = request.get_json()
    if 'temperature' not in data:
        return jsonify({"error": "Brak wartości 'temperature' w JSON"}), 400

    try:
        temperature = float(data['temperature'])
        fireplace['temperature'] = temperature
        return jsonify({"message": "Zmieniono temperaturę"}), 200
    except ValueError:
        return jsonify({"error": "Nieprawidłowa wartość dla 'temperature'"}), 400


@app.route('/change_color/<int:fireplace_id>', methods=['POST'])
def change_color(fireplace_id):
    """
    Funkcja zmieniająca kolor kominka o podanym ID
    :param fireplace_id: id kominka int
    :return: json w formacie "error"/"message": treść;
             kod HTTP
    """
    fireplace = find_fireplace(fireplace_id)
    if not fireplace:
        return jsonify({"error": f"Nie znaleziono kominka o identyfikatorze {fireplace_id}"}), 404

    if not request.is_json:
        return jsonify({"error": "Nieprawidłowy format JSON"}), 400

    data = request.get_json()
    if 'color' not in data:
        return jsonify({"error": "Brak wartości 'color' w JSON"}), 400

    new_color = data['color']
    if not is_valid_color_format(new_color):
        return jsonify({"error": "Nieprawidłowy format koloru. Użyj formatu szesnastkowego (#RRGGBB lub #RGB)"}), 400

    fireplace['color'] = new_color
    return jsonify({"message": "Zmieniono kolor"}), 200

@app.route('/change_mode/<int:fireplace_id>', methods=['POST'])
def change_mode(fireplace_id):
    """
    Funkcja zmieniająca tryb kominka o podanym ID
    :param fireplace_id: id kominka int
    :return: json w formacie "error"/"message": treść;
             kod HTTP
    """
    fireplace = find_fireplace(fireplace_id)
    if not fireplace:
        return jsonify({"error": f"Nie znaleziono kominka o identyfikatorze {fireplace_id}"}), 404

    if not request.is_json:
        return jsonify({"error": "Nieprawidłowy format JSON"}), 400

    data = request.get_json()
    if 'mode' not in data:
        return jsonify({"error": "Brak wartości 'mode' w JSON"}), 400

    fireplace['mode'] = data['mode']
    return jsonify({"message": "Zmieniono tryb"}), 200

@app.route('/change_status/<int:fireplace_id>', methods=['POST'])
def change_status(fireplace_id):
    """
    Funkcja włączająca/wyłączająca kominek o podanym ID
    :param fireplace_id: id kominka int
    :return: json w formacie "error"/"message": treść;
             kod HTTP
    """

    fireplace = find_fireplace(fireplace_id)
    if not fireplace:
        return jsonify({"error": f"Nie znaleziono kominka o identyfikatorze {fireplace_id}"}), 404

    if not request.is_json:
        return jsonify({"error": "Nieprawidłowy format JSON"}), 400

    data = request.get_json()
    if 'status' not in data:
        return jsonify({"error": "Brak wartości 'status' w JSON"}), 400

    fireplace['status'] = bool(data['status'])
    return jsonify({"message": "Zmieniono status"}), 200

@app.route('/add_fireplace', methods=['POST'])
def add_fireplace():
    """
    Funkcja dodająca kominek
    :return: json w formacie {"error"/"message": treść, "id": id_dodanego_kominka;
             kod HTTP
    """
    if not request.is_json:
        return jsonify({"error": "Nieprawidłowy format JSON"}), 400

    data = request.get_json()
    new_fireplace = {
        "id": len(fireplaces) + 1,
        "temperature": data.get('temperature', 25),
        "color": data.get('color', 'red'),
        "mode": data.get('mode', 'normal'),
        "status": bool(data.get('status', True))
    }

    fireplaces.append(new_fireplace)
    return jsonify({"message": "Dodano kominek", "id": new_fireplace['id']}), 201

def find_fireplace(fireplace_id):
    """
    Funkcja znajdująca kominek w wektorze
    :param fireplace_id: int
    :return: Obiekt kominka o podanym ID
            Pusty jeśli nie znaleźiono
    """
    for fireplace in fireplaces:
        if fireplace['id'] == fireplace_id:
            return fireplace
    return None

def is_valid_color_format(color):
    """
    Funkcja sprawdzająca czy podany kolor jest w formacje hexadecymalnym #fff lub #ffffff
    :param color: string
    :return: bool
    """
    return re.match(r'^#(?:[0-9a-fA-F]{3}){1,2}$', color)

if __name__ == '__main__':
    app.run(debug=True)
