const mongoose = require('mongoose');

const affirmationSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please add affirmation text'],
        trim: true
    },
    icon: {
        type: String, // Storing icon name string
        required: true,
        default: 'Sparkles'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Affirmation', affirmationSchema);
