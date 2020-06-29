const mongoose = require('mongoose');

const schema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    friendRequests: {
        type: Array,
        required: true
    },
    friends: {
        type: Array,
        required: true
    }
});

const model = mongoose.model('Friend', schema);
module.exports = model;