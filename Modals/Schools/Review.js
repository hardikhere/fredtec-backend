const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const ReviewSchema = new mongoose.Schema(
	{
		userCredential: {
			type: ObjectId,
			ref: 'User',
		},
		schoolCredential: {
			type: ObjectId,
			ref: 'School',
			// unique: true,
			// required: true,
		},
		rating: {
			type: Number,
			default: 0,
			minimum: 0,
			maximum: 5,
			required: true,
		},
		contentHead: {
			//heading of review
			type: String,
			maxlength: 30,
			required: true,
		},
		contentBody: {
			//main content of review
			type: String,
			maxlength: 300,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = ReviewSchema;
