const { User } = require('./models');
const { sequelize } = require('./config/db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database...');

        const email = 'admin@campusconnect.com';
        const password = 'adminpassword123';

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log('Admin user already exists. Updating role to Super Admin...');
            existingUser.role = 'Super Admin';
            await existingUser.save();
            console.log('Role updated.');
        } else {
            console.log('Creating new Super Admin user...');
            // Note: beforeCreate hook in User model will hash the password
            await User.create({
                name: 'System Admin',
                email: email,
                password: password,
                role: 'Super Admin'
            });
            console.log('Admin user created successfully.');
            console.log('Email: ' + email);
            console.log('Password: ' + password);
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}

createAdmin();
