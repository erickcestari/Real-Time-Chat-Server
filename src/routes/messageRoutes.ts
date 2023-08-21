import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import z from 'zod';

export const messageRoutes = async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'GET',
    url: '/',
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const list = await prisma.message.findMany();
        return reply.status(200).send(list);
      } catch (error) {
        console.log(error)
        return error
      }
    },
  });

  fastify.route({
    method: 'POST',
    url: '/',
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        console.log(request.body)
        const bodySchema = z.object({
          authorId: z.string().uuid(),
          receiverId: z.string().uuid(),
          content: z.string()
        })
        const { authorId, receiverId, content } = bodySchema.parse(request.body);
        const message = await prisma.message.create({
          data: {
            authorId,
            receiverId,
            content
          },
        });
        return reply.status(201).send(message);
      } catch (error) {
        console.log(error)
        return error
      }
    }
  })

}