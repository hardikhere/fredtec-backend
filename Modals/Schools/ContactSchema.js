const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    email: {
        type: String
    },
    phoneNumber: String,
    website: String,
    address: String
});

module.exports = ContactSchema;