<<<<<<< HEAD
// const mongoose = require("mongoose");

// const feedbackSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   message: { type: String, required: true },
//   rating: { type: Number, min: 1, max: 5 },
// }, { timestamps: true });

// module.exports = mongoose.model("Feedback", feedbackSchema);
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  name: { type:String, required:true },
  email: { type:String, required:true },
  message: { type:String, required:true },
  rating: { type:Number, min:1, max:5 }
}, { timestamps:true });
=======

// const mongoose = require("mongoose");

// const feedbackSchema = new mongoose.Schema({
//   name: { type:String, required:true },
//   email: { type:String, required:true },
//   message: { type:String, required:true },
//   rating: { type:Number, min:1, max:5 }
// }, { timestamps:true });

// module.exports = mongoose.model("Feedback", feedbackSchema);

const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
  },
  { timestamps: true }
);
>>>>>>> efd1034d73f8736393e914cd597bd707ab3ed49b

module.exports = mongoose.model("Feedback", feedbackSchema);
