import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  textMessage: string;
}
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
  textMessage,
}: EmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: '"GigFlow" <noreply@gigflow.com>',
      to,
      subject,
      text: textMessage,
      html: html ?? "",
    });

    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email could not be sent");
  }
};
