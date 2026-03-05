const express = require('express');
const router = express.Router();
const {
    markAttendance,
    getEventAttendance,
    downloadCertificate,
    getMyAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/scan', protect, markAttendance);
router.get('/my-attendance', protect, getMyAttendance);
router.get('/event/:eventId', protect, authorize('Club Admin', 'Super Admin'), getEventAttendance);
router.get('/certificate/:eventId', protect, downloadCertificate);

module.exports = router;
