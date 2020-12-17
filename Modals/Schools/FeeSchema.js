const mongoose = require("mongoose");

export const FeeSchema = new mongoose.Schema({
    anualFee: Number,
    admissionFee: Number,
    applicationFee: Number,
    securityFee: Number
})