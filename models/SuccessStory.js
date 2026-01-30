const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
    situation: {
        type: String,
        required: [true, 'Please describe the situation'],
        maxlength: [200, 'Situation cannot be more than 200 characters']
    },
    whatISaid: {
        type: String,
        required: [true, 'Please share what you said'],
        maxlength: [500, 'What you said cannot be more than 500 characters']
    },
    outcome: {
        type: String,
        required: [true, 'Please share the outcome'],
        maxlength: [300, 'Outcome cannot be more than 300 characters']
    },
    feeling: {
        type: String,
        enum: ['proud', 'relieved', 'empowered', 'nervous-but-glad', 'confident'],
        default: 'proud'
    },
    category: {
        type: String,
        enum: ['billing', 'safety', 'unfair-treatment', 'misinformation', 'service', 'general'],
        default: 'general'
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isAnonymous: {
        type: Boolean,
        default: true
    },
    isApproved: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SuccessStory', successStorySchema);
