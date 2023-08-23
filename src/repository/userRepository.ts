import { User } from "@prisma/client";
import { prisma } from "../lib/prisma";

export class UserRepository {
  async get() {
    return prisma.user.findMany({
      include: {
        messagesReceived: true,
        messagesSent: true,
      }
    })
  }

  async getByName(name: string) {
    return await prisma.user.findMany({
      where: {
        name: name
      }
    })
  }

  async getById(id: string) {
    return await prisma.user.findMany({
      where: {
        id: id
      }
    })
  }

  async post(name: string) {
    return await prisma.user.create({
      data: {
        name
      },
    });
  }

  async put(userData: User) {
    return await prisma.user.update({
      where: {
        id: userData.id
      },
      data: {
        ...userData
      }
    })
  }
}