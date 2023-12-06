const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    infrastructure: Number,
    academics: Number,
    facilities: Number,
    sports: Number,
    faculty: Number,
    safety: Number,
    by: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        maxlength: 1000
    }
}, { timestamps: true });


module.exports = ReviewSchema;