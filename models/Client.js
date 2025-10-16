// const mongoose = require("mongoose");

// const clientSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     phone: { type: String },
//     dob: { type: String },
//     gender: { type: String, enum: ["Male", "Female", "Other"] },
//     location: { type: String },
//     notes: { type: String },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Client", clientSchema);

// backend/models/clientsModel.js// backend/models/Client.js
const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    dob: { type: String, default: "" },
    tob: { type: String, default: "" },
    pob: { type: String, default: "" },
    gender: { type: String, default: "" },
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


