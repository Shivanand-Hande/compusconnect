const { User, Club } = require('./models');
const { sequelize } = require('./config/db');

async function check() {
    try {
        await sequelize.authenticate();
        const users = await User.findAll();
        const clubs = await Club.findAll();
        console.log('Users:', JSON.stringify(users.map(u => ({ id: u.id, email: u.email, role: u.role })), null, 2));
        console.log('Clubs:', JSON.stringify(clubs.map(c => ({ id: c.id, name: c.name, adminId: c.adminId, isApproved: c.isApproved })), null, 2));
    } catch (err) {
        console.error('Error checking DB:', err);
    } finally {
        process.exit();
    }
}

check();
