import type { Request, Response } from "express";
import Gig from "../models/Gig.js";
import z from "zod";
import GigSchema from "../validators/gigSchema.js";

export const getGigs = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const filter: {
      title?: { $regex: string; $options: string };
      status: "open" | "assigned";
    } = {
      status: "open",
    };

    if (search?.toString().trim()) {
      filter.title = {
        $regex: search.toString().trim(),
        $options: "i",
      };
    }
    const gigs = await Gig.find(filter)
      .populate("ownerId", "firstName lastName username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: gigs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getGig = async (req: Request, res: Response) => {
  try {
    const gigId = req.params.gigId;

    if (!gigId)
      return res.status(400).json({
        success: false,
        message: "Gig ID is required.",
      });

    const gig = await Gig.findById(gigId).populate(
      "ownerId",
      "firstName lastName username email"
    );

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: gig,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const getOwnGigs = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    if (!req.user.id)
      return res.status(401).json({
        success: false,
        message: "Unauthenticated",
      });

    const filter: {
      title?: { $regex: string; $options: string };
      ownerId: string;
    } = {
      ownerId: req.user.id,
    };

    if (search?.toString().trim()) {
      filter.title = {
        $regex: search.toString().trim(),
        $options: "i",
      };
    }
    const gigs = await Gig.find(filter)
      .populate("ownerId", "firstName lastName username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: gigs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const createGig = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = GigSchema.safeParse(data);

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

    const { title, description, budget } = result.data;

    const gig = new Gig({
      ownerId: req.user.id,
      title,
      description,
      budget,
      status: "open",
    });

    const savedGig = await gig.save();

    return res.status(201).json({
      success: true,
      message: "Gig created successfully.",
      data: savedGig,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
