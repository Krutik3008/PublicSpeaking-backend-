const mongoose = require('mongoose');

const confidenceScriptSchema = new mongoose.Schema({
    scenario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scenario',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    openingLine: {
        type: String,
        required: [true, 'Please add an opening line'],
        maxlength: [200, 'Opening line cannot be more than 200 characters']
    },
    bodyScript: {
        type: String,
        required: [true, 'Please add a body script'],
        maxlength: [1000, 'Body script cannot be more than 1000 characters']
    },
    closingLine: {
        type: String,
        required: [true, 'Please add a closing line'],
        maxlength: [200, 'Closing line cannot be more than 200 characters']
    },
    tone: {
        type: String,
        enum: ['calm', 'assertive', 'friendly', 'firm'],
        default: 'calm'
    },
    tips: [{
        type: String
    }],
    doNot: [{
        type: String
    }],
    bodyLanguageTips: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ConfidenceScript', confidenceScriptSchema);
