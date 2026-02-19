const mongoose = require('mongoose');
require('dotenv').config();
const DiseaseFee = require('./models/DiseaseFee');

const seedData = [
    { diseaseName: 'Cancer', minCost: 100000, maxCost: 1500000 },
    { diseaseName: 'Heart Surgery', minCost: 200000, maxCost: 1000000 },
    { diseaseName: 'Heart Failure', minCost: 50000, maxCost: 800000 },
    { diseaseName: 'Coronary Artery Disease', minCost: 100000, maxCost: 1200000 },
    { diseaseName: 'Kidney Transplant', minCost: 300000, maxCost: 800000 },
    { diseaseName: 'Chronic Kidney Disease', minCost: 50000, maxCost: 500000 },
    { diseaseName: 'Liver Transplant', minCost: 1000000, maxCost: 2500000 },
    { diseaseName: 'Liver Cirrhosis', minCost: 50000, maxCost: 600000 },
    { diseaseName: 'Bone Marrow Transplant', minCost: 1500000, maxCost: 4000000 },
    { diseaseName: 'Leukemia', minCost: 500000, maxCost: 2000000 },
    { diseaseName: 'Brain Tumor', minCost: 200000, maxCost: 1500000 },
    { diseaseName: 'Tuberculosis', minCost: 10000, maxCost: 100000 },
    { diseaseName: 'Cataract', minCost: 15000, maxCost: 60000 },
    { diseaseName: 'Joint Replacement', minCost: 150000, maxCost: 500000 },
    { diseaseName: 'Neurological Disorders', minCost: 50000, maxCost: 1000000 }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jivandan');
        console.log('Connected to MongoDB');

        await DiseaseFee.deleteMany({});
        console.log('Cleared existing DiseaseFee data');

        await DiseaseFee.insertMany(seedData);
        console.log('Seed data inserted successfully');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedDB();
