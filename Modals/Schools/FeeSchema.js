const mongoose = require("mongoose");

const FeeSchema = new mongoose.Schema({
    annualFeeFrom: Number,
    annualFeeTo: Number,
    admissionFee: Number,
    applicationFee: Number,
    securityFee: Number
});

module.exports = FeeSchema;