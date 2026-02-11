const MedicalCase = require('../models/MedicalCase');

exports.createCase = async (req, res) => {
    try {
        console.log("Full Request Body:", JSON.stringify(req.body, null, 2));
        const caseData = { ...req.body, patientId: req.user.id };

        // Basic Fraud Check: Flag duplicate phone numbers
        const existingCase = await MedicalCase.findOne({ phone: caseData.phone });
        if (existingCase) {
            caseData.flags = ['duplicate_phone'];
        }

        const medicalCase = new MedicalCase({
            ...caseData,
            timeline: [{ status: 'pending', remarks: 'Case submitted for hospital verification' }]
        });

        await medicalCase.save();
        res.status(201).json(medicalCase);
    } catch (err) {
        console.error("Case Creation Error:", err);
        res.status(500).json({
            message: err.message,
            errors: err.errors
        });
    }
};

exports.getAllCases = async (req, res) => {
    try {
        const cases = await MedicalCase.find({ status: 'live' }).populate('patientId', 'name');
        res.json(cases);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCaseDetails = async (req, res) => {
    try {
        const medicalCase = await MedicalCase.findById(req.params.id)
            .populate('patientId', 'name profileImage')
            .populate('hospitalId', 'name');
        res.json(medicalCase);
    } catch (err) {
        res.status(404).json({ message: 'Case not found' });
    }
};

exports.updateCaseStatus = async (req, res) => {
    try {
        const { status, remarks } = req.body;
        const medicalCase = await MedicalCase.findById(req.params.id);
        if (!medicalCase) return res.status(404).json({ message: 'Case not found' });

        medicalCase.status = status;
        if (req.user.role === 'hospital') medicalCase.hospitalId = req.user.id;

        medicalCase.timeline.push({ status, remarks });
        await medicalCase.save();

        res.json(medicalCase);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getHospitalCases = async (req, res) => {
    try {
        const { status = 'pending' } = req.query;
        const cases = await MedicalCase.find({
            hospitalId: req.user.id,
            status: status
        }).populate('patientId', 'name email phone');
        res.json(cases);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
