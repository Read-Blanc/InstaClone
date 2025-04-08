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
    throw createHttpError(500, "Email recipient, subject, or intro is missing");
  }
  
  try {
    // Set up Mailgen
    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        // Appears in header & footer of e-mails
        name: "Instashots",
        link:
          process.env.CLIENT_URL ||
          "https://insta-clone-jgz2upd6f-read-blancs-projects-002cbe8d.vercel.app",
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

    // Validate SMTP config (Make sure email and password are set)
    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
      throw createHttpError(500, "Email service not properly configured");
    }

    // Create transporter (using Gmail's SMTP settings)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com", // Corrected SMTP host
      port: 465, // Using port 465 for SSL (you can use 587 for TLS)
      secure: true, // Use true for SSL
      auth: {
        user: process.env.EMAIL, // Your Gmail email address
        pass: process.env.EMAIL_PASSWORD, // Your Gmail App Password (NOT Google Account Password)
      },
    });

    // Verify connection to email service
    await transporter.verify().catch((error) => {
      throw createHttpError(
        500,
        `Failed to connect to email services: ${error.message}`
      );
    });

    // Send the email
    const info = await transporter.sendMail({
      from: "Instashots", // Your app's name
      to: to, // Recipient email
      subject: subject,
      html: emailBody, // HTML email content
    });

    // Return success
    return {
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    };
  } catch (error) {
    // Log and throw error if email fails to send
    console.error("Email service error:", error);
    throw createHttpError(500, "Failed to send the email. Try again");
  }
};
