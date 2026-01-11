import express, { type Request, type Response } from "express";
import authRoutes from "./routes/auth.routes.js";
import connectToDB from "./database/index.js";

const app = express();
const port = process.env.PORT || 8000;

connectToDB();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    status: "ok",
    message: "Server is running.",
  });
});

app.listen(port, () => {
  console.log(`App served at: http://localhost:${port}`);
});
