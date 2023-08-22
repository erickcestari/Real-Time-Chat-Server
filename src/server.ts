import fastify from "fastify";
import { Server } from "socket.io";
import { userRoutes } from "./routes/userRoutes";
import { messageRoutes } from "./routes/messageRoutes";
import { UserController } from "./controllers/userController";

const app = fastify();

const io = new Server(app.server);

io.on("connection", (socket) => {
  socket.on("join", async (username: string) => {
    const userController = new UserController()
    if(username.includes('favicon') || username.includes('username')) return
    const messages = await userController.getLastUsers(username)
    console.log(username)
    console.log(messages)
    socket.emit("messages", messages);
    
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