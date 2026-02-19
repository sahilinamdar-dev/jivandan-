
const MedicalCase = require('../models/MedicalCase');
const autoAssignHospital = require('../services/autoAssignHospital');
const { checkFraud } = require('../services/fraudService');
const { redisClient } = require('../config/redis');



/* ======================================================
   1️⃣ CREATE CASE
====================================================== */

exports.createCase = async (req, res) => {
  try {

    const caseData = { ...req.body, patientId: req.user.id };

    // 🔥 REDIS DUPLICATE CHECK (Better than DB heavy check)
    const duplicateKey = `case:phone:${caseData.phone}`;
    const existingDuplicate = await redisClient.get(duplicateKey);

    if (existingDuplicate) {
      caseData.flags = ['duplicate_phone'];
    }

    // 🔥 FRAUD DETECTION
    const fraudResult = await checkFraud(caseData.disease, caseData.amountRequired);
    console.log('Fraud detection result:', fraudResult);

    if (fraudResult.fraudStatus === 'REVIEW') {
      caseData.flags = [...(caseData.flags || []), 'suspicious_amount'];
    }

    let medicalCase = await MedicalCase.create({
      ...caseData,
      ...fraudResult,
      status: 'CASE_SUBMITTED',
      timeline: [
        {
          status: 'CASE_SUBMITTED',
          remarks: fraudResult.fraudStatus === 'REVIEW'
            ? 'Case submitted: Flagged for high requested amount review.'
            : 'Case submitted for hospital verification'
        }
      ]
    });

    // Store duplicate key for 24 hours
    await redisClient.setEx(duplicateKey, 86400, "true");

    // 🔥 AUTO ASSIGN
    const assignedCase = await autoAssignHospital(medicalCase._id);

    if (assignedCase) {
      medicalCase = assignedCase;
    }

    // 🔥 CACHE INVALIDATION
    await redisClient.del("cases:live");
    await redisClient.del(`case:${medicalCase._id}`);

    res.status(201).json({
      success: true,
      case: medicalCase
    });

  } catch (err) {
    console.error("Case Creation Error:", err);
    res.status(500).json({ message: err.message });
  }
};



/* ======================================================
   2️⃣ GET ALL LIVE CASES (Public)
====================================================== */

exports.getAllCases = async (req, res) => {
  try {

    const cacheKey = "cases:live";

    const cached = await redisClient.get(cacheKey);

    if (cached) {
      console.log("📦 Cases from Redis");
      return res.json(JSON.parse(cached));
    }

    console.log("🗄 Cases from MongoDB");

    const cases = await MedicalCase.find({ status: 'live' })
      .populate('patientId', 'name');

    await redisClient.setEx(cacheKey, 120, JSON.stringify(cases));

    res.json(cases);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



/* ======================================================
   3️⃣ GET CASE DETAILS
====================================================== */

exports.getCaseDetails = async (req, res) => {
  try {

    const cacheKey = `case:${req.params.id}`;

    const cached = await redisClient.get(cacheKey);

    if (cached) {
      console.log("📦 Case Details from Redis");
      return res.json(JSON.parse(cached));
    }

    const medicalCase = await MedicalCase.findById(req.params.id)
      .populate('patientId', 'name profileImage')
      .populate('hospitalId', 'name');

    if (!medicalCase) {
      return res.status(404).json({ message: 'Case not found' });
    }

    await redisClient.setEx(cacheKey, 120, JSON.stringify(medicalCase));

    res.json(medicalCase);

  } catch (err) {
    res.status(404).json({ message: 'Case not found' });
  }
};



/* ======================================================
   4️⃣ UPDATE CASE STATUS
====================================================== */

exports.updateCaseStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const medicalCase = await MedicalCase.findById(req.params.id);

    if (!medicalCase) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // Role check
    if (req.user.role === 'hospital' && medicalCase.assignedHospital?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not your assigned case' });
    }

    const STATUS_ORDER = ['CASE_SUBMITTED', 'CASE_VERIFIED', 'HOSPITAL_ASSIGNED', 'HOSPITAL_APPROVED', 'CASE_LIVE', 'TREATMENT_MILESTONE'];

    const currentIndex = STATUS_ORDER.indexOf(medicalCase.status);
    const nextIndex = STATUS_ORDER.indexOf(status);

    // Validate Status Order (except for completed/rejected)
    if (status !== 'completed' && status !== 'rejected') {
      if (nextIndex === -1) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      // Prevent Duplicate Consecutive (except milestones)
      if (status === medicalCase.status && status !== 'TREATMENT_MILESTONE') {
        return res.status(400).json({ message: `Case is already in ${status}` });
      }

      // Enforce Sequential Order (relaxed for milestone if already at milestone)
      if (status !== 'TREATMENT_MILESTONE' && nextIndex < currentIndex) {
        return res.status(400).json({ message: 'Cannot move to a previous status' });
      }
    }

    // 🚩 Fraud Protection
    if (medicalCase.fraudStatus === 'REVIEW' && status === 'CASE_LIVE') {
      const isVerified = medicalCase.timeline.some(t => t.status === 'CASE_VERIFIED');
      if (!isVerified) {
        return res.status(400).json({ message: 'Fraud review required: Case must be CASE_VERIFIED before going LIVE.' });
      }
    }

    // Update Status and Timeline
    medicalCase.status = status;
    medicalCase.timeline.push({
      status,
      remarks: remarks || `Status updated to ${status}`,
      updatedAt: new Date()
    });

    await medicalCase.save();

    // 🔥 CACHE INVALIDATION
    await redisClient.del("cases:live");
    await redisClient.del(`case:${medicalCase._id}`);

    res.json({
      success: true,
      case: medicalCase
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



/* ======================================================
   6️⃣ GET PATIENT'S OWN CASE
====================================================== */

exports.getMyCase = async (req, res) => {
  try {
    const medicalCase = await MedicalCase.findOne({ patientId: req.user.id })
      .populate('hospitalId', 'name');

    if (!medicalCase) {
      return res.status(404).json({ message: 'No case discovered for this patient' });
    }

    res.json(medicalCase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



/* ======================================================
   5️⃣ GET HOSPITAL CASES
====================================================== */

exports.getHospitalCases = async (req, res) => {
  try {

    const { status = 'pending' } = req.query;

    const cacheKey = `hospital:${req.user.id}:cases:${status}`;

    const cached = await redisClient.get(cacheKey);

    if (cached) {
      console.log("📦 Hospital Cases from Redis");
      return res.json(JSON.parse(cached));
    }

    const cases = await MedicalCase.find({
      hospitalId: req.user.id,
      status
    }).populate('patientId', 'name email phone');

    await redisClient.setEx(cacheKey, 120, JSON.stringify(cases));

    res.json(cases);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
