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
exports.userRoutes = void 0;
const zod_1 = __importDefault(require("zod"));
const userRepository_1 = require("../repository/userRepository");
const userRoutes = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.route({
        method: 'GET',
        url: '/',
        handler: (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const userRepository = new userRepository_1.UserRepository();
                const list = yield userRepository.get();
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
                    name: zod_1.default.string().max(35)
                });
                const { name } = bodySchema.parse(request.body);
                const userRepository = new userRepository_1.UserRepository();
                const user = yield userRepository.getByName(name);
                if (user.length > 0) {
                    return reply.status(400).send({ message: 'User already exists' });
                }
                const newUser = yield userRepository.post(name);
                return reply.status(201).send(newUser);
            }
            catch (error) {
                console.log(error);
                return error;
            }
        })
    });
});
exports.userRoutes = userRoutes;
//# sourceMappingURL=userRoutes.js.map