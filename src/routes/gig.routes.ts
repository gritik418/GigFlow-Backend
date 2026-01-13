import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import {
  createGig,
  getGigs,
  getOwnGigs,
} from "../controllers/gig.controller.js";

const router = Router();

router.get("/", authenticate, getGigs);

router.get("/my-gigs", authenticate, getOwnGigs);

router.post("/", authenticate, createGig);

export default router;
