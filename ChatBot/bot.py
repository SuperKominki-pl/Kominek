from flask import Flask
import openai
import gradio as gr


app = Flask(__name__)

openai.api_key = ""

system_message = """You are customer support for 
problems with using the electric fireplace management application. You are helping
customers with this chimney """


@app.route('/chat', methods=['Post'])
def responseGPT(user_message, history):
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
            yield partial_message


custom_chatbot = gr.Chatbot([(None, "Hello. I'm your AI customer support. If you need help, do not be afraid to talk "
                                    "with me!")], elem_id="chatbot", label="Chatbot")

with gr.Blocks() as demo:
    # with gr.Row():
    # gr.ChatInterface(fn=responseGPT)
    gr.ChatInterface(
        fn=responseGPT,
        chatbot=custom_chatbot
    )

demo.queue().launch(share=True, debug=True)
