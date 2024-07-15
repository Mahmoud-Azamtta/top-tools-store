import nodemailer from "nodemailer";

export async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAILSENDER,
      pass: process.env.PASSWORDSENDER,
    },
  });

  const info = await transporter.sendMail({
    from: `"Top-Tools" <${process.env.EMAILSENDER}>`,
    to,
    subject,
    html,
  });

  return info;
}

export async function sendEmailPDF(to, subject, html, attachmentPath) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAILSENDER,
      pass: process.env.PASSWORDSENDER,
    },
  });

  const info = await transporter.sendMail({
    from: `"Top-Tools" <${process.env.EMAILSENDER}>`,
    to: to,
    subject: subject,
    html: html,
    attachments: [
      {
        filename: "invoice.pdf",
        path: attachmentPath,
      },
    ],
  });

  return info;
}

