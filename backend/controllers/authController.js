const { User, Club } = require('../models');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ message: 'Request body is missing' });
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ where: { email } });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password, role });
        if (user) {
            res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ message: 'Server error during registration', error: err.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ message: 'Request body is missing' });
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (user && (await user.matchPassword(password))) {
            const club = await Club.findOne({ where: { adminId: user.id } });
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                club: club ? club.id : null,
                token: generateToken(user.id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Server error during login', error: err.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const { Registration, Event, Club } = require('../models');
    const userClub = await Club.findOne({ where: { adminId: req.user.id } });
    const registrations = await Registration.findAll({
        where: { userId: req.user.id },
        include: [{
            model: Event,
            as: 'event',
            include: [{ model: Club, as: 'club', attributes: ['name'] }]
        }]
    });

    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        club: userClub ? userClub.id : null,
        enrolledClubs: await req.user.getClubs(),
        registrations
    });
};

module.exports = { registerUser, loginUser, getUserProfile };
