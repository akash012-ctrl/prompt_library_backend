// controllers/promptController.js
const Prompt = require('../models/Prompt');

// @desc    Get all prompts
// @route   GET /api/prompts
exports.getAllPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find().populate('userId', 'email'); // Populate user details
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single prompt by ID
// @route   GET /api/prompts/:id
exports.getPromptById = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id).populate('userId', 'email');
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    res.json(prompt);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new prompt
// @route   POST /api/prompts
exports.createPrompt = async (req, res) => {
  try {
    const { title, description, tags, category } = req.body;

    const newPrompt = new Prompt({
      userId: req.user, // User ID from auth middleware
      title,
      description,
      tags,
      category,
    });

    const savedPrompt = await newPrompt.save();
    res.status(201).json(savedPrompt);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a prompt by ID
// @route   PUT /api/prompts/:id
exports.updatePrompt = async (req, res) => {
  try {
    const { title, description, tags, category } = req.body;

    const updatedPrompt = await Prompt.findByIdAndUpdate(
      req.params.id,
      { title, description, tags, category, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedPrompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    res.json(updatedPrompt);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a prompt by ID
// @route   DELETE /api/prompts/:id
exports.deletePrompt = async (req, res) => {
  try {
    const deletedPrompt = await Prompt.findByIdAndDelete(req.params.id);

    if (!deletedPrompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    res.json({ message: 'Prompt deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get prompts by category
// @route   GET /api/prompts/category/:category
exports.getPromptsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Get the valid categories from the Prompt model
    const validCategories = Prompt.schema.path('category').enumValues;

    // Validate if the provided category exists in our schema
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        message: 'Invalid category',
        validCategories
      });
    }

    const prompts = await Prompt.find({ category })
      .populate('userId', 'email')
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json({
      category,
      count: prompts.length,
      prompts
    });
  } catch (error) {
    console.error('Error in getPromptsByCategory:', error);
    res.status(500).json({ message: 'Server error' });
  }
};