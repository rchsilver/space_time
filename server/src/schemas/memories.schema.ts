import { z } from "zod";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const bodySchema = z.object({
  content: z.string(),
  coverUrl: z.string(),
  isPublic: z.coerce.boolean().default(false),
});

export { paramsSchema, bodySchema };
