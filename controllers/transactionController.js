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
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update transaction", error: err });
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete transaction", error: err });
  }
};
