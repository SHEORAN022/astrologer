// const express = require("express");
// const router = express.Router();
// const paymentController = require("../controllers/paymentController");

// router.post("/create-order", paymentController.createOrder);
// router.post("/save-transaction", paymentController.saveTransaction);
// router.post("/verify-payment", paymentController.verifyPayment);

// module.exports = router;
const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");

// ✅ Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount required" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({ success: true, order });
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).json({ success: false, message: "Razorpay order creation failed" });
  }
});

// ✅ Payment Verification (optional)
router.post("/verify", async (req, res) => {
  try {
    res.json({ success: true, message: "Payment verified (mock)" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

module.exports = router;
