const crypto = require('crypto');
const Transaction = require('../models/Transaction');

exports.webhookHandler = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    const expected = crypto
      .createHmac('sha256', webhookSecret)
      .update(req.body)
      .digest('hex');

    if (signature !== expected) {
      console.log('❌ Invalid Webhook Signature');
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const event = JSON.parse(req.body.toString('utf8'));

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;

      const tx = await Transaction.findOne({ razorpayOrderId: orderId });
      if (tx) {
        tx.status = 'Completed';
        tx.razorpayPaymentId = payment.id;
        await tx.save();
      }
    }

    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook Error:', err);
    res.status(500).json({ message: 'Webhook failed' });
  }
};
