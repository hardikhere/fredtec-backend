const mongoose = require("mongoose");

//incomplete
const UserSchema = new mongoose.Schema({
    userId: {
        unique: true,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
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
    }
}, { timestamps: true });


const User = mongoose.model("User", UserSchema);
module.exports = User;