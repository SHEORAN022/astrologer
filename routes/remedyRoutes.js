const express = require("express");
const router = express.Router(); // Make sure this line exists!
const Remedy = require("../models/Remedy");

// GET all remedies
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { type: { $regex: search, $options: "i" } },
          { instructions: { $regex: search, $options: "i" } },
        ],
      };
    }
    const remedies = await Remedy.find(query).sort({ createdAt: -1 });
    res.json(remedies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// CREATE a new remedy
router.post("/", async (req, res) => {
  try {
    console.log("POST body:", req.body);
    const { type, instructions } = req.body;

    if (!type || !instructions) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRemedy = new Remedy({ type, instructions });
    const savedRemedy = await newRemedy.save();

    console.log("Remedy saved:", savedRemedy);
    res.status(201).json(savedRemedy);
  } catch (err) {
    console.error("Error saving remedy:", err);
    res.status(500).json({ message: err.message });
  }
});

// UPDATE a remedy
router.put("/:id", async (req, res) => {
  try {
    const remedy = await Remedy.findById(req.params.id);
    if (!remedy) return res.status(404).json({ message: "Remedy not found" });

    remedy.type = req.body.type || remedy.type;
    remedy.instructions = req.body.instructions || remedy.instructions;

    await remedy.save();
    res.json(remedy);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE a remedy
router.delete("/:id", async (req, res) => {
  try {
    const remedy = await Remedy.findById(req.params.id);
    if (!remedy) return res.status(404).json({ message: "Remedy not found" });

    await remedy.remove();
    res.json({ message: "Remedy deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
