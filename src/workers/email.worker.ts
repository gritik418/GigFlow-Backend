// import { Worker } from "bullmq";
// import { sendEmail } from "../services/email.service.js";
// import { connection } from "../queues/email.queue.js";

// const worker = new Worker(
//   "email-queue",
//   async (job) => {
//     const { to, subject, textMessage, html } = job.data;

//     if (!to) {
//       throw new Error("Recipient email missing.");
//     }

//     await sendEmail({
//       to,
//       subject: subject ?? "",
//       textMessage: textMessage ?? "",
//       html: html ?? "",
//     });
//   },
//   {
//     connection,
//   }
// );

// worker.on("completed", (job) => {
//   console.log(`${job.id} has completed!`);
// });

// worker.on("failed", (job, err) => {
//   console.log(`${job?.id} has failed with ${err.message}`);
// });
