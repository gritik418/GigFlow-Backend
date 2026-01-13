import type { Request, Response } from "express";
import User from "../models/User.js";

export const getUser = async (req: Request, res: Response) => {
  try {
    if (!req.user.id)
      return res.status(401).json({
        success: false,
        message: "Unauthenticated",
      });

    const user = await User.findById(req.user.id).select(
      "-password -verificationCode -verificationCodeExpiry"
    );

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
