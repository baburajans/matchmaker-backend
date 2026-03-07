// server.js
const express = require("express");
//const fetch = require("node-fetch"); // install with: npm install express node-fetch

const app = express();
app.use(express.json());

// Replace with your Prokerala credentials
const clientId = process.env.PROKERALA_CLIENT_ID;
const clientSecret = process.env.PROKERALA_CLIENT_SECRET;

// Function to get token from Prokerala
async function getAccessToken() {
  const response = await fetch("https://api.prokerala.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret
    })
  });

  const data = await response.json();
  if (!data.access_token) {
    throw new Error("Failed to get token: " + JSON.stringify(data));
  }
  return data.access_token;
}

// Endpoint: Check compatibility
app.post("/check-compatibility", async (req, res) => {
  try {
    const { girl_dob, girl_coordinates, boy_dob, boy_coordinates, ayanamsa } = req.body;

    const token = await getAccessToken();

    const response = await fetch(
      "https://api.prokerala.com/v2/astrology/porutham-advanced" +
      `?girl_dob=${encodeURIComponent(girl_dob)}` +
      `&girl_coordinates=${encodeURIComponent(girl_coordinates)}` +
      `&boy_dob=${encodeURIComponent(boy_dob)}` +
      `&boy_coordinates=${encodeURIComponent(boy_coordinates)}` +
      `&ayanamsa=${encodeURIComponent(ayanamsa)}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const result = await response.json();
    res.json(result);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
