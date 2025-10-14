const Remedy = require("../models/Remedy");

// ✅ Get all remedies (with optional search by clientName)
exports.getRemedies = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query.clientName = { $regex: search, $options: "i" }; // case-insensitive
    }
    const remedies = await Remedy.find(query).sort({ createdAt: -1 });
    res.json(remedies);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch remedies", error });
  }
};

// ✅ Create a new remedy
exports.createRemedy = async (req, res) => {
  try {
    const fileUrl = req.file ? req.file.path : null;
    const remedy = new Remedy({ ...req.body, fileUrl });
    await remedy.save();
    res.status(201).json(remedy);
  } catch (error) {
    res.status(500).json({ message: "Failed to create remedy", error });
  }
};

// ✅ Get single remedy
exports.getRemedyById = async (req, res) => {
  try {
    const remedy = await Remedy.findById(req.params.id);
    if (!remedy) return res.status(404).json({ message: "Remedy not found" });
    res.json(remedy);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch remedy", error });
  }
};

// ✅ Update remedy
exports.updateRemedy = async (req, res) => {
  try {
    const fileUrl = req.file ? req.file.path : req.body.fileUrl;
    const updated = await Remedy.findByIdAndUpdate(
      req.params.id,
      { ...req.body, fileUrl },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update remedy", error });
  }
};

// ✅ Delete remedy
exports.deleteRemedy = async (req, res) => {
  try {
    await Remedy.findByIdAndDelete(req.params.id);
    res.json({ message: "Remedy deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete remedy", error });
  }
};
