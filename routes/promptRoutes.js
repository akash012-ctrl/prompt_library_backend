// routes/promptRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { getAllPrompts, getPromptById, createPrompt, updatePrompt, deletePrompt, getPromptsByCategory } = require('../controllers/promptController');
const authMiddleware = require('../middleware/auth');
const checkOwnership = require('../middleware/ownership');

const router = express.Router();

// Public route: Get all prompts
router.get('/', getAllPrompts);

// Public route: Get prompts by category
router.get('/category/:category', getPromptsByCategory);

// Public route: Get a single prompt by ID
router.get('/:id', getPromptById);

// Protected route: Create a new prompt
router.post(
    '/',
    [
        // Validate prompt fields
        body('title').notEmpty().withMessage('Title is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('tags').isArray().withMessage('Tags must be an array'),
        body('category').notEmpty().withMessage('Category is required'),
    ],
    authMiddleware,
    createPrompt
);

// Protected route: Update a prompt by ID
router.put(
    '/:id',
    [
        // Validate prompt fields
        body('title').optional().notEmpty().withMessage('Title cannot be empty'),
        body('description').optional().notEmpty().withMessage('Description cannot be empty'),
        body('tags').optional().isArray().withMessage('Tags must be an array'),
        body('category').optional().notEmpty().withMessage('Category cannot be empty'),
    ],
    authMiddleware,
    checkOwnership,
    updatePrompt
);

// @route   GET /api/prompts/search
// @desc    Search prompts by title or tags
router.get(
    '/search',
    [
        // Validate the query parameter
        body('query')
            .optional()
            .isString()
            .withMessage('Search query must be a string'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { query } = req.query; // Get the search query from the request

        try {
            if (!query || query.trim() === '') {
                return res.json([]); // Return empty results if no query is provided
            }

            // Perform a case-insensitive search on title and tags
            const prompts = await Prompt.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } }, // Match title
                    { tags: { $in: [new RegExp(query, 'i')] } }, // Match tags
                ],
            })
                .populate('userId', 'email') // Populate user details
                .limit(10); // Limit results to 10 for performance

            res.json(prompts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ errors: [{ msg: 'Server error' }] });
        }
    }
);

// Protected route: Delete a prompt by ID
router.delete('/:id', authMiddleware, checkOwnership, deletePrompt);

module.exports = router;