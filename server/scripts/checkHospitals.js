require('dotenv').config();
const mongoose = require('mongoose');
const Hospital = require('../models/Hospital');
const User = require('../models/User');

async function checkHospitals() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const hospitals = await Hospital.find().populate('userId');
        console.log(`\n📊 Total Hospitals in DB: ${hospitals.length}\n`);

        for (const h of hospitals) {
            console.log(`Hospital: ${h.hospitalName}`);
            console.log(`  - User ID: ${h.userId?._id}`);
            console.log(`  - User Status: ${h.userId?.status}`);
            console.log(`  - User Role: ${h.userId?.role}`);
            console.log(`  - isActive: ${h.isActive}`);
            console.log(`  - Specialities: ${h.specialities.join(', ')}`);
            console.log(`  - Active Cases: ${h.activeCases}/${h.maxCapacity}`);
            console.log(`  - Eligible for Auto-Assign: ${h.isActive && h.userId?.status === 'approved' && h.userId?.role === 'hospital' && h.activeCases < h.maxCapacity ? '✅ YES' : '❌ NO'}`);
            console.log('');
        }

        const approvedCount = hospitals.filter(h =>
            h.isActive &&
            h.userId?.status === 'approved' &&
            h.userId?.role === 'hospital' &&
            h.activeCases < h.maxCapacity
        ).length;

        console.log(`\n🎯 Eligible Hospitals for Auto-Assignment: ${approvedCount}/${hospitals.length}\n`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

checkHospitals();
