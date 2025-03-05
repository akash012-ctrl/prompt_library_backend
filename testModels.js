// testModels.js
const mongoose = require('mongoose');
const User = require('./models/User');
const Prompt = require('./models/Prompt');
const Report = require('./models/Report');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    ssl: true,
    tlsAllowInvalidCertificates: true, // Only for testing
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Insert dummy data
const testModels = async () => {
    try {
        // Create a user
        const user = await User.create({
            email: 'test@example.com',
            password: 'password123', // In production, hash this password!
            role: 'user',
        });

        // Create a prompt
        const prompt = await Prompt.create({
            userId: user._id,
            title: 'Test Prompt',
            description: 'This is a test prompt.',
            tags: ['test', 'example'],
            category: 'general',
        });

        // Create a report
        const report = await Report.create({
            promptId: prompt._id,
            reportedBy: user._id,
            reason: 'Offensive content',
        });

        console.log('Dummy data inserted successfully:', { user, prompt, report });
    } catch (error) {
        console.error('Error inserting dummy data:', error);
    } finally {
        mongoose.connection.close();
    }
};

testModels();