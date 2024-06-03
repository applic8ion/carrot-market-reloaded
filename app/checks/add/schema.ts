import { z } from "zod";

export const checkSchema = z.object({
  photo: z.string({
    required_error: "Photo is required",
  }),
  title: z.string({
    required_error: "Title is required",
  }),
  description: z.string(),
  amount: z.coerce.number({
    required_error: "Amount is required",
  }),
});

export type CheckType = z.infer<typeof checkSchema>;
