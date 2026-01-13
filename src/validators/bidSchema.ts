import z from "zod";

const BidSchema = z.object({
  gigId: z.string().min(1, "Gig ID is required."),
  message: z.string().min(1, "Message is required."),
  price: z
    .number()
    .positive("Bid must be positive.")
    .min(1, "Bid must be greater than 0."),
});

export default BidSchema;
