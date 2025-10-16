const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getReports,
  createReport,
  getReportById,
  updateReport,
  deleteReport,
} = require("../controllers/reportController");

router.get("/", getReports);
router.get("/:id", getReportById);
router.post("/", upload.single("file"), createReport);
router.put("/:id", upload.single("file"), updateReport);
router.delete("/:id", deleteReport);

module.exports = router;
