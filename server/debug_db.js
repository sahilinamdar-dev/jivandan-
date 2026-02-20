const mongoose = require('mongoose');
require('dotenv').config();
const DiseaseFee = require('./models/DiseaseFee');

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const counts = await DiseaseFee.countDocuments();
        console.log(`Total DiseaseFee entries: ${counts}`);
        const samples = await DiseaseFee.find().limit(5);
        console.log('Sample entries:', samples);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDB();
