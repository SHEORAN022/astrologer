// Dummy Kundli calculation
exports.kundliCalculator = (dob, tob, pob) => {
    return {
        lagna: "Aries",
        planets: {
            sun: "Leo",
            moon: "Cancer",
            mars: "Aries"
        }
    };
};

// Dummy Numerology
exports.numerologyCalculator = (name, dob) => {
    const lifePath = dob.split('-').reduce((a,b)=>a+Number(b),0)%9 || 9;
    return { lifePathNumber: lifePath };
};

// Dummy Compatibility
exports.compatibilityCalculator = (male, female) => {
    return {
        score: Math.floor(Math.random()*36),
        manglik: Math.random() > 0.5 ? "Yes" : "No"
    };
};
