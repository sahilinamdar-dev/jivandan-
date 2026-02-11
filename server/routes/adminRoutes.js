const express = require('express');
const router = express.Router();

const {
  getPendingHospitals,
  updateHospitalStatus,
  getAllHospitals,
  getAllTransactions,
  getApprovedHospitals
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

// PUT /api/admin/hospitals/:hospitalId/status
router.put(
  '/hospitals/:hospitalId/status',
  updateHospitalStatus
);

// GET /api/admin/transactions
router.get('/transactions', getAllTransactions);

module.exports = router;
