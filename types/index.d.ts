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
  title: string;
  description: string;
  budget: number;
  ownerId: Types.ObjectId;
  status: "open" | "assigned";
}
