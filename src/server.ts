import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { Server, Socket } from "socket.io";
import { messageRoutes } from "./routes/messageRoutes";
import { userRoutes } from "./routes/userRoutes";
import { UserController } from "./controllers/userController";
import { MessageController } from "./controllers/messageController";

const app = fastify();

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  exposedHeaders: [],
  credentials: true,
});

const io: Server = new Server(app.server, {
  cors: {
    origin: '*',
  }
});

io.on("connection", (socket: Socket) => {
  socket.on("join", async (username: string) => {
    console.log(username, socket.id)

    const userController = new UserController()
    const user = await userController.getUserByName(username.toLocaleLowerCase())
    socket.emit("author", user)
    
    const allUsers = await userController.getUsers()
    socket.emit("getAllUsers", allUsers)
    socket.broadcast.emit("getAllUsers", allUsers)
  })

  socket.on("joinRoom", async (props: {authorId: string, receiverId: string}) => {
    const { authorId, receiverId } = props
    const messageController = new MessageController()
    const messages = await messageController.getMessagesChat(authorId, receiverId)
    socket.emit("receiveMessage", messages)
    
  })

  socket.on("sendMessage", async (props: {authorId: string, receiverId: string, content: string}) => {
    const { authorId, receiverId, content } = props
    const messageController = new MessageController()
    await messageController.createNewMessage(authorId, receiverId, content)
    
    const messages = await messageController.getMessagesChat(authorId, receiverId)
    socket.emit("receiveMessage", messages)
    socket.broadcast.emit("updateMessages")
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


//app.register(userRoutes, { prefix: "/user" });
//app.register(messageRoutes, { prefix: "/message" })

app.get('/', (req, res) => {
  return { message: 'Hello World!' }
})

app.listen({
  port: Number(process.env.API_PORT),
}).then(() => console.log(`Server is running on port ${process.env.API_PORT}`));