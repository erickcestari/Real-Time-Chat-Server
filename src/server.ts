import fastify from "fastify";
import { Server } from "socket.io";

const app = fastify();

const io = new Server(app.server);

io.on("connection", (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.get('/',  (req, res) => {
  return {message: 'Hello World!'}
})

app.listen({
  port: Number(process.env.API_PORT),
}).then(() => console.log(`Server is running on port ${process.env.API_PORT}`));