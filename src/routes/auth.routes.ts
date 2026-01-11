import { Router } from "express";
import { userLogin, userSignup } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", userSignup);

router.post("/login", userLogin);

export default router;
