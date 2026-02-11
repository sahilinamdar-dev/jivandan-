const User = require('../models/User');
const MedicalCase = require('../models/MedicalCase');

const autoAssignHospital = async (caseId) => {
  // 1. Find hospital with least load 
  const hospital = await User.findOne({
    role: 'hospital',
    status: 'approved',
    activeCases: { $lt: 5 } // capacity
  }).sort({ activeCases: 1 });

  if (!hospital) return null;

  // 2. Assign & lock case (atomic)
  const updatedCase = await MedicalCase.findOneAndUpdate(
    {
      _id: caseId,
      assignedHospital: null,
      locked: false
    },
    {
      assignedHospital: hospital._id,
      hospitalId: hospital._id,
      locked: true,
      status: 'assigned',
      $push: {
        timeline: {
          status: 'assigned',
          remarks: 'Case assigned to hospital'
        }
      }
    },
    { new: true }
  );

  if (!updatedCase) return null;

  // 3. Update hospital load
  await User.findByIdAndUpdate(hospital._id, {
    $inc: { activeCases: 1 }
  });

  return updatedCase;

};

module.exports = autoAssignHospital;