const CalculatorData = require('../models/CalculatorData');
const { kundliCalculator, numerologyCalculator, compatibilityCalculator } = require('../utils/astrologyCalculations');

exports.calculateKundli = async (req, res) => {
    const { userId, dob, tob, pob } = req.body;
    const result = kundliCalculator(dob, tob, pob);
    const data = new CalculatorData({ userId, type: 'kundli', input: { dob, tob, pob }, output: result });
    await data.save();
    res.json(result);
};

exports.calculateNumerology = async (req, res) => {
    const { userId, dob, name } = req.body;
    const result = numerologyCalculator(name, dob);
    const data = new CalculatorData({ userId, type: 'numerology', input: { dob, name }, output: result });
    await data.save();
    res.json(result);
};

exports.calculateCompatibility = async (req, res) => {
    const { userId, male, female } = req.body;
    const result = compatibilityCalculator(male, female);
    const data = new CalculatorData({ userId, type: 'compatibility', input: { male, female }, output: result });
    await data.save();
    res.json(result);
};
