
import nodemailer from "nodemailer";

export interface EnquiryEmail {
  productId: number;
  productTitle: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

export async function sendEnquiryEmail(
  enquiry: EnquiryEmail
): Promise<void> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 1025);
  const salesEmail = process.env.SALES_EMAIL || "sales@example.test";

  if (!host) {
    throw new Error("SMTP_HOST is not configured");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    ...(process.env.SMTP_USER
      ? {
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        }
      : {})
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || "catalogue@example.test",
    to: salesEmail,
    replyTo: enquiry.email,
    subject: `Product enquiry: ${enquiry.productTitle}`,
    text: [
      `Product ID: ${enquiry.productId}`,
      `Product: ${enquiry.productTitle}`,
      `Customer: ${enquiry.name}`,
      `Email: ${enquiry.email}`,
      `Phone: ${enquiry.phone || "Not provided"}`,
      `Message: ${enquiry.message || "No message"}`
    ].join("\n")
  });
}
