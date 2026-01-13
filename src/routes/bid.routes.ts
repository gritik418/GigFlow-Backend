import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import { createBid, getBids } from "../controllers/bid.controller.js";

const router = Router();

router.post("/", authenticate, createBid);

router.get("/:gigId", authenticate, getBids);

export default router;
