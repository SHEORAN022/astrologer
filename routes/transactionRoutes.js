// const express = require("express");
// const router = express.Router();
// const {
//   getTransactions,
//   getTransactionById,
//   createTransaction,
//   updateTransaction,
//   deleteTransaction,
// } = require("../controllers/transactionController");

// router.get("/", getTransactions);
// router.get("/:id", getTransactionById);
// router.post("/", createTransaction);
// router.put("/:id", updateTransaction);
// router.delete("/:id", deleteTransaction);

// module.exports = router;

const express = require('express');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const txs = await Transaction.find().sort({ createdAt: -1 });
    res.json(txs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

module.exports = router;
