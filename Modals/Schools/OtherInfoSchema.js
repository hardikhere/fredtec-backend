const mongoose = require("mongoose");

const OtherInfoSchema = new mongoose.Schema({
    entryAge: Number,
    numberOfStudents: Number,
    numberOfTeachers: Number,
    languagesUsed: [String],
    medium: String,//make it enum
    stRatio: {
        type: String,
        maxlength: 6
    },
    ac: Boolean,
    gradeFrom: Number,
    gradeTo: Number,
    outdoorSports: [String],
    indoorSports: [String],
    activities: [String],
    hasPlayground: Boolean
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