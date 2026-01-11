import express, { type Request, type Response } from "express";

const app = express();
const port = process.env.PORT || 8000;

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
