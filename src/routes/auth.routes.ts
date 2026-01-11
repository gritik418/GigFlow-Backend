import { Router } from "express";
import { userSignup } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", userSignup);

export default router;
