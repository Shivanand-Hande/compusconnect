const { User, Club, Event, Attendance } = require('../models');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Super Admin)
const getStats = async (req, res) => {
    const totalStudents = await User.count({ where: { role: 'Student' } });
    const totalClubs = await Club.count();
    const approvedClubs = await Club.count({ where: { isApproved: true } });
    const totalEvents = await Event.count();

    // Get participation growth (last 6 months)
    const participationData = await Attendance.findAll({
        attributes: [
            [sequelize.fn('strftime', '%m', sequelize.col('createdAt')), 'month'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['month'],
        order: [['month', 'ASC']]
    });

    // Fetch upcoming events
    const upcomingEvents = await Event.findAll({
        where: { date: { [Op.gte]: new Date() } },
        limit: 3,
        order: [['date', 'ASC']]
    });

    res.json({
        totalStudents,
        totalClubs,
        approvedClubs,
        totalEvents,
        participationData,
        upcomingEvents
    });
};

// @desc    Get all activities (recent)
// @route   GET /api/admin/activity
// @access  Private (Super Admin)
const getRecentActivity = async (req, res) => {
    const recentClubs = await Club.findAll({
        limit: 50,
        order: [['createdAt', 'DESC']],
        include: [{ model: User, as: 'admin', attributes: ['name'] }]
    });
    const recentEvents = await Event.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [{ model: Club, as: 'club', attributes: ['name'] }]
    });

    res.json({
        recentClubs,
        recentEvents
    });
};

const { createNotification } = require('../utils/notificationHelper');

const approveClub = async (req, res) => {
    const club = await Club.findByPk(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    club.isApproved = true;
    await club.save();

    const user = await User.findByPk(club.adminId);
    if (user.role === 'Student') {
        user.role = 'Club Admin';
        await user.save();
    }

    // Notify user
    const io = req.app.get('io');
    await createNotification(io, {
        recipientId: club.adminId,
        title: 'Club Approved!',
        message: `Congratulations! Your club '${club.name}' has been approved.`,
        type: 'System'
    });

    res.json({ message: 'Club approved successfully', club });
};

const rejectClub = async (req, res) => {
    const club = await Club.findByPk(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    await club.destroy();
    res.json({ message: 'Club application rejected' });
};

module.exports = { getStats, getRecentActivity, approveClub, rejectClub };
