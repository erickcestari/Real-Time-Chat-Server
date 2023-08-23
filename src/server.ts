import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { Server, Socket } from "socket.io";
import { messageRoutes } from "./routes/messageRoutes";
import { userRoutes } from "./routes/userRoutes";
import { UserController } from "./controllers/userController";

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