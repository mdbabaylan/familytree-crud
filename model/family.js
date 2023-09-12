const mongoose = require('mongoose');

// date || user_id || weight log (in lbs)

const dataSchema = new mongoose.Schema({
    birthday: {
        required: true,
        type: Date
    },
    first_name: {
        required: true,
        type: String
    },
    middle_name: {
        required: true,
        type: String
    },
    last_name: {
        required: true,
        type: String
    },
    gender: {
        required: true,
        type: String
    },
    mother: {
        required: true,
        type: String
    },
    father: {
        required: true,
        type: String
    },
})

module.exports = mongoose.model('family', dataSchema)