const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    dob: { type: String, default: "" },
    tob: { type: String, default: "" }, // Time of Birth
    pob: { type: String, default: "" }, // Place of Birth
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "" },
    location: { type: String, default: "" },
    maritalStatus: { type: String, default: "" },
    occupation: { type: String, default: "" },
    industry: { type: String, default: "" },
    notes: { type: String, default: "" },
    clientType: { type: String, default: "" },
    channel: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);
