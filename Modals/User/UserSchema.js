const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//we are using _id for users
const UserSchema = new mongoose.Schema({
    isSchoolAdmin: {
        type: Boolean,
        default: false
    },
    adminOf: {
        type: String,
        ref: "School"
    },
    email: {
        type: String,
        maxlength: 50
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
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

UserSchema.virtual("adminOfDetailed", {
    ref: "School",
    localField: "adminOf",
    foreignField: "schoolId",
    justOne: false
});

UserSchema.methods = {
    validPassword: async (plainPassword) => {
        const hash = this.password;
        await bcrypt.compare(plainPassword, hash, (err, isMatch) => {
            if (isMatch) {
                return true;
            }
            return false;
        })
    }
}

const User = mongoose.model("User", UserSchema);
module.exports = User;