// const express = require('express');
// const router = express.Router();
// const Transaction = require('../models/Transaction');

// router.get('/', async (req, res) => {
//   const txs = await Transaction.find().sort({ createdAt: -1 });
//   res.json(txs);
// });

// router.post('/', async (req, res) => {
//   const tx = await Transaction.create(req.body);
//   res.status(201).json(tx);
// });

// router.put('/:id', async (req, res) => {
//   const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   res.json(updated);
// });

// router.delete('/:id', async (req, res) => {
//   await Transaction.findByIdAndDelete(req.params.id);
//   res.json({ message: 'Transaction deleted' });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
  exportTransactions,
  searchTransactions
} = require('../controllers/transactionController');

// Development authentication
const authenticate = (req,res,next)=>{
  if (process.env.NODE_ENV==='development') {
    req.user={id:'admin',role:'admin'}; return next();
  }
  const token=req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({success:false,message:'Access token required'});
  // Verify JWT in production...
  req.user={id:'admin',role:'admin'};
  next();
};

// Admin-only
const requireAdmin = (req,res,next)=>{
  if (!req.user||req.user.role!=='admin') return res.status(403).json({success:false,message:'Admin access required'});
  next();
};

// Logging
const logRequest=(req,res,next)=>{
  console.log(`${req.method} ${req.originalUrl} - ${req.ip}`);
  next();
};
router.use(logRequest);

// List transactions
router.get('/', authenticate, requireAdmin, getTransactions);

// Transaction stats
router.get('/stats', authenticate, requireAdmin, getTransactionStats);

// Export transactions
router.get('/export', authenticate, requireAdmin, exportTransactions);

// Search transactions
router.get('/search', authenticate, requireAdmin, searchTransactions);

// Health check
router.get('/health',(req,res)=>res.json({success:true,message:'Transaction service running',timestamp:new Date().toISOString()}));

// Get single transaction
router.get('/:id', authenticate, requireAdmin, getTransactionById);

// Create transaction
router.post('/', authenticate, requireAdmin, createTransaction);

// Update transaction
router.put('/:id', authenticate, requireAdmin, updateTransaction);

// Delete transaction
router.delete('/:id', authenticate, requireAdmin, deleteTransaction);

module.exports = router;
