const { Event, Registration, Club, User } = require('../models');
const { generateQRCode } = require('../utils/qrGenerator');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Club Admin / Super Admin)
const createEvent = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ message: 'Request body is missing' });
        const { title, description, date, time, venue, registrationLimit, clubId } = req.body;

        const club = await Club.findByPk(clubId);
        if (!club) return res.status(404).json({ message: 'Club not found' });

        if (req.user.role !== 'Super Admin' && club.adminId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to create events for this club' });
        }

        const banner = req.file ? `uploads/banner/${req.file.filename}` : '';

        const event = await Event.create({
            title,
            description,
            date,
            time,
            venue,
            registrationLimit: registrationLimit || 0,
            banner,
            clubId
        });

        event.qrCode = await generateQRCode(`attendance:${event.id}`);
        await event.save();

        res.status(201).json(event);
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ message: 'Failed to create event', error: err.message });
    }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    const events = await Event.findAll({
        include: [{ model: Club, as: 'club', attributes: ['name', 'logo'] }]
    });
    res.json(events);
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
    const event = await Event.findByPk(req.params.id, {
        include: [
            { model: Club, as: 'club', attributes: ['name', 'logo', 'adminId'] },
            {
                model: Registration,
                include: [{ model: User, as: 'user', attributes: ['name', 'email', 'avatar'] }]
            }
        ]
    });

    if (event) {
        res.json(event);
    } else {
        res.status(404).json({ message: 'Event not found' });
    }
};

// @desc    Register for event (RSVP)
// @route   POST /api/events/:id/register
// @access  Private (Student)
const registerForEvent = async (req, res) => {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const registrationCount = await Registration.count({ where: { eventId: event.id } });
    if (event.registrationLimit > 0 && registrationCount >= event.registrationLimit) {
        return res.status(400).json({ message: 'Registration limit reached' });
    }

    const existingReg = await Registration.findOne({ where: { eventId: event.id, userId: req.user.id } });
    if (existingReg) return res.status(400).json({ message: 'Already registered for this event' });

    const registration = await Registration.create({
        eventId: event.id,
        userId: req.user.id,
        status: 'Approved' // For now, auto-approve
    });

    registration.qrCode = await generateQRCode(`register:${registration.id}`);
    await registration.save();

    res.status(201).json(registration);
};

// @desc    Get events for a specific club
// @route   GET /api/clubs/:clubId/events
// @access  Public
const getEventsByClub = async (req, res) => {
    try {
        const events = await Event.findAll({
            where: { clubId: req.params.clubId },
            include: [{ model: Club, as: 'club', attributes: ['name', 'logo'] }]
        });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    createEvent,
    getEvents,
    getEventById,
    registerForEvent,
    getEventsByClub
};
