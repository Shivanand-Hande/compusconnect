const express = require('express');
const router = express.Router();
const {
    createEvent,
    getEvents,
    getEventById,
    registerForEvent
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.route('/')
    .get(getEvents)
    .post(protect, authorize('Club Admin', 'Super Admin'), upload.single('banner'), createEvent);

router.get('/:id', getEventById);

router.post('/:id/register', protect, registerForEvent);

module.exports = router;
