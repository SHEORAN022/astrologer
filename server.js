
<<<<<<< HEAD

=======
>>>>>>> efd1034d73f8736393e914cd597bd707ab3ed49b
// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require("path");

// const app = express();

<<<<<<< HEAD
// // ================= CORS Setup =================
// const allowedOrigins = [
//   process.env.FRONTEND_URL || "http://localhost:3000",
//   "https://frontendastro-1.onrender.com",
=======
// // ✅ CORS Setup
// const allowedOrigins = [
//   process.env.FRONTEND_URL || "http://localhost:3000",
//   "https://astrologer-wheat.vercel.app",
>>>>>>> efd1034d73f8736393e914cd597bd707ab3ed49b
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
<<<<<<< HEAD
//       if (!origin) return callback(null, true); // allow non-browser requests (Postman, curl)
//       if (allowedOrigins.includes(origin)) return callback(null, true);
//       console.warn("❌ CORS blocked:", origin);
//       callback(new Error("Not allowed by CORS"));
=======
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) return callback(null, true);
//       return callback(new Error("❌ Not allowed by CORS"));
>>>>>>> efd1034d73f8736393e914cd597bd707ab3ed49b
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

<<<<<<< HEAD
// // Handle preflight requests
// app.options("*", cors());

// // ================= Middleware =================
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ================= MongoDB Connection =================
=======
// // ✅ Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ MongoDB Connection
>>>>>>> efd1034d73f8736393e914cd597bd707ab3ed49b
// const PORT = process.env.PORT || 7000;
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection failed:", err));

<<<<<<< HEAD
// // ================= Routes =================
=======
// // ✅ Import routes
>>>>>>> efd1034d73f8736393e914cd597bd707ab3ed49b
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

<<<<<<< HEAD
// // ================= Static Files =================
=======
// // ✅ Static file serving for uploads
>>>>>>> efd1034d73f8736393e914cd597bd707ab3ed49b
// app.use(
//   "/uploads",
//   express.static(path.resolve(process.env.UPLOAD_PATH || "./uploads"))
// );

<<<<<<< HEAD
// // ================= Root Route =================
=======
// // ✅ Root route
>>>>>>> efd1034d73f8736393e914cd597bd707ab3ed49b
// app.get("/", (req, res) => {
//   res.send("🚀 MERN Astrology Admin Backend Running Successfully");
// });

<<<<<<< HEAD
// // ================= Error Handler =================
=======
// // ✅ Error handler
>>>>>>> efd1034d73f8736393e914cd597bd707ab3ed49b
// app.use((err, req, res, next) => {
//   console.error("🔥 Error:", err.message);
//   res
//     .status(500)
//     .json({ success: false, error: err.message || "Internal Server Error" });
// });

<<<<<<< HEAD
// // ================= Serve Frontend in Production =================
=======
// // ✅ Serve frontend in production
>>>>>>> efd1034d73f8736393e914cd597bd707ab3ed49b
// if (process.env.NODE_ENV === "production") {
//   const frontendPath = path.join(__dirname, "frontend", "build");
//   app.use(express.static(frontendPath));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(frontendPath, "index.html"));
//   });
// }

<<<<<<< HEAD
// // ================= Start Server =================
// app.listen(PORT, () => console.log('🌐 Server running on port ${PORT}'));
=======
// // ✅ Start server
// app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));


>>>>>>> efd1034d73f8736393e914cd597bd707ab3ed49b
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
<<<<<<< HEAD
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
=======
      if (!origin) return callback(null, true); // allow non-browser requests (Postman, curl)
      if (allowedOrigins.includes(origin)) return callback(null, true);
>>>>>>> efd1034d73f8736393e914cd597bd707ab3ed49b
      console.warn("❌ CORS blocked:", origin);
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

<<<<<<< HEAD
=======
// Handle preflight requests
>>>>>>> efd1034d73f8736393e914cd597bd707ab3ed49b
app.options("*", cors());

// ================= Middleware =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= MongoDB Connection =================
const PORT = process.env.PORT || 7000;
<<<<<<< HEAD
mongoose.set("strictQuery", false);

=======
>>>>>>> efd1034d73f8736393e914cd597bd707ab3ed49b
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
<<<<<<< HEAD
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

// ================= Routes =================
try {
  app.use("/api/auth", require("./routes/auth"));
  app.use("/api/orders", require("./routes/orders"));
  app.use("/api/clients", require("./routes/clients"));
  app.use("/api/astrologers", require("./routes/astrologerRoutes"));
  app.use("/api/reports", require("./routes/reportRoutes"));
  app.use("/api/remedies", require("./routes/remedyRoutes"));
  app.use("/api/consultations", require("./routes/consultationRoutes"));
  app.use("/api/transactions", require("./routes/transactionRoutes"));
  app.use("/api/feedbacks", require("./routes/feedbackRoutes"));
  app.use("/api/calculators", require("./routes/calculatorRoutes"));
  app.use("/api/payments", require("./routes/paymentRoutes"));
} catch (err) {
  console.error("🔥 Route loading error:", err);
}

// ================= Static Files =================
app.use("/uploads", express.static(path.resolve(process.env.UPLOAD_PATH || "./uploads")));

// ================= Root Route =================
app.get("/", (req, res) => {
  res.send("🚀 MERN Astrology Admin Backend Running Successfully with Razorpay");
});

// ================= 404 Handler for API =================
app.use("/api/*", (req, res) => {
  res.status(404).json({ success: false, error: "API route not found" });
});

// ================= Global Error Handler =================
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
=======
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
>>>>>>> efd1034d73f8736393e914cd597bd707ab3ed49b
});

// ================= Serve Frontend in Production =================
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "frontend", "build");
  app.use(express.static(frontendPath));
<<<<<<< HEAD

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
=======
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
>>>>>>> efd1034d73f8736393e914cd597bd707ab3ed49b
  });
}

// ================= Start Server =================
<<<<<<< HEAD
app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));
=======
app.listen(PORT, () => console.log('🌐 Server running on port ${PORT}'));




>>>>>>> efd1034d73f8736393e914cd597bd707ab3ed49b
