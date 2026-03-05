const { User } = require('./models');
const { sequelize } = require('./config/db');

async function promote() {
    try {
        await sequelize.authenticate();
        const user = await User.findOne({ where: { email: 'test@example.com' } });
        if (user) {
            user.role = 'Super Admin';
            await user.save();
            console.log('User test@example.com promoted to Super Admin');
        } else {
            console.log('User test@example.com not found');
        }
    } catch (err) {
        console.error('Error promoting user:', err);
    } finally {
        process.exit();
    }
}

promote();
