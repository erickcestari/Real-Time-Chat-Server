import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import z from 'zod';

export const userRoutes = async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'GET',
    url: '/',
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const list = await prisma.user.findMany();
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
          name: z.string().min(3).max(255)
        })
        const { name } = bodySchema.parse(request.body);
        const user = await prisma.user.findMany({
          where: {
            name: name
          }
        })
        if (user.length > 0) {
          return reply.status(400).send({ message: 'User already exists' });
        }
        const newUser = await prisma.user.create({
          data: {
            name,
          },
        });
        return reply.status(201).send(newUser);
      } catch (error) {
        console.log(error)
        return error
      }
    }
  })

}