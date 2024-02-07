import z from 'zod'
import { prisma } from '../../lib/prisma'
import type { FastifyInstance } from 'fastify'

export async function getPoll(app: FastifyInstance) {
  app.get('/polls/:pollId', async (request, reply) => {
    const getPollParams = z.object({
      pollId: z.string().uuid(),
    })

    const { pollId } = getPollParams.parse(request.params)

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    const totalVotes = await prisma.vote.count({
      where: {
        pollId: pollId,
      },
    })

    return reply.status(200).send({ poll, totalVotes })
  })
}
