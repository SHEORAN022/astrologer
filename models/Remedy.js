const mongoose = require("mongoose");

const remedySchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    type: { type: String, required: true },
    instructions: { type: String, required: true },
=======
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
>>>>>>> efd1034d73f8736393e914cd597bd707ab3ed49b
  },
  { timestamps: true }
);

module.exports = mongoose.model("Remedy", remedySchema);
