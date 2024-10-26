document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const chatBox = document.getElementById('chat-box');
    const messageInput = document.getElementById('message');
    const sendButton = document.getElementById('send-btn');

    const encryptionKey = "45yreijo254vnm5v4y2m8n90um5ncy89240wv5m4cyopiuwyvoinwvyinlowy5goiloi"; // Замените на общий или сгенерированный ключ

    // Функция для шифрования сообщения
    function encryptMessage(message) {
        return CryptoJS.AES.encrypt(message, encryptionKey).toString();
    }

    // Функция для расшифровки сообщения
    function decryptMessage(encryptedMessage) {
        const bytes = CryptoJS.AES.decrypt(encryptedMessage, encryptionKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    // Обработчик кнопки отправки
    sendButton.addEventListener('click', () => {
        const message = messageInput.value;
        if (message.trim()) {
            // Шифруем сообщение перед отправкой
            const encryptedMessage = encryptMessage(message);
            socket.emit('message', { username, message: encryptedMessage });
            messageInput.value = '';
        }
    });

    // Обработчик события получения сообщения
    socket.on('message', (data) => {
        // Расшифровываем сообщение перед отображением
        const decryptedMessage = decryptMessage(data.message);

        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `
            <span class="username">${data.username}</span>: ${decryptedMessage}
            <span class="time">${data.time}</span>
        `;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    // Отправка по нажатию Enter
    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });
});
