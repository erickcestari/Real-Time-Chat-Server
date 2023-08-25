"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("@fastify/cors"));
const fastify_1 = __importDefault(require("fastify"));
const socket_io_1 = require("socket.io");
const userController_1 = require("./controllers/userController");
const messageController_1 = require("./controllers/messageController");
const app = (0, fastify_1.default)();
app.register(cors_1.default, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    exposedHeaders: [],
    credentials: true,
});
const io = new socket_io_1.Server(app.server, {
    cors: {
        origin: '*',
    }
});
io.on("connection", (socket) => {
    socket.on("join", (username) => __awaiter(void 0, void 0, void 0, function* () {
        const userController = new userController_1.UserController();
        const user = yield userController.getUserByName(username.toLocaleLowerCase());
        socket.emit("author", user);
        yield userController.updateUserStatus(user.id, 'online');
        const allUsers = yield userController.getUsers();
        socket.emit("getAllUsers", allUsers);
        socket.broadcast.emit("getAllUsers", allUsers);
    }));
    socket.on("joinRoom", (props) => __awaiter(void 0, void 0, void 0, function* () {
        const { authorId, receiverId } = props;
        const messageController = new messageController_1.MessageController();
        const messages = yield messageController.getMessagesChat(authorId, receiverId);
        const arrayUsers = [authorId, receiverId].sort();
        const roomName = arrayUsers.join("-");
        socket.data.authorId = authorId;
        socket.join(roomName);
        socket.emit("receiveMessage", messages);
    }));
    socket.on("sendMessage", (props) => __awaiter(void 0, void 0, void 0, function* () {
        const { authorId, receiverId, content } = props;
        const messageController = new messageController_1.MessageController();
        yield messageController.createNewMessage(authorId, receiverId, content);
        const arrayUsers = [authorId, receiverId].sort();
        const roomName = arrayUsers.join("-");
        socket.join(roomName);
        const messages = yield messageController.getMessagesChat(authorId, receiverId);
        socket.to(roomName).emit("receiveMessage", messages);
        socket.emit("receiveMessage", messages);
    }));
    socket.on('disconnect', () => __awaiter(void 0, void 0, void 0, function* () {
        const userController = new userController_1.UserController();
        yield userController.updateUserStatus(socket.data.authorId, 'offline');
        const allUsers = yield userController.getUsers();
        socket.emit("getAllUsers", allUsers);
        socket.broadcast.emit("getAllUsers", allUsers);
        console.log('user disconnected');
    }));
});
//app.register(userRoutes, { prefix: "/user" });
//app.register(messageRoutes, { prefix: "/message" })
app.get('/', (req, res) => {
    return { message: 'Hello World!' };
});
app.listen({
    port: Number(process.env.API_PORT),
}).then(() => console.log(`Server is running on port ${process.env.API_PORT}`));
//# sourceMappingURL=server.js.map