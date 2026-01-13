import type { Request, Response } from "express";
import BidSchema from "../validators/bidSchema.js";
import z from "zod";
import Gig from "../models/Gig.js";
import Bid from "../models/Bid.js";

export const createBid = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = BidSchema.safeParse(data);

    if (!result.success) {
      const tree = z.treeifyError(result.error);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: tree?.properties || {},
      });
    }

    if (!req.user.id)
      return res.status(401).json({
        success: false,
        message: "Unauthenticated",
      });

    const { message, price, gigId } = result.data;

    const gig: Gig | null = await Gig.findById(gigId);
    if (!gig)
      return res.status(404).json({
        success: false,
        message: "Gig not found.",
      });

    if (gig.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "Cannot bid on closed gigs.",
      });
    }

    if (gig.ownerId?.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Cannot bid on your own gig.",
      });
    }

    const bid = new Bid({
      freelancerId: req.user.id,
      gigId,
      message,
      price,
      status: "pending",
    });
    const savedBid = await bid.save();

    return res.status(201).json({
      success: true,
      message: "Bid submitted successfully",
      data: savedBid,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
