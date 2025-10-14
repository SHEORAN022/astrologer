const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getRemedies,
  createRemedy,
  getRemedyById,
  updateRemedy,
  deleteRemedy,
} = require("../controllers/remedyController");

router.get("/", getRemedies);
router.get("/:id", getRemedyById);
router.post("/", upload.single("file"), createRemedy);
router.put("/:id", upload.single("file"), updateRemedy);
router.delete("/:id", deleteRemedy);

module.exports = router;
