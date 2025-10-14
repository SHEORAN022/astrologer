

// // require("dotenv").config();
// // const express = require("express");
// // const mongoose = require("mongoose");
// // const cors = require("cors");
// // const path = require("path");

// // const app = express();

// // // ✅ STEP 1: Configure CORS properly
// // const allowedOrigins = [
// //   process.env.FRONTEND_URL || "http://localhost:3000", // local
 
// //   "https://astrologer-wheat.vercel.app" 
// // ];

// // app.use(
// //   cors({
// //     origin: function (origin, callback) {
// //       if (!origin) return callback(null, true);
// //       if (allowedOrigins.includes(origin)) return callback(null, true);
// //       return callback(new Error("❌ Not allowed by CORS"));
// //     },
// //     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// //     allowedHeaders: ["Content-Type", "Authorization"],
// //     credentials: true,
// //   })
// // );

// // // ✅ STEP 2: Middleware
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));

// // // ✅ STEP 3: MongoDB Connection
// // const PORT = process.env.PORT || 7000;
// // const MONGODB_URI = process.env.MONGODB_URI;

// // mongoose
// //   .connect(MONGODB_URI, {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// //   })
// //   .then(() => console.log("✅ MongoDB connected successfully"))
// //   .catch((err) => console.error("❌ MongoDB connection failed:", err));

// // // ✅ STEP 4: Import all routes
// // const authRoutes = require("./routes/auth");
// // const ordersRoutes = require("./routes/orders");
// // const clientRoutes = require("./routes/clients");
// // const astrologerRoutes = require("./routes/astrologerRoutes");
// // const reportRoutes = require("./routes/reportRoutes");
// // const remedyRoutes = require("./routes/remedyRoutes");
// // const consultationRoutes = require("./routes/consultationRoutes");
// // const transactionRoutes = require("./routes/transactionRoutes");
// // const feedbackRoutes = require("./routes/feedbackRoutes");
// // const calculatorRoutes = require("./routes/calculatorRoutes");
// // const paymentRoutes = require("./routes/paymentRoutes");
// // // const calculatorsRoutes = require("./routes/calculators");

// // // ✅ STEP 5: Mount routes
// // app.use("/api/auth", authRoutes);
// // app.use("/api/orders", ordersRoutes);
// // app.use("/api/clients", clientRoutes);
// // app.use("/api/astrologers", astrologerRoutes);
// // app.use("/api/reports", reportRoutes);
// // app.use("/api/remedies", remedyRoutes);
// // app.use("/api/consultations", consultationRoutes);
// // app.use("/api/transactions", transactionRoutes);
// // app.use("/api/feedbacks", feedbackRoutes);
// // app.use("/api/calculators", calculatorRoutes);
// // app.use("/api/payments", paymentRoutes);
// // // app.use("/api/calculators", calculatorsRoutes);

// // // ✅ STEP 6: Static file serving
// // app.use("/uploads", express.static(path.resolve(process.env.UPLOAD_PATH || "./uploads")));

// // // ✅ STEP 7: Health check / root route
// // app.get("/", (req, res) => {
// //   res.send("🚀 MERN Astrology Admin Backend Running Successfully");
// // });

// // // ✅ STEP 8: Error Handling Middleware
// // app.use((err, req, res, next) => {
// //   console.error("🔥 Error:", err.message);
// //   res.status(500).json({
// //     success: false,
// //     error: err.message || "Internal Server Error",
// //   });
// // });

// // // ✅ STEP 9: Serve frontend build (if deploying full stack together)
// // if (process.env.NODE_ENV === "production") {
// //   const frontendPath = path.join(__dirname, "frontend", "build");
// //   app.use(express.static(frontendPath));
// //   app.get("*", (req, res) => {
// //     res.sendFile(path.resolve(frontendPath, "index.html"));
// //   });
// // }

// // // ✅ STEP 10: Start server
// // app.listen(PORT, () => {
// //   console.log(`🌐 Server running on port ${PORT}`);
// // });
// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require("path");

// const app = express();

// // CORS
// const allowedOrigins = [
//   process.env.FRONTEND_URL || "http://localhost:3000",
//   "https://astrologer-wheat.vercel.app"
// ];

// app.use(cors({
//   origin: function(origin, callback){
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.includes(origin)) return callback(null, true);
//     return callback(new Error("❌ Not allowed by CORS"));
//   },
//   methods: ["GET","POST","PUT","DELETE","OPTIONS"],
//   allowedHeaders: ["Content-Type","Authorization"],
//   credentials:true
// }));

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // MongoDB connection
// const PORT = process.env.PORT || 7000;
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(()=>console.log("✅ MongoDB connected"))
// .catch(err=>console.error("❌ MongoDB connection failed:", err));

// // Routes
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

// // File serving
// app.use("/uploads", express.static(path.resolve(process.env.UPLOAD_PATH || "./uploads")));

// // Root route
// app.get("/", (req,res)=>{
//   res.send("🚀 MERN Astrology Admin Backend Running Successfully");
// });

// // Error handler
// app.use((err, req, res, next)=>{
//   console.error("🔥 Error:", err.message);
//   res.status(500).json({ success:false, error: err.message || "Internal Server Error"});
// });

// // Serve frontend in production
// if(process.env.NODE_ENV === "production"){
//   const frontendPath = path.join(__dirname,"frontend","build");
//   app.use(express.static(frontendPath));
//   app.get("*",(req,res)=>{
//     res.sendFile(path.resolve(frontendPath,"index.html"));
//   });
// }

// // Start server
// app.listen(PORT,()=>console.log(`🌐 Server running on port ${PORT}`));
// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require("path");

// const app = express();

// // CORS
// const allowedOrigins = [
//   process.env.FRONTEND_URL || "http://localhost:3000",
//   "https://astrologer-wheat.vercel.app"
// ];

// app.use(cors({
//   origin: function(origin, callback){
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.includes(origin)) return callback(null, true);
//     return callback(new Error("❌ Not allowed by CORS"));
//   },
//   methods: ["GET","POST","PUT","DELETE","OPTIONS"],
//   allowedHeaders: ["Content-Type","Authorization"],
//   credentials:true
// }));

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // MongoDB
// const PORT = process.env.PORT || 7000;
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(()=>console.log("✅ MongoDB connected"))
// .catch(err=>console.error("❌ MongoDB connection failed:", err));

// // Routes
// const authRoutes = require("./routes/auth");
// app.use("/api/auth", authRoutes);

// // Static files
// app.use("/uploads", express.static(path.resolve(process.env.UPLOAD_PATH || "./uploads")));

// // Root
// app.get("/", (req,res)=>{
//   res.send("🚀 MERN Astrology Admin Backend Running Successfully");
// });

// // Error handler
// app.use((err, req, res, next)=>{
//   console.error("🔥 Error:", err.message);
//   res.status(500).json({ success:false, error: err.message || "Internal Server Error"});
// });

// // Serve frontend in production
// if(process.env.NODE_ENV === "production"){
//   const frontendPath = path.join(__dirname,"frontend","build");
//   app.use(express.static(frontendPath));
//   app.get("*",(req,res)=>{
//     res.sendFile(path.resolve(frontendPath,"index.html"));
//   });
// }

// // Start server
// app.listen(PORT,()=>console.log(`🌐 Server running on port ${PORT}`));



require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ✅ CORS Setup
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "https://astrologer-wheat.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("❌ Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB Connection
const PORT = process.env.PORT || 7000;
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// ✅ Import routes
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

// ✅ Static file serving for uploads
app.use(
  "/uploads",
  express.static(path.resolve(process.env.UPLOAD_PATH || "./uploads"))
);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 MERN Astrology Admin Backend Running Successfully");
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res
    .status(500)
    .json({ success: false, error: err.message || "Internal Server Error" });
});

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "frontend", "build");
  app.use(express.static(frontendPath));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

// ✅ Start server
app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));

