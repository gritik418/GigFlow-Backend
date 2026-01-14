import type { Request, Response } from "express";
import z from "zod";
import { cookieOptions } from "../constants/cookie.js";
import { GIGFLOW_TOKEN } from "../constants/index.js";
import User from "../models/User.js";
import { hashValue, verifyHash } from "../utils/hash.js";
import { generateAuthToken } from "../utils/token.js";
import LoginSchema from "../validators/loginSchema.js";
import SignupSchema from "../validators/signupSchema.js";
import VerifyEmailSchema from "../validators/verifyEmailSchema.js";

export const userSignup = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = SignupSchema.safeParse(data);
    if (!result.success) {
      const tree = z.treeifyError(result.error);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: tree?.properties || {},
      });
    }

    const { firstName, lastName, email, username, password } = result.data;

    const existingUsername: UserInterface | null = await User.findOne({
      username,
    });

    if (existingUsername) {
      if (existingUsername.isVerified) {
        return res.status(400).json({
          success: false,
          message: "Username already exists.",
        });
      }
      await User.findByIdAndDelete(existingUsername._id);
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      if (existingEmail.isVerified) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
        });
      }

      await User.findByIdAndDelete(existingEmail._id);
    }

    const hashedPassword: string = await hashValue(password);
    // const verificationCode: string = generateVerificationCode();
    // const hashedVerificationCode: string = await hashValue(verificationCode, 8);

    const user = new User({
      firstName,
      lastName,
      email,
      username,
      isVerified: true,
      password: hashedPassword,
      // verificationCode: hashedVerificationCode,
      // verificationCodeExpiry: Date.now() + 10 * 60 * 1000, // 10 mins
    });

    await user.save();
    //     await emailQueue.add(
    //       "send-verification-email",
    //       {
    //         to: email,
    //         subject: "Verify your email address",
    //         textMessage: `Your verification code is ${verificationCode}.
    // This code will expire in 10 minutes.`,
    //         html: verificationEmailTemplate(verificationCode),
    //       },
    //       {
    //         attempts: 2,
    //         removeOnComplete: true,
    //       }
    //     );
    const token: string = generateAuthToken({
      email: user.email,
      id: user._id?.toString(),
    });

    return res.status(201).cookie(GIGFLOW_TOKEN, token, cookieOptions).json({
      success: true,
      message: "Your account has been created!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie(GIGFLOW_TOKEN, cookieOptions);
    return res.status(200).json({
      success: true,
      message: "Logged out successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = LoginSchema.safeParse(data);

    if (!result.success) {
      const tree = z.treeifyError(result.error);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: tree?.properties || {},
      });
    }

    const { identifier, password } = result.data;

    const user: UserInterface | null = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user || !user.isVerified || !user.password)
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });

    const verify = await verifyHash(password, user.password);
    if (!verify)
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });

    const token: string = generateAuthToken({
      email: user.email,
      id: user._id?.toString(),
    });

    return res.status(200).cookie(GIGFLOW_TOKEN, token, cookieOptions).json({
      success: true,
      message: "Logged in successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = VerifyEmailSchema.safeParse(data);

    if (!result.success) {
      const tree = z.treeifyError(result.error);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: tree?.properties || {},
      });
    }

    const { email, otp } = result.data;

    const user: UserInterface | null = await User.findOne({
      email,
      isVerified: false,
      verificationCodeExpiry: { $gt: new Date() },
    });

    if (!user)
      return res.status(401).json({
        success: false,
        message:
          "No pending verification found for this email or OTP has expired.",
      });

    if (!user.verificationCode)
      return res.status(400).json({
        success: false,
        message: "OTP expired.",
      });

    const verify = await verifyHash(otp, user.verificationCode);
    if (!verify) {
      return res.status(401).json({
        success: false,
        message: "The OTP you entered is incorrect. Please try again.",
      });
    }

    await User.findByIdAndUpdate(user._id, {
      verificationCode: null,
      verificationCodeExpiry: null,
      isVerified: true,
    });

    const token: string = generateAuthToken({
      email: user.email,
      id: user._id?.toString(),
    });

    return res.status(200).cookie(GIGFLOW_TOKEN, token, cookieOptions).json({
      success: true,
      message: "Email verified.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// export const resendOtp = async (req: Request, res: Response) => {
//   try {
//     const data = req.body;

//     const EmailSchema = z.object({
//       email: z.email("Please provide a valid email address."),
//     });
//     const result = EmailSchema.safeParse(data);

//     if (!result.success) {
//       const tree = z.treeifyError(result.error);
//       return res.status(400).json({
//         success: false,
//         message: "Validation Error",
//         errors: tree?.properties || {},
//       });
//     }

//     const { email } = result.data;

//     const user: UserInterface | null = await User.findOne({
//       email,
//       isVerified: false,
//     });

//     if (!user)
//       return res.status(404).json({
//         success: false,
//         message:
//           "No unverified account found with this email. Please check your email or sign up.",
//       });

//     const verificationCode: string = generateVerificationCode();
//     const hashedVerificationCode: string = await hashValue(verificationCode, 8);

//     await User.findByIdAndUpdate(user._id, {
//       verificationCode: hashedVerificationCode,
//       verificationCodeExpiry: Date.now() + 10 * 60 * 1000,
//     });

//     await emailQueue.add(
//       "send-verification-email",
//       {
//         to: email,
//         subject: "Verify your email address",
//         textMessage: `Your verification code is ${verificationCode}.
// This code will expire in 10 minutes.`,
//         html: verificationEmailTemplate(verificationCode),
//       },
//       {
//         attempts: 2,
//         removeOnComplete: true,
//       }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "A new OTP has been sent to your email.",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };
