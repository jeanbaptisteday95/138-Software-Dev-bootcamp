const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/db');

// Load environment variables
require('dotenv').config();

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
