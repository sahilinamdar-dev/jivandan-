const express = require('express');
const router = express.Router();

const {
  getPendingHospitals,
  updateHospitalStatus,
  getAllHospitals,
  getAllTransactions,
  getApprovedHospitals,
  getRejectedHospitals,
  getBlacklistedHospitals,
  getAdminStats,
  getHospitalById,
  getVerifiedAdminHospitals,
  getAdminAnalytics
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * ===============================
 * PUBLIC ROUTES
 * ===============================
 */

// Public: list approved hospitals
// GET /api/admin/hospitals/approved
router.get('/hospitals/approved', getApprovedHospitals);

/**
 * ===============================
 * ADMIN PROTECTED ROUTES
 * ===============================
 */

router.use(protect);
router.use(authorize('admin'));

// GET /api/admin/hospitals
router.get('/hospitals', getAllHospitals);

// GET /api/admin/hospitals/pending
router.get('/hospitals/pending', getPendingHospitals);

// GET /api/admin/hospitals/verified
router.get('/hospitals/verified', getVerifiedAdminHospitals);

// GET /api/admin/hospitals/rejected
router.get('/hospitals/rejected', getRejectedHospitals);

// GET /api/admin/hospitals/blacklisted
router.get('/hospitals/blacklisted', getBlacklistedHospitals);

// GET /api/admin/hospitals/:hospitalId
router.get('/hospitals/:hospitalId', getHospitalById);

// PUT /api/admin/hospitals/:hospitalId/status
router.put(
  '/hospitals/:hospitalId/status',
  updateHospitalStatus
);

// GET /api/admin/stats
router.get('/stats', getAdminStats);

// GET /api/admin/analytics
router.get('/analytics', getAdminAnalytics);

// GET /api/admin/transactions
router.get('/transactions', getAllTransactions);

module.exports = router;
