const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Phrase = require('../models/Phrase');
const Affirmation = require('../models/Affirmation');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for seeding tools...');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const phrases = [
    { category: 'opening', text: 'Excuse me, I noticed...', icon: 'MessageSquare' },
    { category: 'opening', text: 'I need to bring something to your attention', icon: 'Rocket' },
    { category: 'questioning', text: 'Could you help me understand...', icon: 'Users' },
    { category: 'closing', text: 'I appreciate your help with this', icon: 'CheckCircle' }
];

const affirmations = [
    { text: 'My voice matters and deserves to be heard', icon: 'Sparkles' },
    { text: 'I can speak up calmly and respectfully', icon: 'Mic' },
    { text: 'I am not being difficult, I am being honest', icon: 'Users' },
    { text: 'Speaking up prevents bigger problems', icon: 'Wind' }
];

const seedTools = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Phrase.deleteMany({});
        await Affirmation.deleteMany({});

        console.log('Cleared existing tools data...');

        // Insert phrases
        await Phrase.insertMany(phrases);
        console.log(`Created ${phrases.length} phrases`);

        // Insert affirmations
        await Affirmation.insertMany(affirmations);
        console.log(`Created ${affirmations.length} affirmations`);

        console.log('\n✅ Tools data seeded successfully!\n');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding tools data:', error);
        process.exit(1);
    }
};

seedTools();