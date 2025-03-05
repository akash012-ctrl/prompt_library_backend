// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    ssl: true,
    tlsAllowInvalidCertificates: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Import Routes
const authRoutes = require('./routes/auth');
const promptRoutes = require('./routes/promptRoutes');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Use Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/prompts', promptRoutes); // Prompt routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/reports', reportRoutes); // Report routes

// Default Route (Optional)
app.get('/', (req, res) => {
    res.send('Welcome to the Prompt Library API');
});

// Error Handling Middleware (Optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});


// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    // In production, avoid exposing stack traces
    if (process.env.NODE_ENV === 'production') {
        res.status(500).json({ errors: [{ msg: 'Something went wrong!' }] });
    } else {
        res.status(500).json({ errors: [{ msg: err.message }] });
    }
});

// Export the app
module.exports = app;