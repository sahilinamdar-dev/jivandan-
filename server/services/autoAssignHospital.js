const User = require('../models/User');
const Hospital = require('../models/Hospital');
const MedicalCase = require('../models/MedicalCase');

const autoAssignHospital = async (caseId) => {
  try {
    // 1️⃣ Get medical case
    const medicalCase = await MedicalCase.findById(caseId);
    if (!medicalCase) {
      console.log(`❌ AutoAssign: Case ${caseId} not found`);
      return null;
    }

    const specialityNeeded = medicalCase.requiredSpeciality;
    if (!specialityNeeded) {
      console.log(`⚠️ AutoAssign: Case ${caseId} has no required speciality`);
      return null;
    }

    console.log(`🔍 AutoAssign: Matching hospital for "${specialityNeeded}"...`);

    // 2️⃣ Find hospitals with EXACT speciality match (STRICT MODE)
    const hospitals = await Hospital.find({
      isActive: true,
      specialities: { $regex: new RegExp(`^${specialityNeeded}$`, 'i') },
      $expr: { $lt: ["$activeCases", { $ifNull: ["$maxCapacity", 5] }] }
    })
      .populate({
        path: 'userId',
        match: {
          role: 'hospital',
          status: 'approved'
        }
      })
      .sort({ activeCases: 1 });

    const validHospitals = hospitals.filter(h => h.userId);

    console.log(`📊 AutoAssign: Found ${hospitals.length} potential hospitals, ${validHospitals.length} approved/matching ones.`);

    if (!validHospitals.length) {
      console.log(`🚫 AutoAssign: No hospital with "${specialityNeeded}" speciality available`);
      console.log(`ℹ️  Case will remain PENDING for manual admin assignment`);
      return null;
    }

    const selectedHospital = validHospitals[0];
    console.log(`🎯 AutoAssign: Selected "${selectedHospital.hospitalName}" (User ID: ${selectedHospital.userId._id})`);

    // 3️⃣ Assign case atomically
    const updatedCase = await MedicalCase.findOneAndUpdate(
      {
        _id: caseId,
        locked: false,
        assignedHospital: null
      },
      {
        assignedHospital: selectedHospital.userId._id,
        hospitalId: selectedHospital.userId._id,
        locked: true,
        status: 'HOSPITAL_ASSIGNED',
        $push: {
          timeline: {
            status: 'HOSPITAL_ASSIGNED',
            remarks: `Automatically assigned to ${selectedHospital.hospitalName} (${specialityNeeded} dept.)`
          }
        }
      },
      { new: true }
    );

    if (!updatedCase) {
      console.log(`❌ AutoAssign: Atomic update failed for Case ${caseId} (maybe already locked?)`);
      return null;
    }

    // 4️⃣ Increase hospital load
    await Hospital.findByIdAndUpdate(
      selectedHospital._id,
      { $inc: { activeCases: 1 } }
    );

    console.log(`✅ AutoAssign: Case ${caseId} successfully assigned to ${selectedHospital.hospitalName}`);
    return updatedCase;
  } catch (err) {
    console.error("🔥 AutoAssign Fatal Error:", err);
    return null;
  }
};

module.exports = autoAssignHospital;