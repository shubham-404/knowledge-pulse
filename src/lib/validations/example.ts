import * as z from "zod";

export const exampleSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be at most 50 characters."),

  email: z.email("Please enter a valid email address."),
});

export type ExampleFormData = z.infer<typeof exampleSchema>;