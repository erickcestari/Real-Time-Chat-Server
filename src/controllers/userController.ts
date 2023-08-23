import { MessageRepository } from "../repository/messageRepository";
import { UserRepository } from "../repository/userRepository";

export class UserController {
  async getUsers(name: string) {
    try {
      const userRepository = new UserRepository()
      const messageRepository = new MessageRepository()
      const user = await userRepository.getByName(name)

      if(user.length === 0) {
        const newUser = await userRepository.post(name)
        return userRepository.get()
      }
      return userRepository.get()
    }
    catch (error) {
      console.log(error)
      return error
    }
  }
}