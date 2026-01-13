import z from "zod";

const GigSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  budget: z
    .number()
    .positive("Budget must be positive.")
    .min(1, "Budget must be greater than 0."),
});

export default GigSchema;
