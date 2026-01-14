import type { Request, Response } from "express";
import mongoose from "mongoose";
import z from "zod";
import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";
import BidSchema from "../validators/bidSchema.js";
import { getIO } from "../socket/socketServer.js";

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

export const getBids = async (req: Request, res: Response) => {
  try {
    const gigId = req.params.gigId;

    if (!req.user.id)
      return res.status(401).json({
        success: false,
        message: "Unauthenticated",
      });

    if (!gigId)
      return res.status(400).json({
        success: false,
        message: "Gig ID is required.",
      });

    const gig: Gig | null = await Gig.findById(gigId);
    if (!gig)
      return res.status(404).json({
        success: false,
        message: "Gig not found.",
      });

    if (gig.ownerId?.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const bids = await Bid.find({ gigId })
      .populate("freelancerId", "firstName lastName username email")
      .populate("gigId", "title description budget status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Bids retrieved successfully",
      data: bids,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const hireFreelancer = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();

  try {
    const bidId = req.params.bidId;
    if (!req.user.id)
      return res.status(401).json({
        success: false,
        message: "Unauthenticated",
      });

    if (!bidId)
      return res.status(400).json({
        success: false,
        message: "Bid ID is required.",
      });

    session.startTransaction();

    const bid: Bid | null = await Bid.findById(bidId)
      .populate("gigId", "ownerId status title")
      .session(session);

    if (!bid) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Bid not found.",
      });
    }

    if (bid.status === "hired") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Bid already hired.",
      });
    }

    if (bid.gigId.ownerId?.toString() !== req.user.id) {
      await session.abortTransaction();
      session.endSession();

      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (bid.gigId.status !== "open") {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message: "Cannot hire for closed gig.",
      });
    }

    const gigUpdate = await Gig.findOneAndUpdate(
      { _id: bid.gigId._id, status: "open" },
      { status: "assigned" },
      { session, new: true }
    );

    if (!gigUpdate) throw new Error("Gig already assigned");

    await Bid.findByIdAndUpdate(bidId, { status: "hired" }, { session });

    await Bid.updateMany(
      {
        gigId: bid.gigId._id,
        _id: { $ne: bidId },
      },
      { status: "rejected" },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const io = getIO();

    io.to(bid.freelancerId.toString()).emit("bid-hired", {
      gigTitle: bid.gigId.title,
      message: "🎉 You have been hired for a gig!",
    });

    return res.status(200).json({
      success: true,
      message: "Freelancer hired successfully",
      bid,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(409).json({
      success: false,
      message: "Conflict occurred.",
    });
  }
};
