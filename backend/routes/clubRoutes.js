const express = require('express');
const router = express.Router();
const {
    createClub,
    getClubs,
    getClubById,
    approveClub,
    addMember,
    getMyClub
} = require('../controllers/clubController');
const { getEventsByClub } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/my-club', protect, getMyClub);

router.route('/')
    .get(getClubs)
    .post(protect, upload.single('logo'), createClub);

router.get('/:id', getClubById);
router.get('/:clubId/events', getEventsByClub);

router.put('/:id/approve', protect, authorize('Super Admin'), approveClub);

router.post('/:id/members', protect, addMember);

module.exports = router;
