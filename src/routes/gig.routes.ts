import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import { createGig, getGigs } from "../controllers/gig.controller.js";

const router = Router();

router.get("/", authenticate, getGigs);

router.post("/", authenticate, createGig);

export default router;
