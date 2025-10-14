// const Razorpay = require("razorpay");
// const crypto = require("crypto");
// const Transaction = require("../models/Transaction");

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // create order -> frontend opens checkout with order.id
// exports.createOrder = async (req, res) => {
//   try {
//     const { amount, currency = "INR", clientName, clientEmail, notes } = req.body;
//     if (!amount || amount <= 0) return res.status(400).json({ message: "Valid amount required" });

//     const order = await razorpay.orders.create({
//       amount: Math.round(amount * 100),
//       currency,
//       receipt: `rcpt_${Date.now()}`,
//       notes: { clientName, clientEmail, ...(notes ? { notes } : {}) },
//     });

//     // create pending transaction record
//     const tx = await Transaction.create({
//       clientName: clientName || "Guest",
//       clientEmail,
//       amount,
//       currency,
//       status: "Pending",
//       paymentMethod: "Razorpay",
//       razorpayOrderId: order.id,
//       notes,
//       meta: { createdFrom: "createOrder" },
//     });

//     res.json({ order, txId: tx._id });
//   } catch (error) {
//     console.error("createOrder error", error);
//     res.status(500).json({ message: "Failed to create Razorpay order", error });
//   }
// };

// // verify signature after checkout success (client posts response)
// exports.verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({ message: "Missing verification fields" });
//     }

//     const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
//     hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
//     const expectedSignature = hmac.digest("hex");

//     const tx = await Transaction.findOne({ razorpayOrderId: razorpay_order_id });

//     if (expectedSignature !== razorpay_signature) {
//       if (tx) {
//         tx.status = "Failed";
//         tx.razorpayPaymentId = razorpay_payment_id;
//         tx.razorpaySignature = razorpay_signature;
//         await tx.save();
//       }
//       return res.status(400).json({ message: "Invalid signature" });
//     }

//     if (tx) {
//       tx.status = "Completed";
//       tx.razorpayPaymentId = razorpay_payment_id;
//       tx.razorpaySignature = razorpay_signature;
//       await tx.save();
//     }

//     res.json({ success: true, message: "Payment verified", txId: tx?._id });
//   } catch (error) {
//     console.error("verifyPayment error", error);
//     res.status(500).json({ message: "Verification failed", error });
//   }
// };

const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, clientName, clientEmail, notes } = req.body;
    if (!amount) return res.status(400).json({ message: 'Amount required' });

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: { clientName, clientEmail, ...notes },
    });

    const tx = await Transaction.create({
      clientName,
      clientEmail,
      amount,
      currency: 'INR',
      status: 'Pending',
      razorpayOrderId: order.id,
      notes,
    });

    res.json({ order, txId: tx._id });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ message: 'Error creating Razorpay order' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    const tx = await Transaction.findOne({ razorpayOrderId: razorpay_order_id });

    if (expected === razorpay_signature) {
      if (tx) {
        tx.status = 'Completed';
        tx.razorpayPaymentId = razorpay_payment_id;
        tx.razorpaySignature = razorpay_signature;
        await tx.save();
      }
      return res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      if (tx) {
        tx.status = 'Failed';
        await tx.save();
      }
      return res.status(400).json({ success: false, message: 'Signature mismatch' });
    }
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ message: 'Verification failed' });
  }
};
