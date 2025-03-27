import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import createHttpError from "http-errors";

export const sendMail = async ({
  to,
  subject,
  intro,
  fullname,
  btnText,
  instructions,
  link,
}) => {
  if (!to || !subject || !intro) {
    throw createHttpError(500, "Email receipient, subject or intro is missing");
  }
  try {
    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        // Appears in header & footer of e-mails
        name: "Instashots",
        link: process.env.CLIENT_URL || "",
      },
    });
    const email = {
      body: {
        name: fullname,
        intro,
        action: {
          instructions:
            instructions ||
            "To get started with Mailgen, please click the button below",
          button: {
            text: btnText || "Visit",
            link: link || process.env.CLIENT_URL,
          },
        },
        outro: "Need help, or have questions? Just reply to this email.",
      },
    };
    const emailBody = mailGenerator.generate(email);
    // validate smtp config
    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
      throw createHttpError(500, "Email service not properly configured");
    }
    // create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp-gmail.com",
      port: 405,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    // connecting to gmail services
    await transporter.verify().catch((error) => {
      throw createHttpError(
        500,
        `Failed to connect to email services: ${error.message}`
      );
    });
    // send email
    const info = await transporter.sendMail({
      from: "Instashots",
      to: to,
      subject: subject,
      html: emailBody,
    });
    return {
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Email service error, error");
    throw createHttpError(500, "Failed to send the email. Try again");
  }
};
