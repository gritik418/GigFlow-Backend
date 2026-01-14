import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import {
  createGig,
  getGig,
  getGigs,
  getOwnGigs,
} from "../controllers/gig.controller.js";

const router = Router();

router.get("/", authenticate, getGigs);

router.get("/my-gigs", authenticate, getOwnGigs);

router.get("/:gigId", authenticate, getGig);

router.post("/", authenticate, createGig);

export default router;
