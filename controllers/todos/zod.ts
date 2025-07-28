import { z } from "zod";

export const zPostTodo = z.object({
  id: z.string().optional(),
  completed: z.boolean().default(false),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 50 characters"),
  description: z
    .string()
    .max(255, "Description must be less than 255 characters")
    .optional(),
});
