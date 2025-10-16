// const express = require("express");
// const router = express.Router();
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// // Send OTP
// router.post("/request-otp", async (req, res) => {
//   const { email, name } = req.body;
//   if (!email) return res.status(400).json({ message: "Email required" });

//   let user = await User.findOne({ email });
//   if (!user) user = new User({ email, name });

//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   user.otp = otp;
//   user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
//   await user.save();

//   console.log(`OTP for ${email}: ${otp}`); // You can replace this with email sending
//   res.json({ message: "OTP sent to email (check server console for demo)" });
// });

// // Verify OTP
// router.post("/verify-otp", async (req, res) => {
//   const { email, otp } = req.body;
//   if (!email || !otp) return res.status(400).json({ message: "Email & OTP required" });

//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).json({ message: "User not found" });
//   if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
//   if (user.otpExpires < new Date()) return res.status(400).json({ message: "OTP expired" });

//   user.otp = null;
//   user.otpExpires = null;
//   await user.save();

//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

//   res.json({ message: "OTP verified", user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }, token });
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =============================
// 🧾 REGISTER
// =============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ name, email, password });
    await newUser.save();

    return res.status(200).json({ message: "Registered successfully", user: newUser });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server error during registration" });
  }
});

// =============================
// 🔐 LOGIN
// =============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password !== password)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
