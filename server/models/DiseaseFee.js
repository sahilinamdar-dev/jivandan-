const mongoose = require('mongoose');

const diseaseFeeSchema = new mongoose.Schema({
    diseaseName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    minCost: {
        type: Number,
        required: true
    },
    maxCost: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('DiseaseFee', diseaseFeeSchema);
