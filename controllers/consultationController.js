const Consultation = require("../models/Consultation");

// Get all consultations
exports.getConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch consultations", error: err });
  }
};

// Get single consultation by ID
exports.getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) return res.status(404).json({ message: "Consultation not found" });
    res.json(consultation);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch consultation", error: err });
  }
};

// Create new consultation
exports.createConsultation = async (req, res) => {
  try {
    const consultation = new Consultation(req.body);
    await consultation.save();
    res.status(201).json(consultation);
  } catch (err) {
    res.status(400).json({ message: "Failed to create consultation", error: err });
  }
};

// Update consultation
exports.updateConsultation = async (req, res) => {
  try {
    const updated = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update consultation", error: err });
  }
};

// Delete consultation
exports.deleteConsultation = async (req, res) => {
  try {
    await Consultation.findByIdAndDelete(req.params.id);
    res.json({ message: "Consultation deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete consultation", error: err });
  }
};
