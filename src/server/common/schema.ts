import { z } from '@hono/zod-openapi';

export const errorSchema = z
  .object({
    code: z.number().optional().openapi({ type: 'number' }),
    message: z.string().openapi({ type: 'string' }),
    errors: z.any().optional().openapi({ type: 'object' }),
  })
  .strict();
