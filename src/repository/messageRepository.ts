import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import z from 'zod';

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
  async post(authorId: string, receiverId: string, content: string) {
    return await prisma.message.create({
      data: {
        authorId,
        receiverId,
        content
      },
    });
  }
}