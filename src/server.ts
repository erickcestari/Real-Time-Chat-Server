import fastify from "fastify";
import { Server } from "socket.io";
import { userRoutes } from "./routes/userRoutes";
import { messageRoutes } from "./routes/messageRoutes";
import { UserController } from "./controllers/userController";
import fastifyCors from "@fastify/cors";
import { MessageController } from "./controllers/messageController";
import { MessageRepository } from "./repository/messageRepository";
import { Message } from "@prisma/client";
import { UserRepository } from "./repository/userRepository";
const app = fastify();

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  exposedHeaders: [],
  credentials: true,
});

const io = require('socket.io')(app.server, {
  cors: {
    origin: '*',
  }
});

io.on("connection", (socket: any) => {
  socket.on("join", async (username: string) => {
    console.log(username, socket.id)
    const userController = new UserController()
    const messageController = new MessageController()
    const messages = await messageController.getLastMessages(username.toLowerCase())

    const users = await userController.getUsers(username.toLowerCase())

    socket.emit("users", users);
    socket.broadcast.emit("users", users);
    socket.emit("messages", messages);

  })
  socket.on("userAuthor", (username: string) => {
    const userController = new UserRepository()

    const user = userController.getByName(username.toLowerCase())
    socket.emit("userAuthor", user);
  })
  socket.on("sendMessage", async (message: Message) => {
    const { authorId, receiverId, content } = message
    const messageRepository = new MessageRepository()
    const messageController = new MessageController()

    await messageRepository.post(authorId, receiverId, content)

    const messages = await messageController.getLastMessagesById(authorId)

    console.log(messages)
    socket.emit("messages", messages);
    socket.broadcast.emit("messages", messages);
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


app.register(userRoutes, { prefix: "/user" });
app.register(messageRoutes, { prefix: "/message" })

app.get('/', (req, res) => {
  return { message: 'Hello World!' }
})

app.listen({
  port: Number(process.env.API_PORT),
}).then(() => console.log(`Server is running on port ${process.env.API_PORT}`));