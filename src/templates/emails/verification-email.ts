export const verificationEmailTemplate = (verificationCode: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Email Verification</h2>
      <p>Your verification code is:</p>

      <div style="
        font-size: 32px;
        letter-spacing: 6px;
        font-weight: bold;
        margin: 16px 0;
      ">
        ${verificationCode}
      </div>

      <p>
        This code will expire in <strong>10 minutes</strong>.
      </p>

      <p style="color: #555;">
        If you didn’t create an account, you can safely ignore this email.
      </p>
    </div>
  `;
};
