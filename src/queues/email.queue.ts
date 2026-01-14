import { Queue } from "bullmq";

import Redis from "ioredis";

// @ts-ignore
export const connection = new Redis(process.env.REDIS_URL!);

connection.on("connect", () => console.log("✅ Redis connected!"));
connection.on("error", (err: any) => console.log(`❌ Redis error: `, err));

const emailQueue = new Queue("email-queue", {
  connection,
});

export default emailQueue;
