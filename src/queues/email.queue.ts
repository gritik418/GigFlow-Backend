import { Queue } from "bullmq";

import Redis from "ioredis";

// @ts-ignore
export const connection = new Redis({
  url: process.env.REDIS_URL!,
  maxRetriesPerRequest: null,
});

const emailQueue = new Queue("email-queue", {
  connection,
});

export default emailQueue;
