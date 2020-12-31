const mongoose = require("mongoose");

const OtherInfoSchema = new mongoose.Schema({
    entryAge: Number,
    numberOfStudents: Number,
    languagesUsed: [String],
    stRatio: {
        type: String,
        maxlength: 6
    },
    ac: Boolean,
    gradeFrom: Number,
    gradeTo: Number,
    outdoorSports: [String],
    indoorSports: [String],
    clubs: [String],
    arts: [String]
});

const travelSchema = new mongoose.Schema({
    nearestAirport: {
        Name: String,
        distance: Number
    },
    nearestRailway: {
        Name: String,
        distance: Number
    }
})
module.exports = { OtherInfoSchema, travelSchema };