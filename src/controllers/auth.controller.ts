import type { Request, Response } from "express";
import z from "zod";
import User from "../models/User.js";
import emailQueue from "../queues/email.queue.js";
import { verificationEmailTemplate } from "../templates/emails/verification-email.js";
import { hashValue } from "../utils/hash.js";
import { generateVerificationCode } from "../utils/verification-code.js";
import SignupSchema from "../validators/signupSchema.js";

export const userSignup = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = SignupSchema.safeParse(data);
    if (result?.error) {
      const tree = z.treeifyError(result.error);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: tree?.properties || {},
      });
    }

    const { firstName, lastName, email, username, password } = result.data;

    const existingUsername = await User.findOne({ username });

    if (existingUsername)
      return res.status(400).json({
        success: false,
        message: "Username already exists.",
      });

    const existingEmail = await User.findOne({ email });

    if (existingEmail)
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });

    const hashedPassword: string = await hashValue(password);
    const verificationCode: string = generateVerificationCode();
    const hashedVerificationCode: string = await hashValue(verificationCode, 8);

    const user = new User({
      firstName,
      lastName,
      email,
      username,
      isVerified: false,
      password: hashedPassword,
      verificationCode: hashedVerificationCode,
      verificationCodeExpiry: Date.now() + 10 * 60 * 1000, // 10 mins
    });

    await user.save();
    await emailQueue.add(
      "send-verification-email",
      {
        to: email,
        subject: "Verify your email address",
        textMessage: `Your verification code is ${verificationCode}. 
This code will expire in 10 minutes.`,
        html: verificationEmailTemplate(verificationCode),
      },
      {
        attempts: 2,
        removeOnComplete: true,
      }
    );

    return res.status(201).json({
      success: true,
      message:
        "Your account has been created! Check your email to verify your account.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
