const mongoose = require('mongoose');

const calculatorDataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, required: true }, // kundli, numerology, compatibility
    input: { type: Object, required: true },
    output: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CalculatorData', calculatorDataSchema);
