const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Phrase = require('../models/Phrase');
const Affirmation = require('../models/Affirmation');
const PracticeScript = require('../models/PracticeScript');
const connectDB = require('../config/db');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const phraseData = [
    { category: 'Opening Lines', icon: 'Rocket', text: 'Excuse me, I noticed something...' },
    { category: 'Opening Lines', icon: 'Rocket', text: 'Hi, I hope you can help me with...' },
    { category: 'Opening Lines', icon: 'Rocket', text: 'I wanted to bring something to your attention...' },
    { category: 'Opening Lines', icon: 'Rocket', text: 'Sorry to interrupt, but I need to mention...' },
    { category: 'Opening Lines', icon: 'Rocket', text: 'Could I ask about something I observed?' },
    { category: 'Expressing the Issue', icon: 'MessageSquare', text: 'I believe there might be an error here...' },
    { category: 'Expressing the Issue', icon: 'MessageSquare', text: "This doesn't seem quite right to me..." },
    { category: 'Expressing the Issue', icon: 'MessageSquare', text: 'I think there may be a misunderstanding...' },
    { category: 'Expressing the Issue', icon: 'MessageSquare', text: 'I noticed that [X] but expected [Y]...' },
    { category: 'Expressing the Issue', icon: 'MessageSquare', text: "I'm concerned about..." },
    { category: 'Staying Polite', icon: 'Users', text: 'I appreciate your help with this.' },
    { category: 'Staying Polite', icon: 'Users', text: "I understand you're doing your best." },
    { category: 'Staying Polite', icon: 'Users', text: "I'm sure it's just an oversight." },
    { category: 'Staying Polite', icon: 'Users', text: 'Thank you for taking the time to look at this.' },
    { category: 'Staying Polite', icon: 'Users', text: "I know this isn't your fault, but..." },
    { category: 'Requesting Action', icon: 'CheckCircle', text: 'Could you please check on that?' },
    { category: 'Requesting Action', icon: 'CheckCircle', text: 'Would you mind looking into this?' },
    { category: 'Requesting Action', icon: 'CheckCircle', text: "I'd appreciate it if you could..." },
    { category: 'Requesting Action', icon: 'CheckCircle', text: 'What can we do to resolve this?' },
    { category: 'Requesting Action', icon: 'CheckCircle', text: 'Who would be the right person to help with this?' },
];

const affirmationData = [
    { text: "You have the right to speak up", icon: 'Zap' },
    { text: "Your voice matters", icon: 'Mic' },
    { text: "Speaking up helps everyone", icon: 'Users' },
    { text: "You are not being difficult, you are being honest", icon: 'Sparkles' },
    { text: "Calm and clear wins every time", icon: 'Wind' },
    { text: "The truth deserves to be heard", icon: 'Megaphone' },
    { text: "You've got this!", icon: 'Rocket' },
    { text: "Confidence is a skill, and you're building it", icon: 'Wrench' },
    { text: "Every time you speak up, it gets easier", icon: 'TrendingUp' },
    { text: "You are braver than you believe", icon: 'Award' }
];

const scriptData = [
    { text: "Excuse me, I noticed that my bill seems incorrect. I was charged for an item I didn't order. Could you please take a look?" },
    { text: "Hi there, I've been waiting in line for a while now, and I believe I was next. Would you mind checking?" },
    { text: "I wanted to mention that the information on that sign appears to be outdated. It might confuse other customers." },
    { text: "Excuse me, I noticed what looks like a safety hazard over there. I thought someone should know about it." }
];

const seedTools = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Phrase.deleteMany();
        await Affirmation.deleteMany();
        await PracticeScript.deleteMany();

        console.log('Data destroyed...');

        // Insert new data
        await Phrase.insertMany(phraseData);
        await Affirmation.insertMany(affirmationData);
        await PracticeScript.insertMany(scriptData);

        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedTools();
