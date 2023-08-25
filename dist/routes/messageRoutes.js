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
exports.messageRoutes = void 0;
const zod_1 = __importDefault(require("zod"));
const messageRepository_1 = require("../repository/messageRepository");
const messageRoutes = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.route({
        method: 'GET',
        url: '/',
        handler: (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const messageRepository = new messageRepository_1.MessageRepository();
                const list = yield messageRepository.get();
                return reply.status(200).send(list);
            }
            catch (error) {
                console.log(error);
                return error;
            }
        }),
    });
    fastify.route({
        method: 'POST',
        url: '/',
        handler: (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const bodySchema = zod_1.default.object({
                    authorId: zod_1.default.string().uuid(),
                    receiverId: zod_1.default.string().uuid(),
                    content: zod_1.default.string()
                });
                const { authorId, receiverId, content } = bodySchema.parse(request.body);
                const messageRepository = new messageRepository_1.MessageRepository();
                const message = yield messageRepository.post(authorId, receiverId, content);
                return reply.status(201).send(message);
            }
            catch (error) {
                console.log(error);
                return error;
            }
        })
    });
});
exports.messageRoutes = messageRoutes;
//# sourceMappingURL=messageRoutes.js.map