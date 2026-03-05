const express = require('express');
const router = express.Router();
const { getStats, getRecentActivity, approveClub, rejectClub } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('Super Admin'), getStats);
router.get('/activity', protect, authorize('Super Admin'), getRecentActivity);
router.put('/approve/:id', protect, authorize('Super Admin'), approveClub);
router.delete('/reject/:id', protect, authorize('Super Admin'), rejectClub);

module.exports = router;
