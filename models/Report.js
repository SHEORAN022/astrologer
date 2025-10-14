const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    email: { type: String, required: true },
    reportType: {
      type: String,
      enum: ["Kundli", "Matchmaking", "Remedy", "Consultation"],
      default: "Kundli",
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

module.exports = mongoose.model("Report", reportSchema);
