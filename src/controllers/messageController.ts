import { MessageRepository } from "../repository/messageRepository";
import { UserRepository } from "../repository/userRepository";

export class MessageController {
  async getLastMessages(name: string) {
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

  async getLastMessagesById(id: string) {
    try {
      const messageRepository = new MessageRepository()
      const messages = await messageRepository.getRecentsMessages(id)

      return messages
    }
    catch (error) {
      console.log(error)
      return error
    }
  }

  async createNewMessage(authorId: string, receiverId: string, content: string) {
    try {
      const messageRepository = new MessageRepository()
      const message = await messageRepository.post(authorId, receiverId, content)

      return message
    }
    catch (error) {
      console.log(error)
      return error
    }
  }
}