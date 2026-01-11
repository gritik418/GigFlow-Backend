import { Router } from "express";
import {
  resendOtp,
  userLogin,
  userSignup,
  verifyEmail,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", userSignup);

router.post("/login", userLogin);

router.post("/verify-email", verifyEmail);

router.post("/resend-otp", resendOtp);

export default router;
