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
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      console.warn("❌ CORS blocked:", origin);
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

// ================= Middleware =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= MongoDB Connection =================
const PORT = process.env.PORT || 7000;
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
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
  res.send("🚀 MERN Astrology Admin Backend Running Successfully");
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
});

// ================= Serve Frontend in Production =================
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "frontend", "build");
  app.use(express.static(frontendPath));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ================= Start Server =================
app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));

