import { MessageRepository } from "../repository/messageRepository";
import { UserRepository } from "../repository/userRepository";

export class UserController {
  async getLastUsers(name: string) {
    try {
      const userRepository = new UserRepository()
      const messageRepository = new MessageRepository()
      const user = await userRepository.getByName(name)

      const userId = user[0].id

      const messages = await messageRepository.getRecentsMessages(userId)

      return messages
    }
    catch (error) {
      console.log(error)
      return error
    }
  }
}