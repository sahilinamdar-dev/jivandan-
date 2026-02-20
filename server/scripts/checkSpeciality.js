require('dotenv').config();
const mongoose = require('mongoose');
const Hospital = require('../models/Hospital');
const User = require('../models/User');

async function checkSpeciality() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const targetSpeciality = 'Radiology';

        // Test exact match
        const exactMatch = await Hospital.find({
            isActive: true,
            specialities: targetSpeciality
        }).populate('userId');

        console.log(`🔍 Exact Match for "${targetSpeciality}": ${exactMatch.length} hospitals`);
        exactMatch.forEach(h => console.log(`  - ${h.hospitalName}: ${h.specialities.join(', ')}`));

        // Test case-insensitive regex match
        const regexMatch = await Hospital.find({
            isActive: true,
            specialities: { $regex: new RegExp(`^${targetSpeciality}$`, 'i') }
        }).populate('userId');

        console.log(`\n🔍 Regex Match (case-insensitive) for "${targetSpeciality}": ${regexMatch.length} hospitals`);
        regexMatch.forEach(h => console.log(`  - ${h.hospitalName}: ${h.specialities.join(', ')}`));

        // Show all hospitals and their specialities
        const allHospitals = await Hospital.find({ isActive: true });
        console.log(`\n📋 All Active Hospitals and Their Specialities:\n`);
        allHospitals.forEach(h => {
            console.log(`${h.hospitalName}:`);
            console.log(`  Specialities: [${h.specialities.map(s => `"${s}"`).join(', ')}]`);
        });

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

checkSpeciality();
