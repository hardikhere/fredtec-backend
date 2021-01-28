const mongoose = require("mongoose");

const OtherInfoSchema = new mongoose.Schema({
    entryAge: Number,
    numberOfStudents: {
        type: String,
        enum: ["1-100", "100-500", "500-1000", "1000-5000", "5000+"]
    },
    numberOfTeachers: Number,
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
    arts: [String],
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