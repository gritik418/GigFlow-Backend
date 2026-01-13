import type { NextFunction, Request, Response } from "express";
import { GIGFLOW_TOKEN } from "../constants/index.js";
import { verifyAuthToken } from "../utils/token.js";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email?: string;
      };
    }
  }
}

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authToken = req.cookies[GIGFLOW_TOKEN];
    if (!authToken)
      return res.status(401).json({
        success: false,
        message: "Unauthenticated",
      });

    const verify = verifyAuthToken(authToken);

    if (!verify || !verify.id || !verify.email)
      return res.status(401).json({
        success: false,
        message: "Unauthenticated",
      });

    req.user = {
      id: verify.id,
      email: verify.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthenticated",
    });
  }
};

export default authenticate;
