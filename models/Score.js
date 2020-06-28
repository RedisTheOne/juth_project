const mongoose = require('mongoose');

const schema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now 
    }
});

const model = mongoose.model('Score', schema);
module.exports = model;