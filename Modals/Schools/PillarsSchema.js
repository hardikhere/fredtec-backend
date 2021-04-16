const mongoose = require("mongoose");

const PillarsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
});

module.exports = PillarsSchema;