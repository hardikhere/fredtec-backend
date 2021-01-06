import {
    School
} from "./School.js";

const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: "User"
    },
    schoolCredential: {
        type: SchoolID,
        ref: "School",
        unique: true,
        required: true
    },
    authorName: {
        type: String,
        ref: "User"
        maxlength: 50,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        minimum: 0,
        maximum: 5,
        required: true
    },
    contentHead: { //heading of review
        type: String,
        maxlength: 30,
        required: true
    },
    contentBody: { //main content of review 
        type: String,
        maxlength: 300,
        required: true
    },
    date: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

module.exports = ReviewSchema;