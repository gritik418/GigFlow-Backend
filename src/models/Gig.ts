import mongoose, { Schema } from "mongoose";

const GigSchema = new Schema<Gig>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    budget: { type: Number, required: true },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "assigned"],
      default: "open",
    },
  },
  { timestamps: true }
);

const Gig: mongoose.Model<Gig> =
  mongoose.models.Gig || mongoose.model("Gig", GigSchema);

export default Gig;
