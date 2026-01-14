interface UserInterface {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpiry?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpiry?: Date;
}

interface Gig {
  _id: Types.ObjectId;
  title: string;
  description: string;
  budget: number;
  ownerId: Types.ObjectId;
  status: "open" | "assigned";
}

interface Bid {
  _id: Types.ObjectId;
  gigId: Types.ObjectId;
  freelancerId: Types.ObjectId;
  message: string;
  price: number;
  status: "pending" | "hired" | "rejected";
}
interface JwtPayload {
  id: string;
  email: string;
}
