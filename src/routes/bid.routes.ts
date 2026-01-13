import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import {
  createBid,
  getBids,
  hireFreelancer,
} from "../controllers/bid.controller.js";

const router = Router();

router.post("/", authenticate, createBid);

router.get("/:gigId", authenticate, getBids);

router.get("/:bidId/hire", authenticate, hireFreelancer);

export default router;
