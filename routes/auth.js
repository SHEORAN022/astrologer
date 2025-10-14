


// const express = require("express");
// const router = express.Router();
// const crypto = require("crypto");
// const { sendOtpEmail } = require("../utils/sendOtpEmail"); // correct import

// const otpStore = {}; // in-memory OTP storage

// // Request OTP
// router.post("/request-otp", async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ message: "Email is required" });

//     const otp = crypto.randomInt(100000, 999999).toString();
//     otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 }; // 10 min

//     await sendOtpEmail(email, otp);
//     res.json({ success: true, message: "OTP sent successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Failed to send OTP" });
//   }
// });

// // Verify OTP
// router.post("/verify-otp", (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     if (!email || !otp)
//       return res.status(400).json({ message: "Email and OTP are required" });

//     const record = otpStore[email];
//     if (!record) return res.status(400).json({ message: "OTP not requested" });
//     if (Date.now() > record.expires) return res.status(400).json({ message: "OTP expired" });
//     if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

//     delete otpStore[email];
//     const user = { email };
//     const token = crypto.randomBytes(16).toString("hex");

//     res.json({ success: true, user, token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "OTP verification failed" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🔹 REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const user = new User({ name, email, password });
    await user.save();

    res.json({ success: true, message: "Registration successful" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🔹 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

