const express = require("express");
const router = express.Router();

// Helper function to simulate calculations
const calculateResult = (type, data) => {
  switch (type) {
    case "kundli":
      return { chart: "Sample Kundli Chart", ascendant: "Leo", planets: ["Sun", "Moon", "Mars"] };
    case "numerology":
      return { name: data.name, number: 7, destiny: "Spiritual and analytical" };
    case "compatibility":
      return { score: 85, message: "Good compatibility with emotional understanding." };
    case "transit":
      return { planet: "Saturn", effect: "Career transformation phase active." };
    case "dasha":
      return { currentDasha: "Venus Mahadasha", nextDasha: "Sun", effect: "Love and comfort-oriented period." };
    case "zodiac":
      return { sign: "Virgo", traits: "Analytical, perfectionist, and caring." };
    case "nakshatra":
      return { nakshatra: "Rohini", rulingPlanet: "Moon", qualities: "Creative and emotional." };
    case "planetary":
      return { dominantPlanet: "Mars", influence: "Strong energy and courage." };
    case "daily-prediction":
      return { today: "A positive day for communication and new beginnings." };
    case "horoscope":
      return { sign: data.sign || "Leo", prediction: "Financial growth and recognition indicated." };
    case "manglik":
      return { isManglik: true, remedies: ["Wear coral", "Chant Hanuman Chalisa"] };
    case "panchang":
      return { tithi: "Dwitiya", yoga: "Siddha", karan: "Bava", nakshatra: "Ashwini" };
    case "gemstone":
      return { gemstone: "Emerald", reason: "For Mercury balance and intellect growth." };
    case "transit-remedy":
      return { planet: "Saturn", suggestedRemedy: "Donate black sesame seeds on Saturdays." };
    default:
      return { message: "Unknown calculator type." };
  }
};

// Universal calculator endpoint
router.post("/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const data = req.body;
    const result = calculateResult(type, data);
    res.status(200).json({ success: true, type, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
