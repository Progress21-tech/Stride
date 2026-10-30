import { z } from 'zod';

export const problemSchema = z.object({
  type: z.string().url().or(z.literal('about:blank')),
  title: z.string().min(1),
  status: z.number().int().min(400).max(599),
  detail: z.string().optional(),
  code: z.string().min(1),
  requestId: z.string().optional(),
});

export type Problem = z.infer<typeof problemSchema>;
