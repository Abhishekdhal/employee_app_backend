const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    // Call your Python FastAPI
    // Make sure your Python server is running!
    const response = await axios.post(process.env.FASTAPI_URL, {
      query: message
    });

    res.json({ reply: response.data.response });
  } catch (err) {
    console.error("AI Error:", err.message);
    res.json({ reply: "I'm having trouble connecting to the AI brain." });
  }
});

module.exports = router;