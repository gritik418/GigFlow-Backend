import z from "zod";

const VerifyEmailSchema = z.object({
  email: z.email("Please enter a valid email address."),
  otp: z
    .string()
    .length(6)
    .regex(/^\d{6}$/, "OTP must be a 6-digit number"),
});

export default VerifyEmailSchema;
