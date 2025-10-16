// const express = require('express');
// const router = express.Router();
// const Feedback = require('../models/Feedback');
// const adminAuth = require('../middleware/adminAuth');

// // Add Feedback (Public)
// router.post('/', async (req,res)=>{
//   try{
//     const feedback = new Feedback(req.body);
//     await feedback.save();
//     res.status(201).json({ message:"Feedback submitted successfully", feedback });
//   }catch(err){
//     res.status(500).json({ message: err.message });
//   }
// });

// // Get all Feedbacks (Admin)
// router.get('/', adminAuth, async (req,res)=>{
//   try{
//     const feedbacks = await Feedback.find().sort({ createdAt:-1 });
//     res.status(200).json(feedbacks);
//   }catch(err){
//     res.status(500).json({ message: err.message });
//   }
// });

// // Delete Feedback (Admin)
// router.delete('/:id', adminAuth, async (req,res)=>{
//   try{
//     const feedback = await Feedback.findByIdAndDelete(req.params.id);
//     if(!feedback) return res.status(404).json({ message:"Feedback not found" });
//     res.json({ message:"Feedback deleted successfully" });
//   }catch(err){
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const adminAuth = require('../middleware/adminAuth');

// Submit feedback (public)
router.post('/', async (req,res)=>{
  try{
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ message:"Feedback submitted successfully", feedback });
  }catch(err){
    res.status(500).json({ message: err.message });
  }
});

// Get all feedbacks (admin)
router.get('/', adminAuth, async (req,res)=>{
  try{
    const feedbacks = await Feedback.find().sort({ createdAt:-1 });
    res.status(200).json(feedbacks);
  }catch(err){
    res.status(500).json({ message: err.message });
  }
});

// Delete feedback (admin)
router.delete('/:id', adminAuth, async (req,res)=>{
  try{
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if(!feedback) return res.status(404).json({ message:"Feedback not found" });
    res.status(200).json({ message:"Feedback deleted successfully" });
  }catch(err){
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
