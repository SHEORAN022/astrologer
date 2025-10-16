// const Consultation = require("../models/Consultation");

// // Get all consultations
// exports.getConsultations = async (req, res) => {
//   try {
//     const consultations = await Consultation.find().sort({ createdAt: -1 });
//     res.json(consultations);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch consultations", error: err });
//   }
// };

// // Get single consultation by ID
// exports.getConsultationById = async (req, res) => {
//   try {
//     const consultation = await Consultation.findById(req.params.id);
//     if (!consultation) return res.status(404).json({ message: "Consultation not found" });
//     res.json(consultation);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch consultation", error: err });
//   }
// };

// // Create new consultation
// exports.createConsultation = async (req, res) => {
//   try {
//     const consultation = new Consultation(req.body);
//     await consultation.save();
//     res.status(201).json(consultation);
//   } catch (err) {
//     res.status(400).json({ message: "Failed to create consultation", error: err });
//   }
// };

// // Update consultation
// exports.updateConsultation = async (req, res) => {
//   try {
//     const updated = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updated);
//   } catch (err) {
//     res.status(400).json({ message: "Failed to update consultation", error: err });
//   }
// };

// // Delete consultation
// exports.deleteConsultation = async (req, res) => {
//   try {
//     await Consultation.findByIdAndDelete(req.params.id);
//     res.json({ message: "Consultation deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to delete consultation", error: err });
//   }
// };

const Consultation = require("../models/Consultation");

// 🔗 Generate Random Google Meet Link
const generateMeetLink = () => {
  const part1 = Math.random().toString(36).substring(2, 7);
  const part2 = Math.random().toString(36).substring(2, 5);
  const part3 = Math.random().toString(36).substring(2, 4);
  return `https://meet.google.com/${part1}-${part2}-${part3}`;
};

// 📌 Get All Consultations
exports.getConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ scheduledAt: -1 });
    res.json(consultations);
  } catch (err) {
    console.error("❌ Fetch Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 📌 Create New Consultation (Auto Meet Link)
exports.createConsultation = async (req, res) => {
  try {
    const { clientName, clientEmail, astrologerName, type, status, scheduledAt, notes } = req.body;

    // Auto Generate Google Meet Link
    const meetLink = generateMeetLink();

    const newConsultation = new Consultation({
      clientName,
      clientEmail,
      astrologerName,
      type,
      status,
      scheduledAt,
      notes,
      meetingLink: meetLink,
    });

    const saved = await newConsultation.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Create Error:", err.message);
    res.status(400).json({ success: false, error: err.message });
  }
};

// 📌 Update Consultation
exports.updateConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Consultation.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("❌ Update Error:", err.message);
    res.status(400).json({ success: false, error: err.message });
  }
};

// 📌 Delete Consultation
exports.deleteConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    await Consultation.findByIdAndDelete(id);
    res.json({ success: true, message: "Consultation deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Error:", err.message);
    res.status(400).json({ success: false, error: err.message });
  }
};
