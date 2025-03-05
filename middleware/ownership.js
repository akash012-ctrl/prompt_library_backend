// middleware/ownership.js
const Prompt = require('../models/Prompt');

// Middleware to check if the user owns the prompt
const checkOwnership = async (req, res, next) => {
  try {
    const promptId = req.params.id;
    const userId = req.user; // Authenticated user ID from auth middleware

    // Find the prompt by ID
    const prompt = await Prompt.findById(promptId);
    if (!prompt) {
      return res.status(404).json({ errors: [{ msg: 'Prompt not found' }] });
    }

    // Check if the authenticated user is the owner
    if (prompt.userId.toString() !== userId) {
      return res.status(403).json({ errors: [{ msg: 'You are not authorized to perform this action' }] });
    }

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

module.exports = checkOwnership;