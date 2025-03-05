// routes/test.js
const express = require('express');
const router = express.Router();

// Test route
router.get('/', (req, res) => {
    res.send('API is running');
});

module.exports = router;