import { prisma } from "../lib/prisma";

export class MessageRepository {
  async get() {
    return await prisma.message.findMany({
      include: {
        authorUser: true,
        receiverUser: true
      }
    });
  }

  async getRecentsMessages(id: string) {
    return await prisma.message.findMany({
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
    })
  }

  async getMessagesChat(authorId: string, receiverId: string) {
    return await prisma.message.findMany({
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
    })
  }

  async post(authorId: string, receiverId: string, content: string) {
    return await prisma.message.create({
      data: {
        authorId,
        receiverId,
        content
      }
    });
  }
}