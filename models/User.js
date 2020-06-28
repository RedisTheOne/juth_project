const mongoose = require('mongoose');

const schema = mongoose.Schema({
    user: {
        type: String,
        required: true
    }
});

const model = mongoose.model('User', schema);
module.exports = model;