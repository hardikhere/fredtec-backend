const mongoose = require("mongoose");

const FeeSchema = new mongoose.Schema({
    annualFee: Number,
    admissionFee: Number,
    applicationFee: Number,
    securityFee: Number
});

module.exports = FeeSchema;