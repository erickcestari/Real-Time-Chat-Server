import fastify from "fastify";
import { Server } from "socket.io";
import { userRoutes } from "./routes/userRoutes";
import { messageRoutes } from "./routes/messageRoutes";

const app = fastify();

const io = new Server(app.server);

io.on("connection", (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket
    .on("chat message", (msg) => {
      console.log(msg)
    })
});


app.register(userRoutes, { prefix: "/user" });
app.register(messageRoutes, { prefix: "/message" })

app.get('/', (req, res) => {
  return { message: 'Hello World!' }
})

app.listen({
  port: Number(process.env.API_PORT),
}).then(() => console.log(`Server is running on port ${process.env.API_PORT}`));