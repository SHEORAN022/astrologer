// const mongoose = require('mongoose');

// const calculatorSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   type: { type: String, required: true }, // e.g., numerology, zodiac, horoscope
//   description: { type: String },
//   inputs: [
//     {
//       name: { type: String },
//       type: { type: String, default: "text" } // text, number, date
//     }
//   ],
//   formula: { type: String }, // JS formula as string
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Calculator', calculatorSchema);


const mongoose = require("mongoose");

const InputSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["text", "number", "date"], default: "text" },
});

const CalculatorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String },
    formula: { type: String, required: true },
    inputs: [InputSchema],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Calculator", CalculatorSchema);
