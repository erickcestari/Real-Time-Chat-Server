import { MessageRepository } from "../repository/messageRepository";
import { UserRepository } from "../repository/userRepository";

export class UserController {
  async getLastsUsers(name: string) {
    try {
      const userRepository = new UserRepository()
      const messageRepository = new MessageRepository()
      const user = await userRepository.getByName(name)

      const messages = messageRepository.getRecentsMessages(user[0].id)

      return messages
    }
    catch (error) {
      console.log(error)
      return error
    }
  }
}