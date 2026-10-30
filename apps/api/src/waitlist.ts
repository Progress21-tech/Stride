import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

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

    const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !anonKey) return reply.code(503).send({ message: 'Waitlist signup is temporarily unavailable.' });

    try {
      const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/waitlist_entries?on_conflict=email`, {
        method: 'POST',
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=ignore-duplicates,return=minimal',
        },
        body: JSON.stringify({ email: parsed.data.email.toLowerCase(), consent_version: 'launch-updates-2026-10' }),
      });
      if (!response.ok) {
        request.log.error({ statusCode: response.status }, 'Supabase waitlist write failed.');
        return reply.code(503).send({ message: 'We could not save your request right now. Please try again later.' });
      }
    } catch {
      request.log.error('Supabase waitlist request failed.');
      return reply.code(503).send({ message: 'We could not save your request right now. Please try again later.' });
    }
    return reply.code(202).send({ message: 'Thanks. If the address is eligible, it will be added to the launch list.' });
  });
}
