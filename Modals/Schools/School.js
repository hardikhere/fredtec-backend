const { BoardTypes, ClassificationTypes, SchoolTypes } = require("../../utils/constants");
const ContactSchema = require("./ContactSchema");
const FeeSchema = require("./FeeSchema");
const { OtherInfoSchema, travelSchema } = require("./OtherInfoSchema");
const mongoose = require("mongoose");
const InfraSchema = require("./InfraSchema");
const QuerySchema = require("./QuerySchema");
const { PRE_COLLEGE, DAY, BOARDING, PLAY } = SchoolTypes;
const { CBSE, ICGSE, ICSE, RBSE } = BoardTypes;
const { BOYS, GIRLS, COED } = ClassificationTypes

const SchoolSchema = new mongoose.Schema({
    schoolName: {
        type: String,
        maxlength: 40,
        required: true
    },
    schoolId: {
        type: String,
        unique: true,
        required: true
    },
    schoolType: {
        type: String,
        enum: [DAY, PRE_COLLEGE, PLAY, BOARDING],
        default: DAY
    },
    board: {
        type: String,
        enum: [CBSE, ICGSE, ICSE, RBSE],
        default: CBSE
    },
    classification: {
        type: String,
        enum: [BOYS, GIRLS, COED],
        default: COED
    },
    fees: FeeSchema,
    isPrivate: {
        type: Boolean
    },
    yearOfEstablishment: {
        type: Number
    },
    contactDetails: ContactSchema,
    about: {
        type: String,
        minlength: 10
    },
    imageUrls: [{
        type: String
    }],
    parentRating: Number,
    fredtecScore: Number,
    subjects: [String],
    infraDetails: InfraSchema,
    otherInfo: OtherInfoSchema,
    travelInfo: travelSchema,
    queries: [QuerySchema]

}, { timestamps: true });

const School = mongoose.model("School", SchoolSchema);
module.exports = School;
