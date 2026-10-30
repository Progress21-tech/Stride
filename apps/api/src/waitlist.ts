import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@sylpace/db';

const requestSchema = z.object({
  email: z.string().trim().email().max(320),
  consent: z.literal(true),
  website: z.string().max(300).optional(),
}).strict();

export async function registerWaitlistRoutes(app: FastifyInstance, options: { allowedOrigins: string[] }) {
  app.post('/join', { config: { rateLimit: { max: 5, timeWindow: '1 hour' } } }, async (request, reply) => {
    const origin = request.headers.origin;
    if (typeof origin !== 'string' || !options.allowedOrigins.includes(origin)) {
      return reply.code(403).send({ message: 'Request could not be accepted.' });
    }
    const parsed = requestSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ message: 'Enter a valid email and confirm consent to receive updates.' });
    if (parsed.data.website) return reply.code(202).send({ message: 'Thanks. If the address is eligible, it will be added to the launch list.' });

    try {
      await prisma.waitlistEntry.create({ data: { email: parsed.data.email.toLowerCase(), consentVersion: 'launch-updates-2026-10' } });
    } catch (error) {
      if (!(typeof error === 'object' && error && 'code' in error && error.code === 'P2002')) {
        request.log.error('Waitlist submission could not be saved.');
        return reply.code(503).send({ message: 'We could not save your request right now. Please try again later.' });
      }
    }
    return reply.code(202).send({ message: 'Thanks. If the address is eligible, it will be added to the launch list.' });
  });
}
