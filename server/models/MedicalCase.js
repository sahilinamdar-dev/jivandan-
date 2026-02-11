const mongoose = require('mongoose');

const medicalCaseSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Step 1: Patient Identity
    patientName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'India' },
    relationshipToPatient: {
        type: String,
        enum: ['self', 'parent', 'guardian', 'spouse', 'other'],
        required: true
    },

    // Step 2: Medical Condition
    title: { type: String, required: true }, // Short headline
    disease: { type: String, required: true },
    description: { type: String, required: true }, // Plain language description
    diagnosisDate: { type: Date, required: true },
    currentCondition: {
        type: String,
        enum: ['stable', 'serious', 'critical'],
        required: true
    },
    recommendedTreatment: { type: String, required: true },
    expectedDuration: { type: String, required: true },

    // Step 3: Documents
    documents: [{
        name: String,
        url: { type: String, required: true },
        type: {
            type: String,
            enum: ['prescription', 'medical_report', 'hospital_letter', 'id_proof', 'patient_photo', 'other'],
            required: true
        }
    }],

    // Step 4: Funding
    amountRequired: { type: Number, required: true },
    amountAlreadyArranged: { type: Number, default: 0 },
    amountCollected: { type: Number, default: 0 },
    costBreakdown: {
        surgery: { type: Number, default: 0 },
        medicines: { type: Number, default: 0 },
        hospitalStay: { type: Number, default: 0 },
        diagnostics: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    },

    // Step 5: Consent & Verification
    status: {
        type: String,
        enum: ['pending', 'hospital_verified', 'live', 'completed', 'rejected'],
        default: 'live'
    },
    consents: {
        sharePublicly: { type: Boolean, required: true },
        hospitalVerification: { type: Boolean, required: true },
        policyAgreement: { type: Boolean, required: true },
        truthfulnessDeclaration: { type: Boolean, required: true }
    },

    // Trust & Fraud
    flags: [{
        type: String,
        enum: ['duplicate_phone', 'duplicate_document', 'suspicious_amount']
    }],
    trustScore: { type: Number, default: 0 },

    verificationRemarks: String,
    timeline: [{
        status: String,
        updatedAt: { type: Date, default: Date.now },
        remarks: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('MedicalCase', medicalCaseSchema);
