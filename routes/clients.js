const express = require("express");
const router = express.Router();
const Client = require("../models/Client");

// ✅ Get all clients (with search)
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    const clients = await Client.find({
      name: { $regex: search, $options: "i" },
    }).sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add new client
router.post("/", async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    console.error("Error saving client:", err);
    res.status(400).json({ message: "Error creating client" });
  }
});

// ✅ Update client
router.put("/:id", async (req, res) => {
  try {
    const updated = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    console.error("Error updating client:", err);
    res.status(400).json({ message: "Error updating client" });
  }
});

// ✅ Delete client
router.delete("/:id", async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    console.error("Error deleting client:", err);
    res.status(400).json({ message: "Error deleting client" });
  }
});

module.exports = router;
