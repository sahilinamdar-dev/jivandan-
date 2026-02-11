const MedicalCase = require('../models/MedicalCase');
const autoAssignHospital = require('../services/autoAssignHospital');

exports.createCase = async (req, res) => {
  try {
    const caseData = { ...req.body, patientId: req.user.id };

    // Fraud check
    const existingCase = await MedicalCase.findOne({ phone: caseData.phone });
    if (existingCase) {
      caseData.flags = ['duplicate_phone'];
    }

    let medicalCase = await MedicalCase.create({
      ...caseData,
      timeline: [
        { status: 'pending', remarks: 'Case submitted for hospital verification' }
      ]
    });

    // 🔥 AUTO ASSIGN
    const assignedCase = await autoAssignHospital(medicalCase._id);

    // If assignment happened, return updated version
    if (assignedCase) {
      medicalCase = assignedCase;
    }

    res.status(201).json({
      success: true,
      case: medicalCase
    });
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

    if (!medicalCase) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // 🔐 Hospital can only act on assigned cases
    if (
      req.user.role === 'hospital' &&
      medicalCase.assignedHospital?.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not your assigned case' });
    }

    medicalCase.status = status;

    medicalCase.timeline.push({
      status,
      remarks
    });

    await medicalCase.save();

    res.json({
      success: true,
      case: medicalCase
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
