
const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// Get all feedback
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new feedback
router.post("/", async (req, res) => {
  try {
    const { name, email, message, rating } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newFeedback = new Feedback({ name, email, message, rating });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete feedback by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Feedback.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Feedback not found" });
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
