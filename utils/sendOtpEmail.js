// // const nodemailer = require("nodemailer");

// async function sendOtpEmail(toEmail, otp) {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       secure: false,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: `"Astrology Admin" <${process.env.EMAIL_USER}>`,
//       to: toEmail,
//       subject: "Your OTP for Astrology Admin Login",
//       html: `<p>Your OTP is: <b>${otp}</b>. It expires in 10 minutes.</p>`,
//     });

//     console.log("📧 OTP sent to:", toEmail);
//   } catch (err) {
//     console.error("❌ Error sending OTP:", err);
//     throw err;
//   }
// }

// module.exports = { sendOtpEmail };
const nodemailer = require("nodemailer");

async function sendOtpEmail(toEmail, otp) {
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
      from: `"Astrology Admin" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your OTP for Astrology Admin Login",
      html: `<p>Your OTP is: <b>${otp}</b>. It expires in 10 minutes.</p>`,
    });

    console.log("📧 OTP sent to:", toEmail);
  } catch (err) {
    console.error("❌ Error sending OTP:", err);
    throw err;
  }
}

module.exports = { sendOtpEmail };
