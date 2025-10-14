const mongoose = require("mongoose");

const remedySchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    email: { type: String, required: true },
    remedyType: {
      type: String,
      enum: ["Gemstone", "Yantra", "Mantra", "Homa", "Other"],
      default: "Gemstone",
    },
    description: { type: String },
    fileUrl: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Remedy", remedySchema);
