import { z } from "zod";
const codeSchema = z.object({
  code: z.string(),
});

const userSchema = z.object({
  id: z.number(),
  login: z.string(),
  name: z.string(),
  avatar_url: z.string().url(),
});

export { codeSchema, userSchema };
