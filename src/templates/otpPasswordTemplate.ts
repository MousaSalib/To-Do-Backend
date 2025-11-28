export const otpPasswordTemplate = (otp: string) => `
  <div style="
    font-family: 'Arial', sans-serif;
    max-width: 500px;
    margin: auto;
    border-radius: 16px;
    overflow: hidden;
    background: linear-gradient(135deg, #0f172a, #1e293b);
    color: #e2e8f0;
    border: 1px solid rgba(255, 255, 255, 0.1);
  ">
    <div style="
      background: rgba(30, 64, 175, 0.9);
      padding: 24px;
      text-align: center;
      color: white;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    ">
      <h2 style="margin: 0; font-size: 22px; letter-spacing: 0.5px;">
        Password Reset Verification
      </h2>
    </div>

    <div style="padding: 24px; text-align: center;">
      <p style="font-size: 16px; color: #cbd5e1; margin-bottom: 16px;">
        Use the following OTP to reset your password:
      </p>

      <h1 style="
        letter-spacing: 8px;
        color: #60a5fa;
        margin: 20px 0;
        font-size: 28px;
      ">
        ${otp}
      </h1>

      <p style="font-size: 14px; color: #94a3b8; margin-top: 12px;">
        This OTP is valid for <b>15 minutes</b>. Please do not share it with anyone.
      </p>
    </div>

    <div style="
      background: rgba(15, 23, 42, 0.9);
      padding: 12px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    ">
      &copy; ${new Date().getFullYear()} ToDo App. All rights reserved.
    </div>
  </div>
`;
