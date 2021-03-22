const { BoardTypes, ClassificationTypes, SchoolTypes } = require("../../utils/constants");
const ContactSchema = require("./ContactSchema");
const FeeSchema = require("./FeeSchema");
const { OtherInfoSchema, travelSchema } = require("./OtherInfoSchema");
const mongoose = require("mongoose");
const InfraSchema = require("./InfraSchema");
const QuerySchema = require("./QuerySchema");
const ReviewSchema = require("./ReviewSchema");
const { PRE_COLLEGE, DAY, BOARDING, PLAY } = SchoolTypes;
const { CBSE, ICGSE, ICSE, RBSE } = BoardTypes;
const { BOYS, GIRLS, COED } = ClassificationTypes

const announcementsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrls: [String],
    hasExpired: Boolean,
    grade: String,
    announcedBy: String
}, { timestamps: true });

const SchoolSchema = new mongoose.Schema({
    schoolName: {
        type: String,
        maxlength: 40,
        required: true
    },
    admin: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    email: {
        type: String,
        maxlength: 90
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
    phoneNumber: String,
    website: String,
    address: String,
    about: {
        type: String,
        minlength: 10
    },
    imageUrls: [{
        type: String
    }],
    logoUrl: String,
    parentRating: Number,
    fredmatScore: Number,
    subjects: [String],
    infraDetails: InfraSchema,
    otherInfo: OtherInfoSchema,
    travelInfo: travelSchema,
    queries: [QuerySchema],
    reviews: [ReviewSchema],
    credits: {
        type: Number,
    },
    announcements: [announcementsSchema]

}, { timestamps: true });

const School = mongoose.model("School", SchoolSchema);
module.exports = School;
