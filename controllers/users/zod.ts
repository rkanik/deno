import { z } from "zod";

export type TZPostUser = z.infer<typeof zPostUser>;
export const zPostUser = z.object({
  name: z.string().min(3, "Name is required!"),
  email: z.email("Please enter a valid email address!"),
  password: z.string().min(8, "Password must be at least 8 characters!"),
});
