const express = require('express');
const router = express.Router();
const { getPendingHospitals, updateHospitalStatus, getAllHospitals, getAllTransactions, getApprovedHospitals } = require('../controllers/adminController');
const { protect, authorize, admin } = require('../middleware/authMiddleware');

router.get('/hospitals/approved', getApprovedHospitals);

// All routes here are protected and restricted to admin
router.use(protect);
router.use(authorize('admin'));

router.get('/hospitals', getAllHospitals);
router.get('/hospitals/pending', getPendingHospitals);
router.get('/transactions', getAllTransactions);
router.put('/hospitals/:id/status', updateHospitalStatus);

module.exports = router;

