
// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require("path");

// const app = express();

// // ✅ CORS Setup
// const allowedOrigins = [
//   process.env.FRONTEND_URL || "http://localhost:3000",
//   "https://astrologer-wheat.vercel.app",
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) return callback(null, true);
//       return callback(new Error("❌ Not allowed by CORS"));
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

// // ✅ Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ MongoDB Connection
// const PORT = process.env.PORT || 7000;
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection failed:", err));

// // ✅ Import routes
// const authRoutes = require("./routes/auth");
// const ordersRoutes = require("./routes/orders");
// const clientRoutes = require("./routes/clients");
// const astrologerRoutes = require("./routes/astrologerRoutes");
// const reportRoutes = require("./routes/reportRoutes");
// const remedyRoutes = require("./routes/remedyRoutes");
// const consultationRoutes = require("./routes/consultationRoutes");
// const transactionRoutes = require("./routes/transactionRoutes");
// const feedbackRoutes = require("./routes/feedbackRoutes");
// const calculatorRoutes = require("./routes/calculatorRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");

// app.use("/api/auth", authRoutes);
// app.use("/api/orders", ordersRoutes);
// app.use("/api/clients", clientRoutes);
// app.use("/api/astrologers", astrologerRoutes);
// app.use("/api/reports", reportRoutes);
// app.use("/api/remedies", remedyRoutes);
// app.use("/api/consultations", consultationRoutes);
// app.use("/api/transactions", transactionRoutes);
// app.use("/api/feedbacks", feedbackRoutes);
// app.use("/api/calculators", calculatorRoutes);
// app.use("/api/payments", paymentRoutes);

// // ✅ Static file serving for uploads
// app.use(
//   "/uploads",
//   express.static(path.resolve(process.env.UPLOAD_PATH || "./uploads"))
// );

// // ✅ Root route
// app.get("/", (req, res) => {
//   res.send("🚀 MERN Astrology Admin Backend Running Successfully");
// });

// // ✅ Error handler
// app.use((err, req, res, next) => {
//   console.error("🔥 Error:", err.message);
//   res
//     .status(500)
//     .json({ success: false, error: err.message || "Internal Server Error" });
// });

// // ✅ Serve frontend in production
// if (process.env.NODE_ENV === "production") {
//   const frontendPath = path.join(__dirname, "frontend", "build");
//   app.use(express.static(frontendPath));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(frontendPath, "index.html"));
//   });
// }

// // ✅ Start server
// app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));


require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ================= CORS Setup =================
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "https://frontendastro-1.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow non-browser requests (Postman, curl)
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn("❌ CORS blocked:", origin);
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

// ================= Middleware =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= MongoDB Connection =================
const PORT = process.env.PORT || 7000;
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// ================= Routes =================
const authRoutes = require("./routes/auth");
const ordersRoutes = require("./routes/orders");
const clientRoutes = require("./routes/clients");
const astrologerRoutes = require("./routes/astrologerRoutes");
const reportRoutes = require("./routes/reportRoutes");
const remedyRoutes = require("./routes/remedyRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const calculatorRoutes = require("./routes/calculatorRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/astrologers", astrologerRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/remedies", remedyRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/calculators", calculatorRoutes);
app.use("/api/payments", paymentRoutes);

// ================= Static Files =================
app.use(
  "/uploads",
  express.static(path.resolve(process.env.UPLOAD_PATH || "./uploads"))
);

// ================= Root Route =================
app.get("/", (req, res) => {
  res.send("🚀 MERN Astrology Admin Backend Running Successfully");
});

// ================= Error Handler =================
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res
    .status(500)
    .json({ success: false, error: err.message || "Internal Server Error" });
});

// ================= Serve Frontend in Production =================
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "frontend", "build");
  app.use(express.static(frontendPath));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

// ================= Start Server =================
app.listen(PORT, () => console.log('🌐 Server running on port ${PORT}'));




