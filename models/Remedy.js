const mongoose = require("mongoose");

const remedySchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    instructions: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Remedy", remedySchema);
