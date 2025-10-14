// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema(
//   {
//     customerName: { type: String, required: true },
//     email: { type: String, required: true },
//     serviceType: { type: String, required: true },
//     price: { type: Number, required: true },
//     status: {
//       type: String,
//       enum: ["Pending", "In Progress", "Completed"],
//       default: "Pending",
//     },
//     fileUrl: { type: String },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Order", orderSchema);
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    serviceType: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    fileUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
