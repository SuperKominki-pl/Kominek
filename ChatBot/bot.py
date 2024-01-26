from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app)

openai.api_key = ""

system_message = """You are customer support for 
problems with using the electric fireplace management application. You are helping
customers with this chimney """

custom_chatbot_message = """Hello. I'm your AI customer support. If you need help,
 do not be afraid to talk with me!"""


@app.route('/api/chatbot', methods=['POST'])
def chatbot_endpoint():
    data = request.json
    user_message = data.get('user_message', '')
    history = data.get('history', [])

    max_history_length = 16
    history_openai_format = []

    if len(history) >= max_history_length:
        history = history[-(max_history_length - 1):]

    for human, assistant in history:
        history_openai_format.append({"role": "user", "content": human})
        history_openai_format.append({"role": "assistant", "content": assistant})
    history_openai_format.append({"role": "user", "content": user_message})
    history_openai_format.insert(0, {"role": "system", "content": system_message})

    response = openai.ChatCompletion.create(
        model='gpt-4',
        messages=history_openai_format,
        temperature=0.5,
        stop=None,
        stream=True
    )

    partial_message = ""
    for chunk in response:
        if len(chunk['choices'][0]['delta']) != 0:
            partial_message = partial_message + chunk['choices'][0]['delta']['content']

    return jsonify({'response': partial_message, 'initial_message': custom_chatbot_message})


# Dodaj nowy endpoint dla początkowej wiadomości
@app.route('/api/chatbot/initial-message', methods=['GET'])
def get_initial_message():
    return jsonify({'initial_message': custom_chatbot_message})


if __name__ == '__main__':
    app.run(host='51.68.155.42', debug=True)
