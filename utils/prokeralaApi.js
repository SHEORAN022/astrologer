// const axios = require("axios");

// let accessToken = null;
// let tokenExpiry = 0;

// async function getProkeralaToken() {
//   const now = Math.floor(Date.now() / 1000);
//   if (accessToken && now < tokenExpiry) return accessToken;

//   try {
//     const res = await axios.post(
//       process.env.PROKERALA_TOKEN_URL,
//       new URLSearchParams({
//         grant_type: "client_credentials",
//         client_id: process.env.PROKERALA_CLIENT_ID,
//         client_secret: process.env.PROKERALA_CLIENT_SECRET,
//       }),
//       { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
//     );

//     accessToken = res.data.access_token;
//     tokenExpiry = now + res.data.expires_in - 60; // refresh 1 min before expiry
//     return accessToken;
//   } catch (err) {
//     console.error("❌ Prokerala Auth Error:", err.response?.data || err.message);
//     throw new Error("Failed to get Prokerala access token");
//   }
// }

// async function callProkeralaAPI(endpoint, params) {
//   const token = await getProkeralaToken();
//   try {
//     const res = await axios.get(`${process.env.PROKERALA_BASE_URL}${endpoint}`, {
//       headers: { Authorization: `Bearer ${token}` },
//       params,
//     });
//     return res.data;
//   } catch (err) {
//     console.error("❌ Prokerala API Error:", err.response?.data || err.message);
//     throw new Error("Prokerala API call failed");
//   }
// }

// module.exports = { callProkeralaAPI };

import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function getToken() {
  try {
    const auth = Buffer.from(
      `${process.env.PROKERALA_CLIENT_ID}:${process.env.PROKERALA_CLIENT_SECRET}`
    ).toString('base64');

    const response = await axios.post(
      process.env.PROKERALA_TOKEN_URL,
      {},
      { headers: { Authorization: `Basic ${auth}` } }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Prokerala token error:', error.response?.data || error.message);
    throw new Error('Failed to get Prokerala token');
  }
}

export async function callProkerala(endpoint, data) {
  try {
    const token = await getToken();
    const response = await axios.post(
      `${process.env.PROKERALA_BASE_URL}/${endpoint}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Prokerala API error:', error.response?.data || error.message);
    throw new Error('Failed to call Prokerala API');
  }
}
