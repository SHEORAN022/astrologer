

// const Razorpay = require('razorpay');
// const crypto = require('crypto');
// const Transaction = require('../models/Transaction');

// // Initialize Razorpay with error handling
// let razorpay;
// try {
//   razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
//   });
//   console.log('✅ Razorpay initialized successfully');
// } catch (error) {
//   console.error('❌ Razorpay initialization failed:', error.message);
// }

// // Create Razorpay Order
// exports.createOrder = async (req, res) => {
//   try {
//     console.log('📝 Creating Razorpay order with data:', req.body);

//     const { amount, clientName, clientEmail, notes } = req.body;

//     // Validation
//     if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid amount is required'
//       });
//     }

//     if (!clientName || typeof clientName !== 'string' || clientName.trim().length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Client name is required'
//       });
//     }

//     if (!clientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid client email is required'
//       });
//     }

//     if (!razorpay) {
//       return res.status(500).json({
//         success: false,
//         message: 'Payment gateway not configured'
//       });
//     }

//     const amountInPaise = Math.round(parseFloat(amount) * 100);
    
//     // Create order in Razorpay
//     const orderOptions = {
//       amount: amountInPaise,
//       currency: 'INR',
//       receipt: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//       notes: {
//         clientName: clientName.trim(),
//         clientEmail: clientEmail.trim().toLowerCase(),
//         description: notes || 'Astrology consultation payment',
//         createdBy: 'admin',
//         timestamp: new Date().toISOString()
//       },
//     };

//     console.log('🚀 Creating Razorpay order with options:', orderOptions);
//     const order = await razorpay.orders.create(orderOptions);
//     console.log('✅ Razorpay order created:', order.id);

//     // Create transaction record in database
//     const transactionData = {
//       clientName: clientName.trim(),
//       clientEmail: clientEmail.trim().toLowerCase(),
//       amount: parseFloat(amount),
//       currency: 'INR',
//       razorpayOrderId: order.id,
//       status: 'Pending',
//       paymentMethod: 'Razorpay',
//       notes: notes || '',
//       description: `Payment for ${clientName.trim()}`,
//       serviceType: 'Consultation',
//       createdAt: new Date()
//     };

//     const transaction = new Transaction(transactionData);
//     await transaction.save();
//     console.log('✅ Transaction saved to database:', transaction._id);

//     res.json({
//       success: true,
//       order: order,
//       txId: transaction._id,
//       message: 'Order created successfully'
//     });

//   } catch (error) {
//     console.error('❌ Create order error:', error);
    
//     // Handle specific Razorpay errors
//     if (error.statusCode) {
//       return res.status(error.statusCode).json({
//         success: false,
//         message: 'Razorpay error: ' + error.error.description,
//         error: error.error
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Failed to create order',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // Verify Payment
// exports.verifyPayment = async (req, res) => {
//   try {
//     console.log('🔍 Verifying payment with data:', req.body);

//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       txId
//     } = req.body;

//     // Validation
//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required payment parameters'
//       });
//     }

//     if (!process.env.RAZORPAY_KEY_SECRET) {
//       return res.status(500).json({
//         success: false,
//         message: 'Payment verification not configured'
//       });
//     }

//     // Create signature for verification
//     const body = razorpay_order_id + '|' + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest('hex');

//     console.log('🔐 Expected signature:', expectedSignature);
//     console.log('🔐 Received signature:', razorpay_signature);

//     // Find the transaction
//     let transaction;
//     if (txId) {
//       transaction = await Transaction.findById(txId);
//     }
    
//     if (!transaction) {
//       transaction = await Transaction.findOne({ razorpayOrderId: razorpay_order_id });
//     }

//     if (!transaction) {
//       return res.status(404).json({
//         success: false,
//         message: 'Transaction not found'
//       });
//     }

//     // Verify signature
//     if (expectedSignature === razorpay_signature) {
//       // Payment verified successfully
//       transaction.status = 'Completed';
//       transaction.razorpayPaymentId = razorpay_payment_id;
//       transaction.razorpaySignature = razorpay_signature;
//       transaction.transactionId = razorpay_payment_id;
//       transaction.updatedAt = new Date();
//       transaction.webhookReceived = true;

//       await transaction.save();

//       console.log('✅ Payment verified successfully for transaction:', transaction._id);

//       res.json({
//         success: true,
//         message: 'Payment verified successfully',
//         transaction: transaction
//       });

//     } else {
//       // Payment verification failed
//       transaction.status = 'Failed';
//       transaction.notes = (transaction.notes || '') + ' | Payment verification failed at ' + new Date().toISOString();
//       transaction.updatedAt = new Date();

//       await transaction.save();

//       console.log('❌ Payment verification failed for transaction:', transaction._id);

//       res.status(400).json({
//         success: false,
//         message: 'Payment verification failed - signature mismatch',
//         transaction: transaction
//       });
//     }

//   } catch (error) {
//     console.error('❌ Verify payment error:', error);
    
//     res.status(500).json({
//       success: false,
//       message: 'Payment verification failed',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // Get Payment Details from Razorpay
// exports.getPaymentDetails = async (req, res) => {
//   try {
//     const { paymentId } = req.params;

//     if (!paymentId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Payment ID is required'
//       });
//     }

//     if (!razorpay) {
//       return res.status(500).json({
//         success: false,
//         message: 'Payment gateway not configured'
//       });
//     }

//     console.log('📊 Fetching payment details for:', paymentId);
//     const payment = await razorpay.payments.fetch(paymentId);

//     res.json({
//       success: true,
//       payment: payment,
//       message: 'Payment details fetched successfully'
//     });

//   } catch (error) {
//     console.error('❌ Get payment details error:', error);
    
//     if (error.statusCode === 400) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid payment ID'
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch payment details',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // Refund Payment
// exports.refundPayment = async (req, res) => {
//   try {
//     const { paymentId, amount, reason } = req.body;

//     if (!paymentId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Payment ID is required'
//       });
//     }

//     if (!razorpay) {
//       return res.status(500).json({
//         success: false,
//         message: 'Payment gateway not configured'
//       });
//     }

//     const refundData = {
//       speed: 'normal',
//       notes: {
//         reason: reason || 'Refund requested by admin',
//         processedBy: 'admin',
//         timestamp: new Date().toISOString()
//       },
//       receipt: `refund_${Date.now()}`
//     };

//     // If partial refund amount is specified
//     if (amount && parseFloat(amount) > 0) {
//       refundData.amount = Math.round(parseFloat(amount) * 100); // Convert to paise
//     }

//     console.log('💰 Processing refund for payment:', paymentId);
//     const refund = await razorpay.payments.refund(paymentId, refundData);
//     console.log('✅ Refund processed:', refund.id);

//     // Update transaction status in database
//     const transaction = await Transaction.findOne({ razorpayPaymentId: paymentId });

//     if (transaction) {
//       transaction.status = 'Refunded';
//       transaction.refundAmount = amount ? parseFloat(amount) : transaction.amount;
//       transaction.refundReason = reason || 'Refund requested by admin';
//       transaction.refundDate = new Date();
//       transaction.refundId = refund.id;
//       transaction.notes = (transaction.notes || '') + ` | Refunded: ${refund.id} on ${new Date().toISOString()}`;
//       transaction.updatedAt = new Date();
      
//       await transaction.save();
//       console.log('✅ Transaction updated with refund info');
//     }

//     res.json({
//       success: true,
//       refund: refund,
//       transaction: transaction,
//       message: 'Refund processed successfully'
//     });

//   } catch (error) {
//     console.error('❌ Refund payment error:', error);
    
//     if (error.statusCode === 400) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid refund request: ' + error.error.description
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Refund failed',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // Webhook handler for Razorpay events
// exports.handleWebhook = async (req, res) => {
//   try {
//     const webhookSignature = req.get('X-Razorpay-Signature');
//     const webhookBody = JSON.stringify(req.body);
    
//     console.log('🎣 Webhook received:', req.body.event);

//     // Verify webhook signature if secret is configured
//     if (process.env.RAZORPAY_WEBHOOK_SECRET) {
//       const expectedSignature = crypto
//         .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
//         .update(webhookBody)
//         .digest('hex');

//       if (webhookSignature !== expectedSignature) {
//         console.log('❌ Webhook signature verification failed');
//         return res.status(400).json({ success: false, message: 'Invalid signature' });
//       }
//     }

//     const event = req.body.event;
//     const paymentEntity = req.body.payload?.payment?.entity;
//     const orderEntity = req.body.payload?.order?.entity;

//     switch (event) {
//       case 'payment.captured':
//         await handlePaymentSuccess(paymentEntity);
//         break;

//       case 'payment.failed':
//         await handlePaymentFailure(paymentEntity);
//         break;

//       case 'order.paid':
//         await handleOrderPaid(orderEntity);
//         break;

//       case 'refund.created':
//         await handleRefundCreated(req.body.payload?.refund?.entity);
//         break;

//       default:
//         console.log('🤷 Unhandled webhook event:', event);
//     }

//     res.status(200).json({ success: true, message: 'Webhook processed' });

//   } catch (error) {
//     console.error('❌ Webhook error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Helper function for payment success
// async function handlePaymentSuccess(paymentEntity) {
//   try {
//     if (!paymentEntity) return;

//     const transaction = await Transaction.findOne({
//       razorpayOrderId: paymentEntity.order_id
//     });

//     if (transaction && transaction.status !== 'Completed') {
//       transaction.status = 'Completed';
//       transaction.razorpayPaymentId = paymentEntity.id;
//       transaction.transactionId = paymentEntity.id;
//       transaction.webhookReceived = true;
//       transaction.webhookData = paymentEntity;
//       transaction.updatedAt = new Date();
      
//       await transaction.save();
//       console.log('✅ Payment success handled via webhook for:', transaction._id);
//     }
//   } catch (error) {
//     console.error('❌ Error handling payment success webhook:', error);
//   }
// }

// // Helper function for payment failure
// async function handlePaymentFailure(paymentEntity) {
//   try {
//     if (!paymentEntity) return;

//     const transaction = await Transaction.findOne({
//       razorpayOrderId: paymentEntity.order_id
//     });

//     if (transaction && transaction.status === 'Pending') {
//       transaction.status = 'Failed';
//       transaction.notes = (transaction.notes || '') + ` | Payment failed via webhook: ${paymentEntity.error_description}`;
//       transaction.webhookReceived = true;
//       transaction.webhookData = paymentEntity;
//       transaction.updatedAt = new Date();
      
//       await transaction.save();
//       console.log('❌ Payment failure handled via webhook for:', transaction._id);
//     }
//   } catch (error) {
//     console.error('❌ Error handling payment failure webhook:', error);
//   }
// }

// // Helper function for order paid
// async function handleOrderPaid(orderEntity) {
//   try {
//     if (!orderEntity) return;

//     const transaction = await Transaction.findOne({
//       razorpayOrderId: orderEntity.id
//     });

//     if (transaction) {
//       transaction.webhookReceived = true;
//       transaction.webhookData = { ...transaction.webhookData, order: orderEntity };
//       transaction.updatedAt = new Date();
      
//       await transaction.save();
//       console.log('✅ Order paid webhook handled for:', transaction._id);
//     }
//   } catch (error) {
//     console.error('❌ Error handling order paid webhook:', error);
//   }
// }

// // Helper function for refund created
// async function handleRefundCreated(refundEntity) {
//   try {
//     if (!refundEntity) return;

//     const transaction = await Transaction.findOne({
//       razorpayPaymentId: refundEntity.payment_id
//     });

//     if (transaction) {
//       transaction.status = 'Refunded';
//       transaction.refundAmount = refundEntity.amount / 100; // Convert from paise
//       transaction.refundId = refundEntity.id;
//       transaction.refundDate = new Date(refundEntity.created_at * 1000);
//       transaction.webhookReceived = true;
//       transaction.webhookData = { ...transaction.webhookData, refund: refundEntity };
//       transaction.updatedAt = new Date();
      
//       await transaction.save();
//       console.log('✅ Refund webhook handled for:', transaction._id);
//     }
//   } catch (error) {
//     console.error('❌ Error handling refund webhook:', error);
//   }
// }

// // Test payment gateway connection
// exports.testConnection = async (req, res) => {
//   try {
//     if (!razorpay) {
//       return res.status(500).json({
//         success: false,
//         message: 'Razorpay not configured'
//       });
//     }

//     // Try to fetch a dummy order to test connection
//     const testOrder = await razorpay.orders.create({
//       amount: 100, // ₹1 in paise
//       currency: 'INR',
//       receipt: 'test_receipt_' + Date.now()
//     });

//     res.json({
//       success: true,
//       message: 'Razorpay connection successful',
//       testOrderId: testOrder.id
//     });

//   } catch (error) {
//     console.error('❌ Razorpay connection test failed:', error);
    
//     res.status(500).json({
//       success: false,
//       message: 'Razorpay connection failed',
//       error: error.message
//     });
//   }
// };
require("dotenv").config();
const Razorpay = require("razorpay");
const Transaction = require("../models/Transaction");

// ✅ Initialize Razorpay with correct environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Check if keys are loaded
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("❌ Razorpay keys missing! Please check your .env file");
}

// ✅ Create Razorpay Order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    console.log("✅ Razorpay order created successfully:", order.id);
    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("❌ Razorpay order creation failed:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: err.message,
    });
  }
};

// ✅ Save Payment Transaction to Database
exports.saveTransaction = async (req, res) => {
  try {
    const { paymentId, orderId, amount, status } = req.body;

    if (!paymentId || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    const newTxn = new Transaction({
      paymentId,
      orderId,
      amount,
      status,
    });

    await newTxn.save();
    console.log("💾 Transaction saved successfully:", newTxn._id);

    res.status(201).json({
      success: true,
      message: "Transaction saved successfully",
      transaction: newTxn,
    });
  } catch (err) {
    console.error("❌ Failed to save transaction:", err.message);
    res.status(500).json({
      success: false,
      message: "Transaction save failed",
      error: err.message,
    });
  }
};

// ✅ Verify Payment (Optional - for frontend signature verification)
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (err) {
    console.error("❌ Payment verification error:", err.message);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};
