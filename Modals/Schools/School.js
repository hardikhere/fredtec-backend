const { BoardTypes, ClassificationTypes, SchoolTypes } = require("../../utils/constants");
const FeeSchema = require("./FeeSchema");
const { OtherInfoSchema } = require("./OtherInfoSchema");
const mongoose = require("mongoose");
const InfraSchema = require("./InfraSchema");
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

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subjects: [String],
    highestQualification: String,
    image: String,
    about: String
})


const SchoolSchema = new mongoose.Schema({
    schoolName: {
        type: String,
        maxlength: 40,
        required: true
    },
    isAdmissionOpen: {
        type: Boolean
    },
    admin: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "SchoolAdmins"
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
    subjects: [String],
    infraDetails: InfraSchema,
    otherInfo: OtherInfoSchema,
    queries: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Query"
    }],
    reviews: [ReviewSchema],
    announcements: [announcementsSchema],
    pinCode: {
        type: String
    },
    longitude: {
        type: mongoose.SchemaTypes.Decimal128
    },
    latitude: {
        type: mongoose.SchemaTypes.Decimal128
    },
    teachers: [teacherSchema]

}, { timestamps: true });

SchoolSchema.index({ schoolName: 'text', address: 'text', 'reviews.content': "text", about: "text" })


const School = mongoose.model("School", SchoolSchema);
module.exports = School;
