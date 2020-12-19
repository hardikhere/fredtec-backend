const mongoose = require("mongoose");

const FeeSchema = new mongoose.Schema({
    anualFee: Number,
    admissionFee: Number,
    applicationFee: Number,
    securityFee: Number
});

module.exports = FeeSchema;