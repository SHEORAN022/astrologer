const crypto = require("crypto");
const Transaction = require("../models/Transaction");

exports.handler = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const actualSignature = req.headers["x-razorpay-signature"];
    const body = req.body; // raw buffer

    const expected = crypto.createHmac("sha256", webhookSecret).update(body).digest("hex");

    if (expected !== actualSignature) {
      console.warn("Invalid webhook signature");
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const event = JSON.parse(body.toString());

    // handle payment.captured and others as needed
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;

      const tx = await Transaction.findOne({ razorpayOrderId: orderId });
      if (tx) {
        tx.status = "Completed";
        tx.razorpayPaymentId = payment.id;
        tx.transactionId = payment.id;
        await tx.save();
      }
    } else if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const tx = await Transaction.findOne({ razorpayOrderId: orderId });
      if (tx) {
        tx.status = "Failed";
        tx.razorpayPaymentId = payment.id;
        await tx.save();
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("webhook error", err);
    res.status(500).json({ message: "Webhook processing failed", error: err });
  }
};
