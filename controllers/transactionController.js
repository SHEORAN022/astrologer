

const Transaction = require("../models/Transaction");

// Get all transactions with pagination, filtering, and statistics
exports.getTransactions = async (req, res) => {
  try {
    console.log('📊 Fetching transactions with query:', req.query);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const status = req.query.status;
    const clientName = req.query.clientName;
    const clientEmail = req.query.clientEmail;
    const paymentMethod = req.query.paymentMethod;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    // Build filter object
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (clientName) {
      filter.clientName = { $regex: clientName, $options: 'i' };
    }
    
    if (clientEmail) {
      filter.clientEmail = { $regex: clientEmail, $options: 'i' };
    }
    
    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
      }
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    // Execute queries in parallel for better performance
    const [transactions, totalTransactions, summary] = await Promise.all([
      Transaction.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      
      Transaction.countDocuments(filter),
      
      Transaction.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
            completedAmount: {
              $sum: {
                $cond: [{ $eq: ["$status", "Completed"] }, "$amount", 0]
              }
            },
            pendingAmount: {
              $sum: {
                $cond: [{ $eq: ["$status", "Pending"] }, "$amount", 0]
              }
            },
            failedAmount: {
              $sum: {
                $cond: [{ $eq: ["$status", "Failed"] }, "$amount", 0]
              }
            },
            refundedAmount: {
              $sum: {
                $cond: [{ $eq: ["$status", "Refunded"] }, "$amount", 0]
              }
            },
            totalCompleted: {
              $sum: {
                $cond: [{ $eq: ["$status", "Completed"] }, 1, 0]
              }
            },
            totalPending: {
              $sum: {
                $cond: [{ $eq: ["$status", "Pending"] }, 1, 0]
              }
            },
            totalFailed: {
              $sum: {
                $cond: [{ $eq: ["$status", "Failed"] }, 1, 0]
              }
            },
            totalRefunded: {
              $sum: {
                $cond: [{ $eq: ["$status", "Refunded"] }, 1, 0]
              }
            },
            averageAmount: { $avg: "$amount" }
          }
        }
      ])
    ]);

    const totalPages = Math.ceil(totalTransactions / limit);
    const summaryData = summary[0] || {
      totalAmount: 0,
      completedAmount: 0,
      pendingAmount: 0,
      failedAmount: 0,
      refundedAmount: 0,
      totalCompleted: 0,
      totalPending: 0,
      totalFailed: 0,
      totalRefunded: 0,
      averageAmount: 0
    };

    console.log(`✅ Found ${transactions.length} transactions (${totalTransactions} total)`);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        currentPage: page,
        totalPages,
        totalTransactions,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      },
      summary: {
        ...summaryData,
        totalTransactions
      },
      filters: {
        status,
        clientName,
        clientEmail,
        paymentMethod,
        startDate,
        endDate,
        sortBy,
        sortOrder
      }
    });

  } catch (err) {
    console.error('❌ Get transactions error:', err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Get single transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID format"
      });
    }

    console.log('🔍 Fetching transaction:', id);
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    console.log('✅ Transaction found:', transaction._id);

    res.json({
      success: true,
      data: transaction,
      message: "Transaction fetched successfully"
    });

  } catch (err) {
    console.error('❌ Get transaction error:', err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transaction",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Create new transaction (admin manual entry)
exports.createTransaction = async (req, res) => {
  try {
    console.log('📝 Creating new transaction:', req.body);

    const {
      clientName,
      clientEmail,
      amount,
      paymentMethod,
      status,
      transactionId,
      notes,
      serviceType,
      description
    } = req.body;

    // Comprehensive validation
    const errors = [];

    if (!clientName || typeof clientName !== 'string' || clientName.trim().length === 0) {
      errors.push('Client name is required');
    }

    if (!clientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
      errors.push('Valid email address is required');
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      errors.push('Amount must be a positive number');
    }

    if (amount && parseFloat(amount) > 1000000) {
      errors.push('Amount cannot exceed ₹10,00,000');
    }

    const validPaymentMethods = ['Razorpay', 'UPI', 'Card', 'Net Banking', 'Wallet', 'Cash', 'Bank Transfer'];
    if (paymentMethod && !validPaymentMethods.includes(paymentMethod)) {
      errors.push('Invalid payment method');
    }

    const validStatuses = ['Pending', 'Completed', 'Failed', 'Cancelled', 'Refunded'];
    if (status && !validStatuses.includes(status)) {
      errors.push('Invalid status');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors
      });
    }

    // Check for duplicate transaction ID if provided
    if (transactionId && transactionId.trim()) {
      const existingTransaction = await Transaction.findOne({ 
        transactionId: transactionId.trim() 
      });
      
      if (existingTransaction) {
        return res.status(400).json({
          success: false,
          message: "Transaction ID already exists"
        });
      }
    }

    // Check for duplicate email + amount combination in last 5 minutes (prevent accidental duplicates)
    const recentDuplicate = await Transaction.findOne({
      clientEmail: clientEmail.trim().toLowerCase(),
      amount: parseFloat(amount),
      createdAt: {
        $gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
      }
    });

    if (recentDuplicate) {
      return res.status(400).json({
        success: false,
        message: "Similar transaction created recently. Please wait before creating another.",
        duplicateId: recentDuplicate._id
      });
    }

    // Create transaction object
    const transactionData = {
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim().toLowerCase(),
      amount: parseFloat(amount),
      paymentMethod: paymentMethod || 'UPI',
      status: status || 'Pending',
      transactionId: transactionId ? transactionId.trim() : '',
      notes: notes ? notes.trim() : '',
      serviceType: serviceType || 'Consultation',
      description: description || `${serviceType || 'Consultation'} for ${clientName.trim()}`,
      createdBy: req.user ? req.user.id : 'admin', // If user info is available
      ipAddress: req.ip,
      userAgent: req.get('User-Agent') || '',
      createdAt: new Date()
    };

    const transaction = new Transaction(transactionData);
    const savedTransaction = await transaction.save();

    console.log('✅ Transaction created successfully:', savedTransaction._id);

    res.status(201).json({
      success: true,
      data: savedTransaction,
      message: "Transaction created successfully"
    });

  } catch (err) {
    console.error('❌ Create transaction error:', err);
    
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors
      });
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `Duplicate ${field}: ${err.keyValue[field]}`
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create transaction",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
// const Transaction = require("../models/Transaction");

// // Get all transactions
// exports.getTransactions = async (req, res) => {
//   try {
//     const transactions = await Transaction.find().sort({ createdAt: -1 });
//     res.json(transactions);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch transactions", error: err });
//   }
// };

// // Get single transaction
// exports.getTransactionById = async (req, res) => {
//   try {
//     const transaction = await Transaction.findById(req.params.id);
//     if (!transaction) return res.status(404).json({ message: "Transaction not found" });
//     res.json(transaction);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch transaction", error: err });
//   }
// };

// // Create transaction
// exports.createTransaction = async (req, res) => {
//   try {
//     const transaction = new Transaction(req.body);
//     await transaction.save();
//     res.status(201).json(transaction);
//   } catch (err) {
//     res.status(400).json({ message: "Failed to create transaction", error: err });
//   }
// };

// // Update transaction
// exports.updateTransaction = async (req, res) => {
//   try {
//     const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updated);
//   } catch (err) {
//     res.status(400).json({ message: "Failed to update transaction", error: err });
//   }
// };

// // Delete transaction
// exports.deleteTransaction = async (req, res) => {
//   try {
//     await Transaction.findByIdAndDelete(req.params.id);
//     res.json({ message: "Transaction deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to delete transaction", error: err });
//   }
// };

const Transaction = require("../models/Transaction");

// Get all transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch transactions", error: err });
  }
};

// Get single transaction
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch transaction", error: err });
  }
};

// Create transaction (admin manual create)
exports.createTransaction = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ message: "Failed to create transaction", error: err });
  }
};

// Update transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log('📝 Updating transaction:', id, updates);

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID format"
      });
    }

    // Find existing transaction
    const existingTransaction = await Transaction.findById(id);
    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    // Remove fields that shouldn't be updated directly
    delete updates._id;
    delete updates.__v;
    delete updates.createdAt;
    delete updates.razorpayOrderId; // Prevent tampering with payment IDs
    delete updates.razorpayPaymentId;
    delete updates.razorpaySignature;

    // Validation for updates
    const errors = [];

    if (updates.amount !== undefined) {
      if (isNaN(updates.amount) || parseFloat(updates.amount) <= 0) {
        errors.push('Amount must be a positive number');
      }
      if (parseFloat(updates.amount) > 1000000) {
        errors.push('Amount cannot exceed ₹10,00,000');
      }
      updates.amount = parseFloat(updates.amount);
    }

    if (updates.clientEmail !== undefined) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.clientEmail)) {
        errors.push('Invalid email format');
      }
      updates.clientEmail = updates.clientEmail.trim().toLowerCase();
    }

    if (updates.clientName !== undefined) {
      if (!updates.clientName || updates.clientName.trim().length === 0) {
        errors.push('Client name cannot be empty');
      }
      updates.clientName = updates.clientName.trim();
    }

    if (updates.paymentMethod !== undefined) {
      const validMethods = ['Razorpay', 'UPI', 'Card', 'Net Banking', 'Wallet', 'Cash', 'Bank Transfer'];
      if (!validMethods.includes(updates.paymentMethod)) {
        errors.push('Invalid payment method');
      }
    }

    if (updates.status !== undefined) {
      const validStatuses = ['Pending', 'Completed', 'Failed', 'Cancelled', 'Refunded'];
      if (!validStatuses.includes(updates.status)) {
        errors.push('Invalid status');
      }

      // Prevent changing completed transactions to pending
      if (existingTransaction.status === 'Completed' && updates.status === 'Pending') {
        errors.push('Cannot change completed transaction back to pending');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors
      });
    }

    // Add metadata
    updates.updatedAt = new Date();
    updates.updatedBy = req.user ? req.user.id : 'admin';

    // If notes are being updated, append timestamp
    if (updates.notes !== undefined && updates.notes !== existingTransaction.notes) {
      updates.notes = updates.notes + ` [Updated: ${new Date().toISOString()}]`;
    }

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
        context: 'query'
      }
    );

    console.log('✅ Transaction updated successfully:', transaction._id);

    res.json({
      success: true,
      data: transaction,
      message: "Transaction updated successfully"
    });

  } catch (err) {
    console.error('❌ Update transaction error:', err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors
      });
    }

    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `Duplicate ${field}: ${err.keyValue[field]}`
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update transaction",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update transaction", error: err });
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('🗑️ Deleting transaction:', id);

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID format"
      });
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    // Business rule: Prevent deletion of completed or refunded transactions
    if (['Completed', 'Refunded'].includes(transaction.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete ${transaction.status.toLowerCase()} transactions`,
        suggestion: "Consider marking it as cancelled instead"
      });
    }

    // Check if transaction has associated payments
    if (transaction.razorpayPaymentId) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete transaction with associated payment",
        suggestion: "Consider marking it as cancelled instead"
      });
    }

    await Transaction.findByIdAndDelete(id);

    console.log('✅ Transaction deleted successfully:', id);

    res.json({
      success: true,
      message: "Transaction deleted successfully",
      deletedId: id
    });

  } catch (err) {
    console.error('❌ Delete transaction error:', err);
    res.status(500).json({
      success: false,
      message: "Failed to delete transaction",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Get transaction statistics with time periods
exports.getTransactionStats = async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;
    
    console.log('📊 Fetching transaction stats for period:', period);
    
    let matchStage = {};
    const now = new Date();
    
    // Define time periods
    switch (period) {
      case 'today':
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        matchStage.createdAt = { $gte: startOfDay };
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchStage.createdAt = { $gte: weekAgo };
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchStage.createdAt = { $gte: monthAgo };
        break;
      case 'year':
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        matchStage.createdAt = { $gte: yearAgo };
        break;
      case 'custom':
        if (startDate && endDate) {
          matchStage.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
          };
        }
        break;
      default:
        // All time - no date filter
        break;
    }

    // Execute multiple aggregations in parallel
    const [
      overallStats,
      dailyStats,
      statusStats,
      paymentMethodStats,
      topClients
    ] = await Promise.all([
      // Overall statistics
      Transaction.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalTransactions: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
            completedTransactions: {
              $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] }
            },
            pendingTransactions: {
              $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] }
            },
            failedTransactions: {
              $sum: { $cond: [{ $eq: ["$status", "Failed"] }, 1, 0] }
            },
            completedAmount: {
              $sum: { $cond: [{ $eq: ["$status", "Completed"] }, "$amount", 0] }
            },
            pendingAmount: {
              $sum: { $cond: [{ $eq: ["$status", "Pending"] }, "$amount", 0] }
            },
            averageAmount: { $avg: "$amount" },
            maxAmount: { $max: "$amount" },
            minAmount: { $min: "$amount" }
          }
        }
      ]),

      // Daily statistics for charts
      Transaction.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
            },
            totalTransactions: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
            completedAmount: {
              $sum: { $cond: [{ $eq: ["$status", "Completed"] }, "$amount", 0] }
            },
            completedCount: {
              $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] }
            }
          }
        },
        { $sort: { "_id.date": 1 } },
        { $limit: 30 } // Last 30 days max
      ]),

      // Status breakdown
      Transaction.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalAmount: { $sum: "$amount" }
          }
        },
        { $sort: { count: -1 } }
      ]),

      // Payment method breakdown
      Transaction.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$paymentMethod",
            count: { $sum: 1 },
            totalAmount: { $sum: "$amount" }
          }
        },
        { $sort: { count: -1 } }
      ]),

      // Top clients by transaction value
      Transaction.aggregate([
        { $match: { ...matchStage, status: "Completed" } },
        {
          $group: {
            _id: {
              email: "$clientEmail",
              name: "$clientName"
            },
            totalTransactions: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
            lastTransaction: { $max: "$createdAt" }
          }
        },
        { $sort: { totalAmount: -1 } },
        { $limit: 10 }
      ])
    ]);

    const stats = overallStats[0] || {
      totalTransactions: 0,
      totalAmount: 0,
      completedTransactions: 0,
      pendingTransactions: 0,
      failedTransactions: 0,
      completedAmount: 0,
      pendingAmount: 0,
      averageAmount: 0,
      maxAmount: 0,
      minAmount: 0
    };

    // Calculate success rate
    const successRate = stats.totalTransactions > 0 
      ? ((stats.completedTransactions / stats.totalTransactions) * 100).toFixed(2)
      : 0;

    console.log('✅ Stats calculated successfully');

    res.json({
      success: true,
      data: {
        period: period || 'all',
        summary: {
          ...stats,
          successRate: parseFloat(successRate)
        },
        charts: {
          daily: dailyStats,
          statusBreakdown: statusStats,
          paymentMethodBreakdown: paymentMethodStats
        },
        topClients: topClients,
        metadata: {
          generatedAt: new Date().toISOString(),
          dateRange: matchStage.createdAt ? {
            from: matchStage.createdAt.$gte,
            to: matchStage.createdAt.$lte
          } : null
        }
      }
    });

  } catch (err) {
    console.error('❌ Get transaction stats error:', err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transaction statistics",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Export transactions to CSV
exports.exportTransactions = async (req, res) => {
  try {
    const { status, startDate, endDate, format } = req.query;
    
    console.log('📤 Exporting transactions with filters:', { status, startDate, endDate, format });
    
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
      };
    }

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    if (format === 'json') {
      // Return JSON format
      return res.json({
        success: true,
        data: transactions,
        count: transactions.length,
        exportedAt: new Date().toISOString()
      });
    }

    // Default CSV format
    const csvHeader = [
      'Transaction ID',
      'Client Name',
      'Client Email', 
      'Amount (INR)',
      'Status',
      'Payment Method',
      'Razorpay Order ID',
      'Razorpay Payment ID',
      'Service Type',
      'Description',
      'Notes',
      'Created At',
      'Updated At'
    ].join(',') + '\n';
    
    const csvRows = transactions.map(tx => {
      return [
        tx.transactionId || tx._id,
        `"${tx.clientName || ''}"`,
        tx.clientEmail || '',
        tx.amount || 0,
        tx.status || '',
        tx.paymentMethod || '',
        tx.razorpayOrderId || '',
        tx.razorpayPaymentId || '',
        tx.serviceType || '',
        `"${(tx.description || '').replace(/"/g, '""')}"`,
        `"${(tx.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        tx.createdAt ? new Date(tx.createdAt).toISOString() : '',
        tx.updatedAt ? new Date(tx.updatedAt).toISOString() : ''
      ].join(',');
    }).join('\n');

    const csv = csvHeader + csvRows;
    const filename = `transactions_${Date.now()}.csv`;

    console.log(`✅ Exported ${transactions.length} transactions to CSV`);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);

  } catch (err) {
    console.error('❌ Export transactions error:', err);
    res.status(500).json({
      success: false,
      message: "Failed to export transactions",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Search transactions by multiple criteria
exports.searchTransactions = async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    console.log('🔍 Searching transactions for:', q);

    const searchCriteria = {
      $or: [
        { clientName: { $regex: q, $options: 'i' } },
        { clientEmail: { $regex: q, $options: 'i' } },
        { transactionId: { $regex: q, $options: 'i' } },
        { razorpayPaymentId: { $regex: q, $options: 'i' } },
        { razorpayOrderId: { $regex: q, $options: 'i' } },
        { notes: { $regex: q, $options: 'i' } }
      ]
    };

    // If query is a valid amount, include amount search
    if (!isNaN(q)) {
      searchCriteria.$or.push({ amount: parseFloat(q) });
    }

    const transactions = await Transaction.find(searchCriteria)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    console.log(`✅ Found ${transactions.length} matching transactions`);

    res.json({
      success: true,
      data: transactions,
      count: transactions.length,
      query: q,
      message: `Found ${transactions.length} transactions`
    });

  } catch (err) {
    console.error('❌ Search transactions error:', err);
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete transaction", error: err });
  }
};
