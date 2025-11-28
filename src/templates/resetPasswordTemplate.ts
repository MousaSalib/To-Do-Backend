export const resetPasswordTemplate = (resetLink: string) => `
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
      <h2 style="margin: 0; font-size: 22px; letter-spacing: 0.5px;">Reset Your Password</h2>
    </div>

    <div style="padding: 24px; text-align: center;">
      <p style="font-size: 16px; color: #cbd5e1; margin-bottom: 16px;">
        You requested to reset your password. Click the button below to continue:
      </p>

      <a href="${resetLink}"
         style="
           display: inline-block;
           background-color: #3b82f6;
           color: white;
           padding: 12px 26px;
           margin: 20px 0;
           border-radius: 8px;
           text-decoration: none;
           font-size: 16px;
           font-weight: 600;
           transition: background 0.3s ease;
         ">
         Reset Password
      </a>

      <p style="font-size: 14px; color: #94a3b8; margin-top: 16px;">
        If the button above doesn't work, copy and paste this link into your browser:
      </p>

      <p style="
        word-break: break-all;
        color: #60a5fa;
        font-size: 13px;
        margin-top: 8px;
      ">${resetLink}</p>

      <p style="font-size: 13px; color: #94a3b8; margin-top: 12px;">
        This link will expire in <b>15 minutes</b>.
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
