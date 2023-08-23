import io from 'socket.io-client';

const socket = io("http://localhost:3333");

socket.on("connect", () => {
  console.log("Connected to server.");

  socket.emit("chat message", "Hello from client!");

  socket.on("chat message", (msg) => {
    console.log("Message from server:", msg);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server.");
  });
});