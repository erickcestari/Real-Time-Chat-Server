import io from 'socket.io-client'

// Conectar ao servidor Socket.IO
const socket = io("http://localhost:3333");

// Evento quando a conexão é estabelecida
socket.on("connect", () => {
  console.log("Connected to server.");

  // Enviar uma mensagem ao servidor
  socket.emit("chat message", "Hello from client!");

  // Evento para receber mensagens do servidor
  socket.on("chat message", (msg) => {
    console.log("Message from server:", msg);
  });

  // Evento quando a conexão é fechada
  socket.on("disconnect", () => {
    console.log("Disconnected from server.");
  });
});