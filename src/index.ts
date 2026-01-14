import express, { type Request, type Response } from "express";
import authRoutes from "./routes/auth.routes.js";
import gigRoutes from "./routes/gig.routes.js";
import bidRoutes from "./routes/bid.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectToDB from "./database/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8000;

connectToDB();

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/user", userRoutes);

app.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    status: "ok",
    message: "Server is running.",
  });
});

app.listen(port, () => {
  console.log(`App served.`);
});
