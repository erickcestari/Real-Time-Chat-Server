import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from 'zod';
import { MessageRepository } from "../repository/messageRepository";

export const messageRoutes = async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'GET',
    url: '/',
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const messageRepository = new MessageRepository()
        const list = await messageRepository.get();
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
        const bodySchema = z.object({
          authorId: z.string().uuid(),
          receiverId: z.string().uuid(),
          content: z.string()
        })
        const { authorId, receiverId, content } = bodySchema.parse(request.body);
        const messageRepository = new MessageRepository();
        const message = await messageRepository.post(authorId, receiverId, content);
        return reply.status(201).send(message);
      } catch (error) {
        console.log(error)
        return error
      }
    }
  })
}