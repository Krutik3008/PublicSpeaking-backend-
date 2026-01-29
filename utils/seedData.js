const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Scenario = require('../models/Scenario');
const ConfidenceScript = require('../models/ConfidenceScript');
const Tip = require('../models/Tip');
const SuccessStory = require('../models/SuccessStory');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for seeding...');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Sample Scenarios
const scenarios = [
    {
        title: 'Overcharged at Store or Restaurant',
        description: 'You notice the bill is higher than expected, or you were charged for something you did not order or receive.',
        category: 'billing',
        difficulty: 'easy',
        emotionalContext: 'Fear of being seen as cheap or making a scene over money. Worry about embarrassing yourself or the staff.',
        examples: ['Wrong price on bill', 'Double charged', 'Hidden fees added', 'Wrong item on receipt'],
        icon: '💳'
    },
    {
        title: 'Someone Cutting in Line',
        description: 'Someone pushes ahead of you or others in a queue, ignoring those who have been waiting.',
        category: 'unfair-treatment',
        difficulty: 'medium',
        emotionalContext: 'Fear of confrontation. Worry about being seen as petty. Uncertainty about whether it was intentional.',
        examples: ['At checkout counter', 'At ticket booth', 'In waiting rooms', 'At food counters'],
        icon: '🚶'
    },
    {
        title: 'Wrong Information Being Given',
        description: 'You hear incorrect information being shared publicly that could mislead others.',
        category: 'misinformation',
        difficulty: 'medium',
        emotionalContext: 'Fear of seeming like a know-it-all. Worry about being wrong yourself. Hesitation to correct authority figures.',
        examples: ['Wrong directions', 'Incorrect announcements', 'Misleading instructions', 'False safety information'],
        icon: '📢'
    },
    {
        title: 'Unsafe Situation in Public',
        description: 'You notice a safety hazard or dangerous situation that could harm someone.',
        category: 'safety',
        difficulty: 'easy',
        emotionalContext: 'Fear of overreacting. Worry about being ignored or dismissed. Uncertainty about your own judgment.',
        examples: ['Wet floor without sign', 'Blocked emergency exit', 'Unsafe construction', 'Fire hazard'],
        icon: '⚠️'
    },
    {
        title: 'Poor Customer Service',
        description: 'You are receiving inadequate service that does not meet reasonable expectations.',
        category: 'service',
        difficulty: 'medium',
        emotionalContext: 'Fear of being labeled as difficult customer. Worry about retaliation. Discomfort with asserting your needs.',
        examples: ['Being ignored', 'Long unexplained delays', 'Rude treatment', 'Unfulfilled promises'],
        icon: '🛎️'
    },
    {
        title: 'Witnessing Unfair Treatment',
        description: 'You see someone else being treated unfairly or disrespectfully.',
        category: 'unfair-treatment',
        difficulty: 'challenging',
        emotionalContext: 'Fear of getting involved in someone else\'s situation. Worry about making things worse. Uncertainty about your role.',
        examples: ['Discrimination', 'Bullying behavior', 'Unfair denial of service', 'Verbal abuse of others'],
        icon: '⚖️'
    }
];

// Sample Tips
const tips = [
    { category: 'general', content: 'Remember: Speaking up is a skill. The more you practice, the easier it becomes. Start with small situations.', likes: 45 },
    { category: 'general', content: 'You are not making trouble - you are preventing problems. The real trouble is silence when something is wrong.', likes: 67 },
    { category: 'general', content: 'Most people actually respect those who speak up calmly. Silence is often mistaken for approval.', likes: 52 },
    { category: 'body-language', content: 'Keep your shoulders back and chin up. Confident posture makes confident words come easier.', likes: 38 },
    { category: 'body-language', content: 'Make eye contact but keep it friendly - think of talking to a friend, not staring down an opponent.', likes: 41 },
    { category: 'body-language', content: 'Uncross your arms. Open body language signals that you want resolution, not confrontation.', likes: 29 },
    { category: 'tone', content: 'Speak slightly slower than you normally would. This conveys confidence and gives you time to think.', likes: 56 },
    { category: 'tone', content: 'Use "I noticed" instead of "You did" - it focuses on the situation, not blame.', likes: 73 },
    { category: 'tone', content: 'End statements with a slight downward inflection. Upward inflections can sound uncertain.', likes: 34 },
    { category: 'timing', content: 'Address issues as soon as you notice them - waiting only builds anxiety and makes it harder.', likes: 48 },
    { category: 'timing', content: 'If emotions are high, take 3 deep breaths before speaking. Those 10 seconds can change everything.', likes: 61 },
    { category: 'mindset', content: 'You are not being difficult - you are being honest. There is a big difference.', likes: 82 },
    { category: 'mindset', content: 'Ask yourself: "Will I regret staying silent?" If yes, that is your sign to speak up.', likes: 79 },
    { category: 'mindset', content: 'The person who made the mistake would usually prefer to know so they can fix it.', likes: 44 },
    { category: 'preparation', content: 'Have a go-to opening phrase ready: "Excuse me, I noticed..." works in almost any situation.', likes: 91 },
    { category: 'preparation', content: 'Practice in front of a mirror. Seeing yourself speak confidently builds actual confidence.', likes: 37 }
];

// Sample Success Stories
const stories = [
    {
        situation: 'Restaurant overcharged me $20',
        whatISaid: 'Excuse me, I noticed this charge is incorrect.',
        outcome: 'They fixed it immediately!',
        feeling: 'proud',
        category: 'billing',
        likes: 24,
        isApproved: true
    },
    {
        situation: 'Colleague kept interrupting me',
        whatISaid: 'Can I finish my thought please?',
        outcome: 'He apologized and let me speak.',
        feeling: 'empowered',
        category: 'general',
        likes: 18,
        isApproved: true
    },
    {
        situation: 'Gym charged me after cancellation',
        whatISaid: 'Per my contract, I cancelled last month.',
        outcome: 'Refund processed in 2 days.',
        feeling: 'relieved',
        category: 'billing',
        likes: 42,
        isApproved: true
    },
    {
        situation: 'Was given wrong directions by staff',
        whatISaid: 'I believe the correct way is actually left, based on the map.',
        outcome: 'They double checked and realized I was right.',
        feeling: 'confident',
        category: 'misinformation',
        likes: 15,
        isApproved: true
    },
    {
        situation: 'Witnessed unfair treatment of another customer',
        whatISaid: 'I think we should let them finish explaining.',
        outcome: 'The situation de-escalated and everyone was heard.',
        feeling: 'nervous-but-glad',
        category: 'unfair-treatment',
        likes: 56,
        isApproved: true
    }
];

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Scenario.deleteMany({});
        await ConfidenceScript.deleteMany({});
        await Tip.deleteMany({});

        console.log('Cleared existing data...');

        // Insert scenarios
        const createdScenarios = await Scenario.insertMany(scenarios);
        console.log(`Created ${createdScenarios.length} scenarios`);

        // Create scripts for each scenario
        const scriptTemplates = [
            { tone: 'calm', prefix: 'Excuse me, I noticed' },
            { tone: 'assertive', prefix: 'I need to bring something to your attention' },
            { tone: 'friendly', prefix: 'Hi! I hope you can help me with something' }
        ];

        for (const scenario of createdScenarios) {
            const scripts = scriptTemplates.map((template, index) => ({
                scenario: scenario._id,
                title: `${template.tone.charAt(0).toUpperCase() + template.tone.slice(1)} Approach`,
                openingLine: `${template.prefix}: ${scenario.title.toLowerCase()}.`,
                bodyScript: `I wanted to bring this to your attention because ${scenario.emotionalContext.split('.')[0].toLowerCase()}. I believe addressing this would help everyone involved.`,
                closingLine: template.tone === 'calm'
                    ? 'I appreciate your understanding. Thank you for your help.'
                    : template.tone === 'assertive'
                        ? 'I would appreciate your immediate attention to this matter.'
                        : 'Thanks so much for looking into this! I really appreciate it.',
                tone: template.tone,
                tips: [
                    'Take a deep breath before speaking',
                    'Focus on the issue, not the person',
                    'Be specific about what you observed'
                ],
                doNot: [
                    'Do not raise your voice',
                    'Do not make personal accusations',
                    'Do not assume the worst intentions'
                ],
                bodyLanguageTips: [
                    'Maintain friendly eye contact',
                    'Keep your posture open and relaxed',
                    'Use calm hand gestures'
                ]
            }));

            const createdScripts = await ConfidenceScript.insertMany(scripts);

            // Update scenario with script references
            await Scenario.findByIdAndUpdate(scenario._id, {
                suggestedScripts: createdScripts.map(s => s._id)
            });
        }

        console.log('Created scripts for all scenarios');

        // Insert tips
        await Tip.insertMany(tips);
        console.log(`Created ${tips.length} tips`);

        // Insert stories
        await SuccessStory.insertMany(stories);
        console.log(`Created ${stories.length} success stories`);

        console.log('\n✅ Database seeded successfully!\n');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
