const mongoose = require("mongoose");

const astrologerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    specialization: { type: String }, // e.g. Vedic, Tarot, Palmistry
    experience: { type: Number, default: 0 }, // in years
    rating: { type: Number, default: 0 }, // 1–5
    about: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Astrologer", astrologerSchema);
