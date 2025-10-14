// const multer = require("multer");
// const path = require("path");

// // Storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// // File filter
// const fileFilter = (req, file, cb) => {
//   const allowed = ["application/pdf", "image/png", "image/jpeg"];
//   if (allowed.includes(file.mimetype)) cb(null, true);
//   else cb(new Error("Invalid file type. Only PDF/Images allowed."), false);
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
// });

// module.exports = upload;
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

module.exports = upload;
