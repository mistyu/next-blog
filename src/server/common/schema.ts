import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

export const errorSchema = z
  .object({
    code: z.number().optional().openapi({ type: 'number' }),
    message: z.string().openapi({ type: 'string' }),
    errors: z.any().optional().openapi({ type: 'object' }),
  })
  .strict();
