const { Announcement, User, Club } = require('../models');
const { createNotification } = require('../utils/notificationHelper');

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private (Club Admin / Super Admin)
const createAnnouncement = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ message: 'Request body is missing' });
        const { title, content, type, clubId } = req.body;

        const announcement = await Announcement.create({
            title,
            content,
            type,
            clubId: type === 'Club' ? clubId : null,
            senderId: req.user.id
        });

        const populated = await Announcement.findByPk(announcement.id, {
            include: [
                { model: User, as: 'sender', attributes: ['name'] },
                { model: Club, as: 'club', attributes: ['name'] }
            ]
        });

        // Notify via socket and create in DB
        const io = req.app.get('io');
        if (type === 'College') {
            io.emit('new_announcement', populated);
            // Optional: notify all users via DB?
        } else if (type === 'Club') {
            io.to(`club_${clubId}`).emit('new_announcement', populated);

            // Create notifications for all club members
            const club = await Club.findByPk(clubId, {
                include: [{ model: User, as: 'members', attributes: ['id'] }]
            });
            if (club && club.members) {
                for (const member of club.members) {
                    await createNotification(io, {
                        recipientId: member.id,
                        title: `New Club Announcement: ${club.name}`,
                        message: title,
                        type: 'Club'
                    });
                }
            }
        }

        res.status(201).json(populated);
    } catch (err) {
        console.error('Create Announcement Error:', err);
        res.status(500).json({ message: 'Server error creating announcement', error: err.message });
    }
};

// @desc    Get announcements
// @route   GET /api/announcements
// @access  Public
const getAnnouncements = async (req, res) => {
    const announcements = await Announcement.findAll({
        order: [['createdAt', 'DESC']],
        include: [
            { model: User, as: 'sender', attributes: ['name'] },
            { model: Club, as: 'club', attributes: ['name'] }
        ]
    });
    res.json(announcements);
};

module.exports = { createAnnouncement, getAnnouncements };
