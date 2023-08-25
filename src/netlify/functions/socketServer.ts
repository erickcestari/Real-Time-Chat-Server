import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { Server, Socket } from "socket.io";
import { MessageController } from "../../controllers/messageController";
import { UserController } from "../../controllers/userController";

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
    const userController = new UserController()
    const user: any = await userController.getUserByName(username.toLocaleLowerCase())
    socket.emit("author", user)
    await userController.updateUserStatus(user.id, 'online')
    
    const allUsers = await userController.getUsers()
    socket.emit("getAllUsers", allUsers)
    socket.broadcast.emit("getAllUsers", allUsers)
  })

  socket.on("joinRoom", async (props: {authorId: string, receiverId: string}) => {
    const { authorId, receiverId } = props

    const messageController = new MessageController()
    const messages: any = await messageController.getMessagesChat(authorId, receiverId)
    const arrayUsers = [authorId, receiverId].sort()
    const roomName = arrayUsers.join("-")

    socket.data.authorId = authorId
    socket.join(roomName)
    socket.emit("receiveMessage", messages)
  })

  socket.on("sendMessage", async (props: {authorId: string, receiverId: string, content: string}) => {
    const { authorId, receiverId, content } = props
    const messageController = new MessageController()
    await messageController.createNewMessage(authorId, receiverId, content)
    const arrayUsers = [authorId, receiverId].sort()
    const roomName = arrayUsers.join("-")

    socket.join(roomName)
    
    const messages = await messageController.getMessagesChat(authorId, receiverId)
    socket.to(roomName).emit("receiveMessage", messages)
    socket.emit("receiveMessage", messages)
  })

  socket.on('disconnect', async () => {
    const userController = new UserController()
    
    await userController.updateUserStatus(socket.data.authorId, 'offline')
    
    const allUsers = await userController.getUsers()
    socket.emit("getAllUsers", allUsers)
    socket.broadcast.emit("getAllUsers", allUsers)
    console.log('user disconnected');
  });
});

exports.handler = app;