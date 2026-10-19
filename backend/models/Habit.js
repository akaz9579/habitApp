const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    icon: {
        type: String,
        default: 'check-circle' // key into the frontend icon registry
    },
    color: {
        type: String,
        default: 'sage' // palette id, or a custom hex value
    },
    frequency: {
        type: {
            type: String,
            enum: ['daily', 'weekly'],
            default: 'daily'
        },
        value: {
            type: Number,
            default: 1
        }
    },
    completions: [{
        type: String // ISO Date string (YYYY-MM-DD) for easier matching
    }],
    order: {
        type: Number // position in the list, lowest first
    },
    archived: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Habit', habitSchema);
