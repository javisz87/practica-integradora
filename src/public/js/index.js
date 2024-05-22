const socket = io();

// Función para agregar mensajes al chat con nombre de usuario y fecha
function addMessage(username, message, timestamp) {
    const ul = document.getElementById('messages');
    const li = document.createElement('li');
    li.textContent = `${username}: ${message}-(${new Date(timestamp).toLocaleString()})`;
    ul.appendChild(li);
}

// Manejar el envío de mensajes desde el formulario
document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();
    const usernameInput = document.getElementById('username');
    const messageInput = document.getElementById('message');
    const username = usernameInput.value.trim();
    const message = messageInput.value.trim();
    if (username !== '' && message !== '') {
        const timestamp = Date.now();
        socket.emit('chat message', { username, message, timestamp }); // Enviar el mensaje al servidor
        messageInput.value = ''; // Limpiar el campo de mensaje
    }
});

// Escuchar los mensajes del servidor y agregarlos al chat
socket.on('chat message', function (data) {
    addMessage(data.username, data.message, data.timestamp);
});