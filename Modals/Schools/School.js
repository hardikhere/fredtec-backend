import { ContactSchema } from "./ContactSchema";
import { FeeSchema } from "./FeeSchema";

const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema({
    schoolName: {
        type: String,
        maxlength: 40,
        required: true
    },
    schoolId: {
        type: ID,
        unique: true,
        required: true
    },
    schoolType: String,//make enum
    board: String, //make enum
    classification: String, //make enum
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
    subjects: [String]
});

export default new mongoose.model("School", SchoolSchema);