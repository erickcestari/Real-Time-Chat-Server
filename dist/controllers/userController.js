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
exports.UserController = void 0;
const userRepository_1 = require("../repository/userRepository");
class UserController {
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRepository = new userRepository_1.UserRepository();
                return userRepository.get();
            }
            catch (error) {
                console.log(error);
                return error;
            }
        });
    }
    getUserByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRepository = new userRepository_1.UserRepository();
                const user = yield userRepository.getByName(name);
                if (user.length === 0) {
                    const newUser = yield userRepository.post(name);
                    return newUser;
                }
                return user[0];
            }
            catch (error) {
                console.log(error);
                return error;
            }
        });
    }
    updateUserStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRepository = new userRepository_1.UserRepository();
                const user = yield userRepository.getById(id);
                if (user.length === 0) {
                    return { message: 'User not found' };
                }
                const updatedUser = yield userRepository.put(Object.assign(Object.assign({}, user[0]), { status }));
                return updatedUser;
            }
            catch (error) {
                console.log(error);
                return error;
            }
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map