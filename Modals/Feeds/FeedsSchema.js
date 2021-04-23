const mongoose = require("mongoose");

const FeedsSchema = new mongoose.Schema({
    imageUrls: [String],
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    content: {
        type: String,
    },
    sid: {
        type: String,
        required: true
    }
}, { timestamps: true });

FeedsSchema.set('toObject', { virtuals: true });
FeedsSchema.set('toJSON', { virtuals: true });

FeedsSchema.virtual("schoolDetails", {
    ref: "School",
    localField: "sid",
    foreignField: "schoolId",
    justOne: false
});


const Feeds = mongoose.model("Feeds", FeedsSchema);

module.exports = Feeds;