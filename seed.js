// seed.js
const mongoose = require('mongoose');
const User = require('./models/User');
const Prompt = require('./models/Prompt');
const Report = require('./models/Report');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await User.deleteMany({});
    await Prompt.deleteMany({});
    await Report.deleteMany({});

    // Create users
    const user1 = await User.create({
      email: 'user1@example.com',
      password: 'password123',
      role: 'user',
    });

    const user2 = await User.create({
      email: 'user2@example.com',
      password: 'password123',
      role: 'user',
    });

    const adminUser = await User.create({
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    // Create prompts
    const prompt1 = await Prompt.create({
      userId: user1._id,
      title: 'Design Principles',
      description: 'A guide to understanding design principles for beginners.',
      tags: ['design', 'ui', 'ux'],
      category: 'design',
    });

    const prompt2 = await Prompt.create({
      userId: user2._id,
      title: 'JavaScript Basics',
      description: 'Learn the fundamentals of JavaScript programming.',
      tags: ['coding', 'javascript', 'web-development'],
      category: 'coding',
    });

    const prompt3 = await Prompt.create({
      userId: adminUser._id,
      title: 'Animation Techniques',
      description: 'Explore advanced animation techniques using CSS and JavaScript.',
      tags: ['animation', 'motion', 'css'],
      category: 'animation',
    });

    const prompt4 = await Prompt.create({
      userId: user1._id,
      title: 'Creative Writing Tips',
      description: 'Tips for improving your creative writing skills.',
      tags: ['writing', 'creativity', 'storytelling'],
      category: 'writing',
    });

    const prompt5 = await Prompt.create({
      userId: user2._id,
      title: 'React Hooks',
      description: 'Learn how to use React Hooks effectively in your projects.',
      tags: ['coding', 'react', 'frontend'],
      category: 'coding',
    });

    // Create reports
    await Report.create({
      promptId: prompt1._id,
      reportedBy: user2._id,
      reason: 'Inappropriate content in the description.',
    });

    await Report.create({
      promptId: prompt3._id,
      reportedBy: user1._id,
      reason: 'Spammy tags and irrelevant content.',
    });

    console.log('Database seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedDatabase();