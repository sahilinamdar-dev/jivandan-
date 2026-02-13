const mongoose = require('mongoose');
require('dotenv').config();
const Donation = require('./models/Donation');

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const d = await Donation.findOne().sort({ createdAt: -1 });
        if (d) {
            console.log('LATEST DONATION:', JSON.stringify(d, null, 2));
        } else {
            console.log('No donations found');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
