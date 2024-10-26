from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import SocketIO, send, emit
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app)

users = {}

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        username = request.form.get('username')
        if username:
            session['username'] = username
            return redirect(url_for('chat'))
    return render_template('login.html')

@app.route('/chat')
def chat():
    if 'username' not in session:
        return redirect(url_for('index'))
    return render_template('index.html', username=session['username'])

@socketio.on('message')
def handle_message(data):
    username = data['username']
    message = data['message']
    print(f"Received encrypted message from {username}: {message}")  # Логируем зашифрованное сообщение

    timestamp = datetime.now().strftime('%H:%M')
    emit('message', {'username': username, 'message': message, 'time': timestamp}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True, host='192.168.1.105')
