// const User = require('../models/User');
// const Hospital = require('../models/Hospital');
// const Donation = require('../models/Donation');
// const { redisClient } = require('../config/redis');
// const ErrorHandler = require('../utils/ErrorHandler');
// const asyncHandler = require('../utils/asyncHandler');

// /**
//  * @desc    Get all hospitals (Admin)
//  * @route   GET /api/admin/hospitals
//  * @access  Private/Admin
//  */
// // exports.getAllHospitals = asyncHandler(async (req, res) => {
// //   const users = await User.find({ role: 'hospital' }).select('-password');

// //   const hospitals = await Hospital.find({
// //     userId: { $in: users.map(u => u._id) }
// //   }).populate('userId', 'name email status');

// //   res.status(200).json({
// //     success: true,
// //     count: hospitals.length,
// //     hospitals
// //   });
// // });

// // Admin - All Hospitals
// exports.getAllHospitals = asyncHandler(async (req, res) => {

//   const cacheKey = "admin:hospitals:all";

//   const cached = await redisClient.get(cacheKey);
//   if (cached) {
//     return res.status(200).json({
//       success: true,
//       ...JSON.parse(cached)
//     });
//   }

//   const users = await User.find({ role: 'hospital' }).select('-password');

//   const hospitals = await Hospital.find({
//     userId: { $in: users.map(u => u._id) }
//   }).populate('userId', 'name email status');

//   const result = {
//     count: hospitals.length,
//     hospitals
//   };

//   await redisClient.setEx(cacheKey, 120, JSON.stringify(result));

//   res.status(200).json({
//     success: true,
//     ...result
//   });

// });

// /**
//  * @desc    Get pending hospital requests
//  * @route   GET /api/admin/hospitals/pending
//  * @access  Private/Admin
//  */
// // exports.getPendingHospitals = asyncHandler(async (req, res) => {
// //   const users = await User.find({
// //     role: 'hospital',
// //     status: 'pending'
// //   }).select('-password');

// //   const hospitals = await Hospital.find({
// //     userId: { $in: users.map(u => u._id) }
// //   }).populate('userId', 'name email status');

// //   res.status(200).json({
// //     success: true,
// //     count: hospitals.length,
// //     hospitals
// //   });
// // });
// // Admin - Pending Hospitals
// exports.getPendingHospitals = async () => {

//   const cacheKey = "admin:hospitals:pending";

//   // 1️⃣ Check Redis
//   const cached = await redisClient.get(cacheKey);
//   if (cached) {
//     console.log("📦 Pending Hospitals from Redis");
//     return JSON.parse(cached);
//   }

//   console.log("🗄 Pending Hospitals from MongoDB");

//   const users = await User.find({
//     role: 'hospital',
//     status: 'pending'
//   }).select('-password');

//   const hospitals = await Hospital.find({
//     userId: { $in: users.map(u => u._id) }
//   }).populate('userId', 'name email status');

//   const result = {
//     count: hospitals.length,
//     hospitals
//   };

//   // 2️⃣ Cache for 2 minutes
//   await redisClient.setEx(cacheKey, 120, JSON.stringify(result));

//   return result;
// };
// /**
//  * @desc    Approve / Reject / Blacklist hospital
//  * @route   PUT /api/admin/hospitals/:userId/status
//  * @access  Private/Admin
//  */
// exports.updateHospitalStatus = asyncHandler(async (req, res, next) => {
//   const { status, reason } = req.body;

//   if (!['approved', 'rejected', 'blacklisted'].includes(status)) {
//     return next(new ErrorHandler('Invalid status value', 400));
//   }

//   // 1️⃣ Find hospital first
//   const hospital = await Hospital.findById(req.params.hospitalId);

//   if (!hospital) {
//     return next(new ErrorHandler('Hospital not found', 404));
//   }

//   // 2️⃣ Find linked user
//   const user = await User.findById(hospital.userId);

//   if (!user || user.role !== 'hospital') {
//     return next(new ErrorHandler('Hospital user not found', 404));
//   }

//   if (user.status === status) {
//     return next(new ErrorHandler(`Hospital already ${status}`, 400));
//   }

//   user.status = status;
//   user.statusReason = reason || null;
//   await user.save();

//   res.status(200).json({
//     success: true,
//     message: `Hospital ${status} successfully`
//   });
// });

// /**
//  * @desc    Get approved hospitals (Public)
//  * @route   GET /api/hospitals/approved
//  * @access  Public
//  */
// exports.getApprovedHospitals = asyncHandler(async (req, res) => {
//   const hospitals = await Hospital.find()
//     .populate({
//       path: 'userId',
//       match: { status: 'approved' },
//       select: 'name'
//     })
//     .select('hospitalName address contact');

//   const approvedHospitals = hospitals.filter(h => h.userId);

//   res.status(200).json({
//     success: true,
//     count: approvedHospitals.length,
//     hospitals: approvedHospitals
//   });
// });

// /**
//  * @desc    Get all completed transactions
//  * @route   GET /api/admin/transactions
//  * @access  Private/Admin
//  */
// exports.getAllTransactions = asyncHandler(async (req, res) => {
//   const { supporterType } = req.query;

//   let transactions = await Donation.find({ status: 'completed' })
//     .populate('supporterId', 'name email role supporterType')
//     .populate('caseId', 'title')
//     .sort('-createdAt');

//   if (supporterType) {
//     transactions = transactions.filter(
//       t => t.supporterId?.supporterType === supporterType
//     );
//   }

//   res.status(200).json({
//     success: true,
//     count: transactions.length,
//     transactions
//   });
// });

const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Donation = require('../models/Donation');
const { redisClient } = require('../config/redis');
const ErrorHandler = require('../utils/ErrorHandler');
const asyncHandler = require('../utils/asyncHandler');



/* ======================================================
   1️⃣ GET ALL HOSPITALS (ADMIN)
====================================================== */

exports.getAllHospitals = asyncHandler(async (req, res) => {

  const cacheKey = "admin:hospitals:all";

  const cached = await redisClient.get(cacheKey);

  if (cached) {
    console.log("📦 All Hospitals from Redis");

    return res.status(200).json({
      success: true,
      ...JSON.parse(cached)
    });
  }

  console.log("🗄 All Hospitals from MongoDB");

  const users = await User.find({ role: 'hospital' }).select('-password');

  const hospitals = await Hospital.find({
    userId: { $in: users.map(u => u._id) }
  }).populate('userId', 'name email status');

  const result = {
    count: hospitals.length,
    hospitals
  };

  // Cache for 2 minutes
  await redisClient.setEx(cacheKey, 120, JSON.stringify(result));

  res.status(200).json({
    success: true,
    ...result
  });

});



/* ======================================================
   2️⃣ GET PENDING HOSPITALS (ADMIN)
====================================================== */

exports.getPendingHospitals = asyncHandler(async (req, res) => {

  const cacheKey = "admin:hospitals:pending";

  const cached = await redisClient.get(cacheKey);

  if (cached) {
    console.log("📦 Pending Hospitals from Redis");

    return res.status(200).json({
      success: true,
      ...JSON.parse(cached)
    });
  }

  console.log("🗄 Pending Hospitals from MongoDB");

  const users = await User.find({
    role: 'hospital',
    status: 'pending'
  }).select('-password');

  const hospitals = await Hospital.find({
    userId: { $in: users.map(u => u._id) }
  }).populate('userId', 'name email status');

  const result = {
    count: hospitals.length,
    hospitals
  };

  await redisClient.setEx(cacheKey, 120, JSON.stringify(result));

  res.status(200).json({
    success: true,
    ...result
  });

});



/* ======================================================
   3️⃣ UPDATE HOSPITAL STATUS (ADMIN)
====================================================== */

exports.updateHospitalStatus = asyncHandler(async (req, res, next) => {

  const { status, reason } = req.body;

  if (!['approved', 'rejected', 'blacklisted'].includes(status)) {
    return next(new ErrorHandler('Invalid status value', 400));
  }

  const hospital = await Hospital.findById(req.params.hospitalId);

  if (!hospital) {
    return next(new ErrorHandler('Hospital not found', 404));
  }

  const user = await User.findById(hospital.userId);

  if (!user || user.role !== 'hospital') {
    return next(new ErrorHandler('Hospital user not found', 404));
  }

  if (user.status === status) {
    return next(new ErrorHandler(`Hospital already ${status}`, 400));
  }

  user.status = status;
  user.statusReason = reason || null;
  await user.save();

  // 🔥 CACHE INVALIDATION (VERY IMPORTANT)
  await redisClient.del("admin:hospitals:all");
  await redisClient.del("admin:hospitals:pending");
  await redisClient.del("public:hospitals:approved");

  res.status(200).json({
    success: true,
    message: `Hospital ${status} successfully`
  });

});



/* ======================================================
   4️⃣ GET APPROVED HOSPITALS (PUBLIC)
====================================================== */

exports.getApprovedHospitals = asyncHandler(async (req, res) => {

  const cacheKey = "public:hospitals:approved";

  const cached = await redisClient.get(cacheKey);

  if (cached) {
    console.log("📦 Approved Hospitals from Redis");

    return res.status(200).json({
      success: true,
      ...JSON.parse(cached)
    });
  }

  console.log("🗄 Approved Hospitals from MongoDB");

  const hospitals = await Hospital.find()
    .populate({
      path: 'userId',
      match: { status: 'approved' },
      select: 'name'
    })
    .select('hospitalName address contact');

  const approvedHospitals = hospitals.filter(h => h.userId);

  const result = {
    count: approvedHospitals.length,
    hospitals: approvedHospitals
  };

  await redisClient.setEx(cacheKey, 300, JSON.stringify(result)); // 5 min

  res.status(200).json({
    success: true,
    ...result
  });

});



/* ======================================================
   5️⃣ GET ALL TRANSACTIONS (ADMIN)
   (No caching for financial data)
====================================================== */

exports.getAllTransactions = asyncHandler(async (req, res) => {

  const { supporterType } = req.query;

  let transactions = await Donation.find({ status: 'completed' })
    .populate('supporterId', 'name email role supporterType')
    .populate('caseId', 'title')
    .sort('-createdAt');

  if (supporterType) {
    transactions = transactions.filter(
      t => t.supporterId?.supporterType === supporterType
    );
  }

  res.status(200).json({
    success: true,
    count: transactions.length,
    transactions
  });

});
