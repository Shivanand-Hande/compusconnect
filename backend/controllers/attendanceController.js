const { Attendance, Event, User, Registration, Club } = require('../models');
const { generateCertificate } = require('../utils/pdfGenerator');

// @desc    Mark attendance via QR scan
// @route   POST /api/attendance/scan
// @access  Private (Student/Admin)
const markAttendance = async (req, res) => {
    if (!req.body) return res.status(400).json({ message: 'Request body is missing' });
    const { qrData } = req.body;

    if (!qrData) return res.status(400).json({ message: 'No QR data provided' });

    const [type, id] = qrData.split(':');

    if (type === 'attendance') {
        const eventId = id;
        const userId = req.user.id;

        const event = await Event.findByPk(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const registration = await Registration.findOne({ where: { eventId, userId, status: 'Approved' } });
        if (!registration) return res.status(400).json({ message: 'You are not approved for this event' });

        const existingAttendance = await Attendance.findOne({ where: { eventId, userId } });
        if (existingAttendance) return res.status(400).json({ message: 'Attendance already marked' });

        const attendance = await Attendance.create({ eventId, userId });
        res.status(201).json(attendance);

    } else if (type === 'register') {
        const registrationId = id;
        const registration = await Registration.findByPk(registrationId, {
            include: [{ model: User, as: 'user' }, { model: Event, as: 'event' }]
        });

        if (!registration) return res.status(404).json({ message: 'Registration not found' });

        const existingAttendance = await Attendance.findOne({
            where: { eventId: registration.eventId, userId: registration.userId }
        });
        if (existingAttendance) return res.status(400).json({ message: 'Attendance already marked' });

        const attendance = await Attendance.create({
            eventId: registration.eventId,
            userId: registration.userId
        });
        res.status(201).json({ message: `Attendance marked for ${registration.user.name}`, attendance });
    } else {
        res.status(400).json({ message: 'Invalid QR code' });
    }
};

// @desc    Get attendance for an event

// @access  Private (Club Admin / Super Admin)
const getEventAttendance = async (req, res) => {
    const attendance = await Attendance.findAll({
        where: { eventId: req.params.eventId },
        include: [{ model: User, as: 'user', attributes: ['name', 'email', 'avatar'] }]
    });
    res.json(attendance);
};

// @desc    Download certificate

// @access  Private
const downloadCertificate = async (req, res) => {
    const userId = req.user.id;
    const eventId = req.params.eventId;

    const attendance = await Attendance.findOne({
        where: { eventId, userId },
        include: [
            { model: User, as: 'user' },
            {
                model: Event,
                as: 'event',
                include: [{ model: Club, as: 'club' }]
            }
        ]
    });

    if (!attendance) {
        return res.status(400).json({ message: 'Attendance record not found.' });
    }

    generateCertificate(res, {
        userName: attendance.user.name,
        eventName: attendance.event.title,
        date: attendance.event.date,
        clubName: attendance.event.club.name
    });
};

// @desc    Get all attendance for the logged-in user
// @route   GET /api/attendance/my-attendance
// @access  Private
const getMyAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: Event,
                    as: 'event',
                    include: [{ model: Club, as: 'club' }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching attendance' });
    }
};

module.exports = {
    markAttendance,
    getEventAttendance,
    downloadCertificate,
    getMyAttendance
};
