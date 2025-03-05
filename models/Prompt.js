// models/Prompt.js
const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    index: true, // Add index for faster search
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  tags: {
    type: [String],
    default: [],
    index: true, // Add index for faster search
  },
  category: {
    type: String,
    enum: ['design', 'animation', 'coding', 'writing', 'other'],
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  votes: {
    type: Number,
    default: 0,
  },
  isReported: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the Prompt model
module.exports = mongoose.model('Prompt', promptSchema);