// const Astrologer = require("../models/Astrologer");

// // ✅ Get all astrologers
// exports.getAstrologers = async (req, res) => {
//   try {
//     const data = await Astrologer.find().sort({ createdAt: -1 });
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch astrologers", error: err });
//   }
// };

// // ✅ Create astrologer
// exports.createAstrologer = async (req, res) => {
//   try {
//     const astrologer = new Astrologer(req.body);
//     await astrologer.save();
//     res.status(201).json(astrologer);
//   } catch (err) {
//     res.status(400).json({ message: "Failed to create astrologer", error: err });
//   }
// };

// // ✅ Update astrologer
// exports.updateAstrologer = async (req, res) => {
//   try {
//     const updated = await Astrologer.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updated);
//   } catch (err) {
//     res.status(400).json({ message: "Failed to update astrologer", error: err });
//   }
// };

// // ✅ Delete astrologer
// exports.deleteAstrologer = async (req, res) => {
//   try {
//     await Astrologer.findByIdAndDelete(req.params.id);
//     res.json({ message: "Astrologer deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to delete astrologer", error: err });
//   }
// };
const Astrologer = require("../models/Astrologer");

// ✅ Get all astrologers (with optional search)
exports.getAstrologers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" }; // case-insensitive search
    }
    const data = await Astrologer.find(query).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch astrologers", error: err });
  }
};

// ✅ Create astrologer
exports.createAstrologer = async (req, res) => {
  try {
    const astrologer = new Astrologer(req.body);
    await astrologer.save();
    res.status(201).json(astrologer);
  } catch (err) {
    res.status(400).json({ message: "Failed to create astrologer", error: err });
  }
};

// ✅ Update astrologer
exports.updateAstrologer = async (req, res) => {
  try {
    const updated = await Astrologer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update astrologer", error: err });
  }
};

// ✅ Delete astrologer
exports.deleteAstrologer = async (req, res) => {
  try {
    await Astrologer.findByIdAndDelete(req.params.id);
    res.json({ message: "Astrologer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete astrologer", error: err });
  }
};
