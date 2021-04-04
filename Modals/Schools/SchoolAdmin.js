const mongoose = require("mongoose");

const schoolAdminSchema = new mongoose.Schema({
    email: {
        type: String,
        maxlength: 50,
        required: true
    },
    mobileNumber: {
        type: String,
        maxlength: 12
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    userName: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    schoolId: {
        type: String
    }

}, { timestamps: true });

schoolAdminSchema.virtual("schoolDetails", {
    ref: "School",
    localField: "schoolId",
    foreignField: "schoolId",
    justOne: false
});


const SchoolAdmins = mongoose.model("SchoolAdmins", schoolAdminSchema);
module.exports = SchoolAdmins;