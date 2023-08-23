import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { messageRoutes } from "./routes/messageRoutes";
import { userRoutes } from "./routes/userRoutes";

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