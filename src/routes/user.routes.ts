import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import { getUser } from "../controllers/user.controller.js";

const router = Router();

router.get("/me", authenticate, getUser);

export default router;
