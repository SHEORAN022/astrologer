<<<<<<< HEAD
// const mongoose = require('mongoose');

// const transactionSchema = new mongoose.Schema({
//   clientName: String,
//   clientEmail: String,
//   amount: { type: Number, required: true },
//   currency: { type: String, default: 'INR' },
//   razorpayOrderId: { type: String, index: true },
//   razorpayPaymentId: String,
//   razorpaySignature: String,
//   paymentMethod: { type: String, enum: ['Razorpay', 'UPI', 'Card', 'Net Banking', 'Wallet'], default: 'Razorpay' },
//   status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
//   transactionId: String,
//   notes: mongoose.Schema.Types.Mixed,
// }, { timestamps: true });

// module.exports = mongoose.model('Transaction', transactionSchema);


const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  paymentId: String,
  orderId: String,
  amount: Number,
  status: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", transactionSchema);
=======
// const mongoose = require("mongoose");

// const transactionSchema = new mongoose.Schema({
//   clientName: { type: String },
//   clientEmail: { type: String },
//   amount: { type: Number, required: true },
//   currency: { type: String, default: "INR" },

//   // Razorpay specific:
//   razorpayOrderId: { type: String },
//   razorpayPaymentId: { type: String },
//   razorpaySignature: { type: String },

//   paymentMethod: { type: String, enum: ["Razorpay", "UPI", "Card", "Net Banking", "Wallet"], default: "Razorpay" },
//   status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },

//   transactionId: { type: String }, // optional custom transaction id
//   notes: { type: String },
//   meta: { type: Object },
// }, { timestamps: true });

// module.exports = mongoose.model("Transaction", transactionSchema);

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  clientName: { type: String },
  clientEmail: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  razorpayOrderId: { type: String, index: true },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  paymentMethod: { type: String, enum: ['Razorpay', 'UPI', 'Card', 'Net Banking', 'Wallet'], default: 'Razorpay' },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  transactionId: { type: String },
  notes: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
>>>>>>> efd1034d73f8736393e914cd597bd707ab3ed49b
