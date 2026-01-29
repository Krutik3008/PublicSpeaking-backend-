const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['general', 'body-language', 'tone', 'timing', 'mindset', 'preparation']
    },
    content: {
        type: String,
        required: [true, 'Please add content'],
        maxlength: [500, 'Content cannot be more than 500 characters']
    },
    likes: {
        type: Number,
        default: 0
    },
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

module.exports = mongoose.model('Tip', tipSchema);
