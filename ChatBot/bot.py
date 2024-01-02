from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

openai.api_key = "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"

system_message = """You are customer support for 
problems with using the electric fireplace management application. You are helping
customers with this chimney """


@app.route('/chat', methods=['Post'])
def chat(user_message, history):
    max_history_length = 20
    history_openai_format = []
    data = request.get_json()

    if len(history) >= max_history_length:
        history = history[-(max_history_length - 1)]

    user_message = data['user_message']

    prompt = f"User: {user_message}\nChatBot:"

    response = openai.Completion.create(
        engine="gpt-4",
        messages=history_openai_format,
        temperature=0.5,
        stop=None,
        stream=True
    )

    chatbot_response = response.choices[0].text.strip()

    return jsonify({'chatbot_response': chatbot_response})


if __name__ == '__main__':
    app.run(debug=True)
