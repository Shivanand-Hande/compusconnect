const { Club, User } = require('../models');
const { createNotification, notifyAdmins } = require('../utils/notificationHelper');

// @desc    Create a new club request
// @route   POST /api/clubs
// @access  Private (Student/Admin)
const createClub = async (req, res) => {
    try {
        console.log('Creating club:', req.body);
        if (!req.body) return res.status(400).json({ message: 'Request body is missing' });
        const { name, description, category } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: 'Name and description are required' });
        }

        const clubExists = await Club.findOne({ where: { name } });
        if (clubExists) {
            console.log('Club exists:', name);
            return res.status(400).json({ message: 'Club name already exists' });
        }

        const logo = req.file ? `uploads/logo/${req.file.filename}` : '';

        const club = await Club.create({
            name,
            description,
            category,
            logo,
            adminId: req.user.id
        });

        if (club) {
            // Add creator as the first member
            await club.addMember(req.user);

            // Notify Admins
            const io = req.app.get('io');
            await notifyAdmins(io, {
                title: 'New Club Request',
                message: `${req.user.name} requested to start a new club: ${name}`,
                type: 'System'
            });

            res.status(201).json(club);
        } else {
            res.status(400).json({ message: 'Invalid club data' });
        }
    } catch (err) {
        console.error('Create Club Error:', err);
        res.status(500).json({ message: 'Server error creating club', error: err.message });
    }
};

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
const getClubs = async (req, res) => {
    try {
        const clubs = await Club.findAll({
            where: { isApproved: true },
            include: [{ model: User, as: 'admin', attributes: ['name', 'email'] }]
        });
        res.json(clubs);
    } catch (err) {
        console.error('Get Clubs Error:', err);
        res.status(500).json({ message: 'Server error fetching clubs', error: err.message });
    }
};

// @desc    Get club by ID
// @route   GET /api/clubs/:id
// @access  Public
const getClubById = async (req, res) => {
    const club = await Club.findByPk(req.params.id, {
        include: [
            { model: User, as: 'admin', attributes: ['name', 'email'] },
            { model: User, as: 'members', attributes: ['name', 'email', 'avatar'], through: { attributes: [] } }
        ]
    });

    if (club) {
        res.json(club);
    } else {
        res.status(404).json({ message: 'Club not found' });
    }
};

// @desc    Approve a club
// @route   PUT /api/clubs/:id/approve
// @access  Private (Super Admin)
const approveClub = async (req, res) => {
    const club = await Club.findByPk(req.params.id);

    if (club) {
        club.isApproved = true;
        await club.save();

        const user = await User.findByPk(club.adminId);
        if (user.role === 'Student') {
            user.role = 'Club Admin';
            await user.save();
        }

        res.json(club);
    } else {
        res.status(404).json({ message: 'Club not found' });
    }
};

// @desc    Add member to club
// @route   POST /api/clubs/:id/members
// @access  Private
const addMember = async (req, res) => {
    const club = await Club.findByPk(req.params.id);

    if (club) {
        const isMember = await club.hasMember(req.user.id);
        if (isMember) return res.status(400).json({ message: 'Already a member' });

        await club.addMember(req.user);
        res.json({ message: 'Member added successfully' });
    } else {
        res.status(404).json({ message: 'Club not found' });
    }
};

// @desc    Get current user's club
// @route   GET /api/clubs/my-club
// @access  Private (Club Admin)
const getMyClub = async (req, res) => {
    try {
        const club = await Club.findOne({
            where: { adminId: req.user.id },
            include: [
                { model: User, as: 'admin', attributes: ['name', 'email'] },
                { model: User, as: 'members', attributes: ['name', 'email', 'avatar'], through: { attributes: [] } }
            ]
        });
        if (club) {
            res.json(club);
        } else {
            res.status(404).json({ message: 'Club not found for this user' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    createClub,
    getClubs,
    getClubById,
    approveClub,
    addMember,
    getMyClub
};
