const express = require('express');
const router = express.Router();
const { createCase, getAllCases, getCaseDetails, updateCaseStatus, getHospitalCases } = require('../controllers/caseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllCases);
router.get('/hospital/pending', protect, authorize('hospital'), getHospitalCases);
router.get('/:id', getCaseDetails);
router.post('/', protect, authorize('patient'), createCase);
router.patch('/:id/status', protect, authorize('hospital', 'admin'), updateCaseStatus);

module.exports = router;
