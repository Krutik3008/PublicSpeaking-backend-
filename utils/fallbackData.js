// In-memory data fallback when database is not available
const scenarios = [
    {
        _id: '1',
        title: 'Overcharged at Store or Restaurant',
        description: 'You notice the bill is higher than expected, or you were charged for something you did not order or receive.',
        category: 'billing',
        difficulty: 'easy',
        emotionalContext: 'Fear of being seen as cheap or making a scene over money. Worry about embarrassing yourself or the staff.',
        examples: ['Wrong price on bill', 'Double charged', 'Hidden fees added', 'Wrong item on receipt'],
        icon: '💳',
        suggestedScripts: []
    },
    {
        _id: '2',
        title: 'Someone Cutting in Line',
        description: 'Someone pushes ahead of you or others in a queue, ignoring those who have been waiting.',
        category: 'unfair-treatment',
        difficulty: 'medium',
        emotionalContext: 'Fear of confrontation. Worry about being seen as petty. Uncertainty about whether it was intentional.',
        examples: ['At checkout counter', 'At ticket booth', 'In waiting rooms', 'At food counters'],
        icon: '🚶',
        suggestedScripts: []
    },
    {
        _id: '3',
        title: 'Wrong Information Being Given',
        description: 'You hear incorrect information being shared publicly that could mislead others.',
        category: 'misinformation',
        difficulty: 'medium',
        emotionalContext: 'Fear of seeming like a know-it-all. Worry about being wrong yourself. Hesitation to correct authority figures.',
        examples: ['Wrong directions', 'Incorrect announcements', 'Misleading instructions', 'False safety information'],
        icon: '📢',
        suggestedScripts: []
    },
    {
        _id: '4',
        title: 'Unsafe Situation in Public',
        description: 'You notice a safety hazard or dangerous situation that could harm someone.',
        category: 'safety',
        difficulty: 'easy',
        emotionalContext: 'Fear of overreacting. Worry about being ignored or dismissed. Uncertainty about your own judgment.',
        examples: ['Wet floor without sign', 'Blocked emergency exit', 'Unsafe construction', 'Fire hazard'],
        icon: '⚠️',
        suggestedScripts: []
    },
    {
        _id: '5',
        title: 'Poor Customer Service',
        description: 'You are receiving inadequate service that does not meet reasonable expectations.',
        category: 'service',
        difficulty: 'medium',
        emotionalContext: 'Fear of being labeled as difficult customer. Worry about retaliation. Discomfort with asserting your needs.',
        examples: ['Being ignored', 'Long unexplained delays', 'Rude treatment', 'Unfulfilled promises'],
        icon: '🛎️',
        suggestedScripts: []
    },
    {
        _id: '6',
        title: 'Witnessing Unfair Treatment',
        description: 'You see someone else being treated unfairly or disrespectfully.',
        category: 'unfair-treatment',
        difficulty: 'challenging',
        emotionalContext: 'Fear of getting involved in someone else\'s situation. Worry about making things worse. Uncertainty about your role.',
        examples: ['Discrimination', 'Bullying behavior', 'Unfair denial of service', 'Verbal abuse of others'],
        icon: '⚖️',
        suggestedScripts: []
    }
];

const tips = [
    { _id: '1', category: 'general', content: 'Remember: Speaking up is a skill. The more you practice, the easier it becomes. Start with small situations.', likes: 0, likedBy: [], isApproved: true },
    { _id: '2', category: 'general', content: 'You are not making trouble - you are preventing problems. The real trouble is silence when something is wrong.', likes: 0, likedBy: [], isApproved: true },
    { _id: '3', category: 'general', content: 'Most people actually respect those who speak up calmly. Silence is often mistaken for approval.', likes: 0, likedBy: [], isApproved: true },
    { _id: '4', category: 'body-language', content: 'Keep your shoulders back and chin up. Confident posture makes confident words come easier.', likes: 0, likedBy: [], isApproved: true },
    { _id: '5', category: 'body-language', content: 'Make eye contact but keep it friendly - think of talking to a friend, not staring down an opponent.', likes: 0, likedBy: [], isApproved: true },
    { _id: '6', category: 'tone', content: 'Speak slightly slower than you normally would. This conveys confidence and gives you time to think.', likes: 0, likedBy: [], isApproved: true },
    { _id: '7', category: 'tone', content: 'Use "I noticed" instead of "You did" - it focuses on the situation, not blame.', likes: 0, likedBy: [], isApproved: true },
    { _id: '8', category: 'mindset', content: 'You are not being difficult - you are being honest. There is a big difference.', likes: 0, likedBy: [], isApproved: true },
    { _id: '9', category: 'preparation', content: 'Have a go-to opening phrase ready: "Excuse me, I noticed..." works in almost any situation.', likes: 0, likedBy: [], isApproved: true }
];

const stories = [
    {
        _id: '1',
        situation: 'Restaurant overcharged me $20',
        whatISaid: 'Excuse me, I noticed this charge is incorrect.',
        outcome: 'They fixed it immediately!',
        feeling: 'proud',
        category: 'billing',
        likes: 0,
        likedBy: [],
        isApproved: true
    },
    {
        _id: '2',
        situation: 'Colleague kept interrupting me',
        whatISaid: 'Can I finish my thought please?',
        outcome: 'He apologized and let me speak.',
        feeling: 'empowered',
        category: 'general',
        likes: 0,
        likedBy: [],
        isApproved: true
    },
    {
        _id: '3',
        situation: 'Gym charged me after cancellation',
        whatISaid: 'Per my contract, I cancelled last month.',
        outcome: 'Refund processed in 2 days.',
        feeling: 'relieved',
        category: 'billing',
        likes: 0,
        likedBy: [],
        isApproved: true
    }
];

const scripts = [
    {
        _id: '1',
        scenario: '1',
        title: 'Calm Approach',
        openingLine: 'Excuse me, I noticed there might be an error on my bill.',
        bodyScript: 'I wanted to bring this to your attention because I believe there may be a discrepancy. Could you help me understand this charge?',
        closingLine: 'I appreciate your understanding. Thank you for your help.',
        tone: 'calm',
        tips: ['Take a deep breath before speaking', 'Focus on the issue, not the person'],
        doNot: ['Do not raise your voice', 'Do not make personal accusations'],
        bodyLanguageTips: ['Maintain friendly eye contact', 'Keep your posture open and relaxed']
    }
];

const phrases = [
    { _id: '1', text: 'Excuse me, I noticed...', category: 'opening', situation: 'general' },
    { _id: '2', text: 'I need to bring something to your attention', category: 'opening', situation: 'serious' },
    { _id: '3', text: 'Could you help me understand...', category: 'questioning', situation: 'billing' },
    { _id: '4', text: 'I appreciate your help with this', category: 'closing', situation: 'general' }
];

const affirmations = [
    { _id: '1', text: 'My voice matters and deserves to be heard', category: 'confidence' },
    { _id: '2', text: 'I can speak up calmly and respectfully', category: 'communication' },
    { _id: '3', text: 'I am not being difficult, I am being honest', category: 'mindset' },
    { _id: '4', text: 'Speaking up prevents bigger problems', category: 'purpose' }
];

module.exports = {
    scenarios,
    tips,
    stories,
    scripts,
    phrases,
    affirmations
};