

// const express = require("express");
// const router = express.Router();

// // Kundli Calculator
// router.post("/kundli", (req, res) => {
//   const { name, dob, pob } = req.body;
//   res.json({ name, dob, pob, sunSign: "Leo", moonSign: "Cancer" });
// });

// // Numerology Calculator
// router.post("/numerology", (req, res) => {
//   const { name } = req.body;
//   res.json({ name, lifeNumber: 7 });
// });

// // Compatibility Calculator
// router.post("/compatibility", (req, res) => {
//   const { name1, name2 } = req.body;
//   res.json({ name1, name2, score: "85%" });
// });

// // Transit Calculator
// router.post("/transit", (req, res) => {
//   const { dob } = req.body;
//   res.json({ dob, message: "Transit calculation result" });
// });

// // Dasha Calculator
// router.post("/dasha", (req, res) => {
//   const { dob } = req.body;
//   res.json({ dob, message: "Dasha calculation result" });
// });

// // Shadbala Calculator
// router.post("/shadbala", (req, res) => {
//   res.json({ message: "Shadbala calculation result" });
// });

// // Manglik Calculator
// router.post("/manglik", (req, res) => {
//   res.json({ message: "Manglik calculation result" });
// });

// // Muhurat Calculator
// router.post("/muhurat", (req, res) => {
//   res.json({ message: "Muhurat calculation result" });
// });

// // Remedial Calculator
// router.post("/remedial", (req, res) => {
//   res.json({ message: "Remedial calculation result" });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const axios = require("axios");

const PROKERALA_BASE_URL = process.env.PROKERALA_BASE_URL;
const PROKERALA_TOKEN_URL = process.env.PROKERALA_TOKEN_URL;
const CLIENT_ID = process.env.PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.PROKERALA_CLIENT_SECRET;

let accessToken = null;

/* --------------------------- Helper: Get Access Token --------------------------- */
async function getAccessToken() {
  try {
    if (accessToken) return accessToken;

    const res = await axios.post(
      PROKERALA_TOKEN_URL,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    accessToken = res.data.access_token;

    // Reset after expiry (3600 seconds default)
    setTimeout(() => (accessToken = null), 3500 * 1000);

    return accessToken;
  } catch (err) {
    console.error("❌ Error fetching Prokerala Access Token:", err.message);
    throw new Error("Failed to authenticate Prokerala API");
  }
}

/* --------------------------- Helper: Call Prokerala API --------------------------- */
async function callProkeralaAPI(endpoint, params) {
  try {
    const token = await getAccessToken();

    const response = await axios.get(`${PROKERALA_BASE_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });

    return response.data;
  } catch (error) {
    console.error(`⚠️ Error in ${endpoint}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || "API request failed");
  }
}

/* --------------------------- ✅ 1. Kundli Calculator --------------------------- */
router.post("/kundli", async (req, res) => {
  try {
    const { date, time, place } = req.body;

    const [day, month, year] = date.split("-");
    const [hour, minute] = time.split(":");

    const data = await callProkeralaAPI("/astrology/birth-chart", {
      datetime: `${year}-${month}-${day}T${hour}:${minute}:00+05:30`,
      coordinates: place,
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --------------------------- ✅ 2. Numerology Calculator --------------------------- */
router.post("/numerology", async (req, res) => {
  try {
    const { name, date } = req.body;
    const data = await callProkeralaAPI("/numerology/numerology-chart", {
      name,
      date,
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --------------------------- ✅ 3. Compatibility Calculator --------------------------- */
router.post("/compatibility", async (req, res) => {
  try {
    const { boy_dob, boy_tob, girl_dob, girl_tob } = req.body;

    const data = await callProkeralaAPI("/astrology/match-making", {
      boy_dob,
      boy_tob,
      girl_dob,
      girl_tob,
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --------------------------- ✅ 4. Transit Calculator --------------------------- */
router.post("/transit", async (req, res) => {
  try {
    const { date, place } = req.body;

    const data = await callProkeralaAPI("/astrology/planet-transit", {
      date,
      coordinates: place,
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --------------------------- ✅ 5. Dasha Calculator --------------------------- */
router.post("/dasha", async (req, res) => {
  try {
    const { date, time, place } = req.body;

    const data = await callProkeralaAPI("/astrology/vimshottari-dasha", {
      datetime: `${date}T${time}+05:30`,
      coordinates: place,
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --------------------------- ✅ 6. Zodiac Calculator --------------------------- */
router.post("/zodiac", async (req, res) => {
  try {
    const { date } = req.body;
    const data = await callProkeralaAPI("/astrology/zodiac-sign", { date });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --------------------------- ✅ 7. Nakshatra Calculator --------------------------- */
router.post("/nakshatra", async (req, res) => {
  try {
    const { date, time, place } = req.body;

    const data = await callProkeralaAPI("/astrology/nakshatra", {
      datetime: `${date}T${time}+05:30`,
      coordinates: place,
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --------------------------- ✅ 8. Planetary Positions --------------------------- */
router.post("/planetary", async (req, res) => {
  try {
    const { date, time, place } = req.body;

    const data = await callProkeralaAPI("/astrology/planet-position", {
      datetime: `${date}T${time}+05:30`,
      coordinates: place,
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --------------------------- ✅ 9. Daily Predictions --------------------------- */
router.post("/daily-prediction", async (req, res) => {
  try {
    const { zodiac } = req.body;
    const data = await callProkeralaAPI("/astrology/daily-prediction", {
      sign: zodiac,
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
