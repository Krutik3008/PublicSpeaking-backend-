const mongoose = require('mongoose');

const practiceScriptSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please add script text'],
        trim: true
    },
    category: {
        type: String,
        default: 'general'
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PracticeScript', practiceScriptSchema);
