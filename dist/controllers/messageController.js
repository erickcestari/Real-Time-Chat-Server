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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const messageRepository_1 = require("../repository/messageRepository");
const userRepository_1 = require("../repository/userRepository");
class MessageController {
    getLastMessages(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRepository = new userRepository_1.UserRepository();
                const messageRepository = new messageRepository_1.MessageRepository();
                const user = yield userRepository.getByName(name);
                const userId = user[0].id;
                const messages = yield messageRepository.getRecentsMessages(userId);
                return messages;
            }
            catch (error) {
                console.log(error);
                return error;
            }
        });
    }
    getLastMessagesById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messageRepository = new messageRepository_1.MessageRepository();
                const messages = yield messageRepository.getRecentsMessages(id);
                return messages;
            }
            catch (error) {
                console.log(error);
                return error;
            }
        });
    }
    getMessagesChat(authorId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messageRepository = new messageRepository_1.MessageRepository();
                const messages = yield messageRepository.getMessagesChat(authorId, receiverId);
                return messages;
            }
            catch (error) {
                console.log(error);
                return error;
            }
        });
    }
    createNewMessage(authorId, receiverId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messageRepository = new messageRepository_1.MessageRepository();
                const message = yield messageRepository.post(authorId, receiverId, content);
                return message;
            }
            catch (error) {
                console.log(error);
                return error;
            }
        });
    }
}
exports.MessageController = MessageController;
//# sourceMappingURL=messageController.js.map