const mongoose = require('mongoose');
const User = require('./models/User');
const MedicalCase = require('./models/MedicalCase');
require('dotenv').config();

const seedUrgentCases = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Create/Find a Dummy Hospital User
        let hospitalUser = await User.findOne({ role: 'hospital', email: 'verified-hospital@jivandan.com' });
        if (!hospitalUser) {
            hospitalUser = await User.create({
                name: 'City Heart & Child Care Hospital',
                email: 'verified-hospital@jivandan.com',
                password: 'password123', // In a real app, hash this
                role: 'hospital',
                status: 'approved'
            });
            console.log('Created dummy hospital user');
        }

        // 2. Create/Find a Dummy Patient User for Aarav
        let aaravPatient = await User.findOne({ email: 'aarav-family@example.com' });
        if (!aaravPatient) {
            aaravPatient = await User.create({
                name: 'Rajesh (Aarav\'s Father)',
                email: 'aarav-family@example.com',
                password: 'password123',
                role: 'patient',
                status: 'approved'
            });
            console.log('Created dummy patient user for Aarav');
        }

        // 3. Create/Find a Dummy Patient User for Ishita
        let ishitaPatient = await User.findOne({ email: 'ishita-family@example.com' });
        if (!ishitaPatient) {
            ishitaPatient = await User.create({
                name: 'Meena (Ishita\'s Mother)',
                email: 'ishita-family@example.com',
                password: 'password123',
                role: 'patient',
                status: 'approved'
            });
            console.log('Created dummy patient user for Ishita');
        }

        // 4. Clear existing cases for these children to avoid duplicates
        await MedicalCase.deleteMany({ patientName: { $in: ['Aarav', 'Ishita'] } });
        console.log('Cleared existing cases for Aarav and Ishita');

        // 5. Create Aarav's Case
        const aaravCase = await MedicalCase.create({
            patientId: aaravPatient._id,
            hospitalId: hospitalUser._id,
            patientName: 'Aarav',
            age: 4,
            gender: 'male',
            phone: '9876543210',
            email: 'aarav-family@example.com',
            city: 'Mumbai',
            state: 'Maharashtra',
            relationshipToPatient: 'parent',
            title: 'Urgent Heart Surgery for 4-year-old Aarav',
            disease: 'Congenital Heart Disease',
            description: "Aarav's heart is too weak to sustain his playful spirit. Every breath is a struggle, and his parents are desperate for your help to fund his life-saving surgery.",
            diagnosisDate: new Date('2024-01-15'),
            currentCondition: 'critical',
            recommendedTreatment: 'Open Heart Surgery',
            expectedDuration: '3 months',
            amountRequired: 550000,
            amountCollected: 0,
            costBreakdown: {
                surgery: 350000,
                medicines: 50000,
                hospitalStay: 100000,
                diagnostics: 50000
            },
            status: 'CASE_LIVE',
            consents: {
                sharePublicly: true,
                hospitalVerification: true,
                policyAgreement: true,
                truthfulnessDeclaration: true
            },
            documents: [
                { name: 'Patient Photo', url: 'https://images.unsplash.com/photo-1516549221184-ef395c07421f', type: 'patient_photo' }
            ],
            timeline: [{ status: 'CASE_LIVE', remarks: 'Case is live and verified.' }]
        });
        console.log('Seeded Aarav\'s case');

        // 6. Create Ishita's Case
        const ishitaCase = await MedicalCase.create({
            patientId: ishitaPatient._id,
            hospitalId: hospitalUser._id,
            patientName: 'Ishita',
            age: 5,
            gender: 'female',
            phone: '9876543211',
            email: 'ishita-family@example.com',
            city: 'Delhi',
            state: 'Delhi',
            relationshipToPatient: 'parent',
            title: 'Critical Chemotherapy for 5-year-old Ishita',
            disease: 'Acute Lymphoblastic Leukemia',
            description: "Little Ishita was just starting school when her world was turned upside down. She needs immediate chemotherapy and a bone marrow transplant to fight this aggressive cancer.",
            diagnosisDate: new Date('2024-02-10'),
            currentCondition: 'critical',
            recommendedTreatment: 'Chemotherapy & Bone Marrow Transplant',
            expectedDuration: '12 months',
            amountRequired: 1250000,
            amountCollected: 0,
            costBreakdown: {
                surgery: 0,
                medicines: 600000,
                hospitalStay: 400000,
                diagnostics: 250000
            },
            status: 'CASE_LIVE',
            consents: {
                sharePublicly: true,
                hospitalVerification: true,
                policyAgreement: true,
                truthfulnessDeclaration: true
            },
            documents: [
                { name: 'Patient Photo', url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9', type: 'patient_photo' }
            ],
            timeline: [{ status: 'CASE_LIVE', remarks: 'Case is live and verified.' }]
        });
        console.log('Seeded Ishita\'s case');

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedUrgentCases();
