const mongoose = require("mongoose");

export const ContactSchema = new mongoose.Schema({
    email: {
        type: String
    },
    phoneNumber: String,
    website: String,
    address: String
})