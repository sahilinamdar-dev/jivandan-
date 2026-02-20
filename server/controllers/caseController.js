
const MedicalCase = require('../models/MedicalCase');
const autoAssignHospital = require('../services/autoAssignHospital');
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

    let medicalCase = await MedicalCase.create({
      ...caseData,
      timeline: [
        { status: 'pending', remarks: 'Case submitted for hospital verification' }
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

    // Further optimized: Authorization check and update in one atomic operation
    const filter = { _id: req.params.id };
    if (req.user.role === 'hospital') {
      filter.$or = [
        { hospitalId: req.user.id },
        { assignedHospital: req.user.id }
      ];
    }

    const updatedCase = await MedicalCase.findOneAndUpdate(
      filter,
      {
        $set: { status },
        $push: { timeline: { status, remarks, updatedAt: new Date() } }
      },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: 'Case not found or unauthorized' });
    }

    // 🔥 CACHE INVALIDATION (Non-blocking for faster response)
    Promise.all([
      redisClient.del("cases:live"),
      redisClient.del(`case:${req.params.id}`)
    ]).catch(err => console.error("Cache Invalidation Error:", err));

    res.json({
      success: true,
      case: updatedCase
    });

  } catch (err) {
    console.error("Update Status Error:", err);
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
    }).populate('patientId', 'name email phone city state age gender');

    await redisClient.setEx(cacheKey, 120, JSON.stringify(cases));

    res.json(cases);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
