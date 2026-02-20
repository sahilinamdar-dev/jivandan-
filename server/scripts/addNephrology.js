require('dotenv').config();
const mongoose = require('mongoose');
const Hospital = require('../models/Hospital');

async function addNephrologyToHospital() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find St. Mary Medical and add Nephrology
        const hospital = await Hospital.findOne({ hospitalName: "St. Mary Medical" });

        if (!hospital) {
            console.log('❌ Hospital not found');
            process.exit(1);
        }

        console.log(`Current specialities: ${hospital.specialities.join(', ')}`);

        // Add Nephrology if not already present
        if (!hospital.specialities.includes('Nephrology')) {
            hospital.specialities.push('Nephrology');
            await hospital.save();
            console.log(`✅ Added Nephrology to ${hospital.hospitalName}`);
            console.log(`New specialities: ${hospital.specialities.join(', ')}`);
        } else {
            console.log('ℹ️ Nephrology already exists');
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

addNephrologyToHospital();
