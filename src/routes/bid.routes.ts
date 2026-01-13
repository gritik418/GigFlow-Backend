import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import { createBid } from "../controllers/bid.controller.js";

const router = Router();

router.post("/", authenticate, createBid);

export default router;
