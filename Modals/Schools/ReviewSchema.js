const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    kind: {
        type: String,
        enum: ["user", "fredmat"],
        required: true
    },
    infrastructure: Number,
    academics: Number,
    facilities: Number,
    sports: Number,
    faculty: Number,
    safety: Number,
    by: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    }
}, { timestamps: true });


module.exports = ReviewSchema;