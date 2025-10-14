const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    clientEmail: { type: String },
    astrologerName: { type: String, required: true },
    type: { type: String, enum: ["Chat", "Audio", "Video"], required: true },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    scheduledAt: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Consultation", consultationSchema);
