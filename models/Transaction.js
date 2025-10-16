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
