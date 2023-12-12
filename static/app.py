from flask import Flask

app = Flask(__name__)


@app.route('/<name>')
def hello_world(name):
    """
    @:param name -> name of user
    :return: Hello World!
    """
    return 'Hello World!'


if __name__ == '__main__':
    app.run()