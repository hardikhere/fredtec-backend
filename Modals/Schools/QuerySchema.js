const mongoose = require("mongoose");

const QuerySchema = new mongoose.Schema({
    userId: { //optional user can query without login
        type: String,
        ref: "Users"
    },
    parentName: {
        type: String,
        maxlength: 30,
        required: true
    },
    mobileNumber: {
        type: String,
        maxlength: 12,
        required: true
    },
    address: {
        type: String
    },
    childName: {
        type: String
    },
    remarks: {
        type: String
    },
    grade: {// need to improve
        type: String
    },
    academicRecords: [String],// image urls (aws s3)
    hasContacted: {
        type: Boolean,
        default: false
    },
    readed: {
        type: Boolean,
        default: false
    },
    isUnlocked: {
        type: Boolean,
        default: false
    },
    creditsRequired: {
        type: Number,
        default: 100
    }
}, { timestamps: true });

module.exports = QuerySchema;