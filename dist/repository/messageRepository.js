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
exports.MessageRepository = void 0;
const prisma_1 = require("../lib/prisma");
class MessageRepository {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.message.findMany({
                include: {
                    authorUser: true,
                    receiverUser: true
                }
            });
        });
    }
    getRecentsMessages(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.message.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                where: {
                    OR: [
                        {
                            authorId: id
                        },
                        {
                            receiverId: id
                        }
                    ]
                },
                include: {
                    authorUser: true,
                    receiverUser: true
                }
            });
        });
    }
    getMessagesChat(authorId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.message.findMany({
                orderBy: {
                    createdAt: 'asc'
                },
                where: {
                    OR: [
                        {
                            authorId: authorId,
                            receiverId: receiverId
                        },
                        {
                            authorId: receiverId,
                            receiverId: authorId
                        }
                    ]
                },
                include: {
                    authorUser: true,
                    receiverUser: true
                }
            });
        });
    }
    post(authorId, receiverId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.message.create({
                data: {
                    authorId,
                    receiverId,
                    content
                }
            });
        });
    }
}
exports.MessageRepository = MessageRepository;
//# sourceMappingURL=messageRepository.js.map