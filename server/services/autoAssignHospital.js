const User = require('../models/User');
const Hospital = require('../models/Hospital');
const MedicalCase = require('../models/MedicalCase');

const autoAssignHospital = async (caseId) => {
  // 1️⃣ Get medical case
  const medicalCase = await MedicalCase.findById(caseId);
  if (!medicalCase) return null;

  const specialityNeeded = medicalCase.requiredSpeciality;

  // 2️⃣ Find hospitals by speciality + capacity
  const hospitals = await Hospital.find({
    isActive: true,
    specialities: specialityNeeded,
    activeCases: { $lt: 5 } // or use maxCapacity
  })
    .populate({
      path: 'userId',
      match: {
        role: 'hospital',
        status: 'approved'
      }
    })
    .sort({ activeCases: 1 });

  // Remove hospitals where user didn't match (populate failed)
  const validHospitals = hospitals.filter(h => h.userId);

  if (!validHospitals.length) return null;

  const selectedHospital = validHospitals[0];

  // 3️⃣ Assign case atomically
  const updatedCase = await MedicalCase.findOneAndUpdate(
    {
      _id: caseId,
      locked: false,
      assignedHospital: null
    },
    {
      assignedHospital: selectedHospital.userId._id,
      hospitalId: selectedHospital._id,
      locked: true,
      status: 'assigned',
      $push: {
        timeline: {
          status: 'assigned',
          remarks: `Assigned to ${specialityNeeded} hospital`
        }
      }
    },
    { new: true }
  );

  if (!updatedCase) return null;

  // 4️⃣ Increase hospital load (from Hospital model)
  await Hospital.findByIdAndUpdate(
    selectedHospital._id,
    { $inc: { activeCases: 1 } }
  );

  return updatedCase;
};

module.exports = autoAssignHospital;