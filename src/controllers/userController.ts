import { MessageRepository } from "../repository/messageRepository";
import { UserRepository } from "../repository/userRepository";

export class UserController {
  async getUsers() {
    try {
      const userRepository = new UserRepository()
      return userRepository.get()
    }
    catch (error) {
      console.log(error)
      return error
    }
  }

  async getUserByName(name: string) {
    try {
      const userRepository = new UserRepository()
      const user = await userRepository.getByName(name)

      if (user.length === 0) {
        const newUser = await userRepository.post(name)

        return newUser
      }

      return user[0]
    }
    catch (error) {
      console.log(error)
      return error
    }
  }

  async updateUserStatus(id: string, status: string) {
    try {
      const userRepository = new UserRepository()
      const user = await userRepository.getById(id)

      if (user.length === 0) {
        return { message: 'User not found' }
      }

      const updatedUser = await userRepository.put({ ...user[0], status })

      return updatedUser
    }
    catch (error) {
      console.log(error)
      return error
    }
  }
}