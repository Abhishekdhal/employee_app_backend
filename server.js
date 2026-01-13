require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --- MONGODB CONNECTION LOGIC ---
const connectDB = async () => {
  try {
    // Check if we are already connected to avoid reconnecting in serverless environment
    if (mongoose.connection.readyState === 1) {
       return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); 
  }
};

// Connect to DB immediately
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/community', require('./routes/community'));
app.use('/api/chat', require('./routes/ai'));
app.use('/api/events', require('./routes/events'));
// Root Route (Optional: To check if backend is running)
app.get('/', (req, res) => {
  res.send('HCL Employee Support Backend is Running!');
});

const PORT = process.env.PORT || 3000;

// --- VERCEL CONFIGURATION ---
// Only listen to the port if running locally. 
// Vercel manages the port automatically in the cloud.
if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// Export the app for Vercel
module.exports = app;