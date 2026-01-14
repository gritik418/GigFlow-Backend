import { Router } from "express";
import {
  logout,
  // resendOtp,
  userLogin,
  userSignup,
  verifyEmail,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", userSignup);

router.post("/login", userLogin);

router.post("/verify-email", verifyEmail);

router.post("/logout", logout);

// router.post("/resend-otp", resendOtp);

export default router;
