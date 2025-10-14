const express = require("express");
const router = express.Router();
const {
  getConsultations,
  createConsultation,
  updateConsultation,
  deleteConsultation,
} = require("../controllers/consultationController");

router.get("/", getConsultations);
router.post("/", createConsultation);
router.put("/:id", updateConsultation);
router.delete("/:id", deleteConsultation);

module.exports = router;
