const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
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
        console.log(hash)
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