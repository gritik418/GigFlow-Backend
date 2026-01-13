import mongoose, { Schema } from "mongoose";

const BidSchema = new Schema<Bid>(
  {
    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gigId: {
      type: Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "hired", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Bid: mongoose.Model<Bid> =
  mongoose.models.Bid || mongoose.model("Bid", BidSchema);

export default Bid;
