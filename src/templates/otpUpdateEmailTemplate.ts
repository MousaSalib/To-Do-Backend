export const otpUpdateEmailTemplate = (otp: string) => `
  <div style="
    font-family: 'Arial', sans-serif;
    max-width: 500px;
    margin: auto;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    background-color: #ffffff;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  ">
    <div style="
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      padding: 24px;
      color: #ffffff;
      text-align: center;
    ">
      <h2 style="margin: 0; font-size: 22px;">Verify Your New Email</h2>
    </div>

    <div style="padding: 30px; text-align: center;">
      <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
        Please use the following One-Time Password (OTP) to confirm your new email address:
      </p>

      <div style="
        display: inline-block;
        background-color: #eff6ff;
        color: #1d4ed8;
        padding: 14px 28px;
        border-radius: 8px;
        font-size: 28px;
        letter-spacing: 6px;
        font-weight: bold;
        margin: 20px 0;
      ">
        ${otp}
      </div>

      <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
        This OTP will expire in <b>10 minutes</b>. Please do not share it with anyone.
      </p>
    </div>

    <div style="
      background-color: #f9fafb;
      padding: 14px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
    ">
      &copy; ${new Date().getFullYear()} ToDo App. All rights reserved.
    </div>
  </div>
`;
