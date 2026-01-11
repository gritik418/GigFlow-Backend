import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema<UserInterface>(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
    },
    lastName: {
      type: String,
      minlength: 3,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpiry: {
      type: Date,
    },
    verificationCode: {
      type: String,
    },
    verificationCodeExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User: mongoose.Model<UserInterface> =
  mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
