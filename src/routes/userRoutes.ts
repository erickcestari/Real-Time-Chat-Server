import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from 'zod';
import { UserRepository } from "../repository/userRepository";

export const userRoutes = async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'GET',
    url: '/',
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userRepository = new UserRepository()
        const list = await userRepository.get();
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
          name: z.string().max(35)
        })
        const { name } = bodySchema.parse(request.body);
        const userRepository = new UserRepository();
        const user = await userRepository.getByName(name);
        if (user.length > 0) {
          return reply.status(400).send({ message: 'User already exists' });
        }
        const newUser = await userRepository.post(name);
        return reply.status(201).send(newUser);
      } catch (error) {
        console.log(error)
        return error
      }
    }
  })

}