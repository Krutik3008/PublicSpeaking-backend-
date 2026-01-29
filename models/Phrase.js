const mongoose = require('mongoose');

const phraseSchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, 'Please add a category'],
        trim: true
    },
    icon: {
        type: String, // Storing icon name string (e.g. 'Rocket')
        required: true,
        default: 'MessageSquare'
    },
    text: {
        type: String,
        required: [true, 'Please add phrase text'],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Phrase', phraseSchema);
