import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, html: string) => {
  const trasporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await trasporter.sendMail({
    from: `ToDo App <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
