const User = require('../models/User');
const Donation = require('../models/Donation');
const MedicalCase = require('../models/MedicalCase');
const ErrorHandler = require('../utils/ErrorHandler');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all hospitals
// @route   GET /api/admin/hospitals
// @access  Private/Admin
exports.getAllHospitals = asyncHandler(async (req, res, next) => {
    const hospitals = await User.find({ role: 'hospital' }).select('-password').sort('-createdAt');

    res.status(200).json({
        success: true,
        count: hospitals.length,
        hospitals
    });
});

// @desc    Get all pending hospital requests
// @route   GET /api/admin/hospitals/pending
// @access  Private/Admin
exports.getPendingHospitals = asyncHandler(async (req, res, next) => {
    const hospitals = await User.find({ role: 'hospital', status: 'pending' }).select('-password').sort('-createdAt');

    res.status(200).json({
        success: true,
        count: hospitals.length,
        hospitals
    });
});

// @desc    Update hospital status (Approve/Reject/Blacklist)
// @route   PUT /api/admin/hospitals/:id/status
// @access  Private/Admin
exports.updateHospitalStatus = asyncHandler(async (req, res, next) => {
    const { status, reason } = req.body;

    if (!['approved', 'rejected', 'blacklisted'].includes(status)) {
        return next(new ErrorHandler('Invalid status', 400));
    }

    const hospital = await User.findById(req.params.id);

    if (!hospital || hospital.role !== 'hospital') {
        return next(new ErrorHandler('Hospital not found', 404));
    }

    hospital.status = status;
    if (reason) {
        hospital.statusReason = reason;
    }
    await hospital.save();

    res.status(200).json({
        success: true,
        message: `Hospital ${status} successfully`,
        hospital
    });
});

// @desc    Get all approved hospitals (Public)
// @route   GET /api/hospitals/approved
// @access  Public
exports.getApprovedHospitals = asyncHandler(async (req, res, next) => {
    const hospitals = await User.find({ role: 'hospital', status: 'approved' }).select('name city state');

    res.status(200).json({
        success: true,
        hospitals
    });
});
// @desc    Get all transactions with filters
// @route   GET /api/admin/transactions
// @access  Private/Admin
exports.getAllTransactions = asyncHandler(async (req, res, next) => {
    const { supporterType } = req.query;

    let query = { status: 'completed' };

    // To filter by supporterType, we need to join with User model
    let transactions = await Donation.find(query)
        .populate({
            path: 'supporterId',
            select: 'name email role supporterType'
        })
        .populate({
            path: 'caseId',
            select: 'title'
        })
        .sort('-createdAt');

    if (supporterType && ['individual', 'ngo'].includes(supporterType)) {
        transactions = transactions.filter(t => t.supporterId && t.supporterId.supporterType === supporterType);
    }

    res.status(200).json({
        success: true,
        count: transactions.length,
        transactions
    });
});
