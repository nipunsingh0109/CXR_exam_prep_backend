import { z } from 'zod';

export const getPyqParamsSchema = z.object({
  params: z.object({
    pyqId: z.string().uuid('Invalid PYQ ID format'),
  }),
});
