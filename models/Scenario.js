const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['billing', 'safety', 'unfair-treatment', 'misinformation', 'service', 'general']
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'challenging'],
        default: 'medium'
    },
    emotionalContext: {
        type: String,
        required: true,
        maxlength: [300, 'Emotional context cannot be more than 300 characters']
    },
    examples: [{
        type: String
    }],
    icon: {
        type: String,
        default: '💬'
    },
    suggestedScripts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ConfidenceScript'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add text index for search
scenarioSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Scenario', scenarioSchema);
