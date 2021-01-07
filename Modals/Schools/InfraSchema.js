const mongoose = require("mongoose");

const InfraSchema = new mongoose.Schema({
    ramps: Boolean,
    gym: Boolean,
    fireExtinguishers: Boolean,
    clinic: Boolean,
    wifi: Boolean
});

module.exports = InfraSchema;