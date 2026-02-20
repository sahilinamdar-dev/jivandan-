

const MedicalCase = require('../models/MedicalCase');
const User = require('../models/User');
const autoAssignHospital = require('../services/autoAssignHospital');
const { redisClient } = require('../config/redis');
const { getSpecialityForDisease } = require('../utils/diseaseMapping');



/* ======================================================
   1️⃣ CREATE CASE
====================================================== */

exports.createCase = async (req, res) => {
  try {

    const caseData = { ...req.body, patientId: req.user.id };

    // ✅ AUTO-DETECT SPECIALITY FROM DISEASE
    if (caseData.disease && !caseData.requiredSpeciality) {
      caseData.requiredSpeciality = getSpecialityForDisease(caseData.disease);
      console.log(`🔍 Auto-detected speciality: ${caseData.requiredSpeciality} for disease: ${caseData.disease}`);
    }

    // 🔥 REDIS DUPLICATE CHECK (Better than DB heavy check)
    const duplicateKey = `case:phone:${caseData.phone}`;
    const existingDuplicate = await redisClient.get(duplicateKey);

    if (existingDuplicate) {
      caseData.flags = ['duplicate_phone'];
    }

    let medicalCase = await MedicalCase.create({
      ...caseData,
      timeline: [
        { status: 'pending', remarks: 'Case submitted for hospital verification' }
      ]
    });

    // ✅ Match proper: Increment activeCases in User model
    await User.findByIdAndUpdate(req.user.id, { $inc: { activeCases: 1 } });

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

    if (
      req.user.role === 'hospital' &&
      medicalCase.assignedHospital?.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not your assigned case' });
    }

    // ✅ Match proper: Decrement activeCases if the case is completed or rejected
    if (['completed', 'rejected'].includes(status) && medicalCase.status !== status) {
      await User.findByIdAndUpdate(medicalCase.patientId, { $inc: { activeCases: -1 } });
    }

    medicalCase.status = status;
    medicalCase.timeline.push({ status, remarks });

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
