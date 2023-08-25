"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const socket = (0, socket_io_client_1.default)("http://localhost:3333");
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
//# sourceMappingURL=fakeUser.js.map