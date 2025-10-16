const nodemailer = require("nodemailer");

exports.sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Astro Consultation" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`📩 Email sent successfully to ${to}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
  }
};
