const { Announcement, User, Club } = require('./models');
const { sequelize } = require('./config/db');

async function seedAnnouncements() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database...');

        let admin = await User.findOne({ where: { role: 'Super Admin' } });
        if (!admin) {
            // Create a super admin if none exists
            admin = await User.create({
                name: 'System Admin',
                email: 'admin@campusconnect.com',
                password: 'adminpassword123',
                role: 'Super Admin'
            });
        }

        let club = await Club.findOne();
        if (!club) {
            // Create a club if none exists
            club = await Club.create({
                name: 'Coding Club',
                description: 'A club for developers',
                adminId: admin.id,
                isApproved: true
            });
        }

        const announcementsData = [
            {
                title: 'Welcome to CampusConnect!',
                content: 'We are excited to launch the new college management portal. Explore clubs, events, and more!',
                type: 'College',
                senderId: admin.id
            },
            {
                title: 'Coding Club Meeting',
                content: 'There will be a mandatory meeting for all members this Friday at 4 PM in the Lab.',
                type: 'Club',
                clubId: club.id,
                senderId: admin.id
            },
            {
                title: 'Annual Sports Meet 2026',
                content: 'Registration for the sports meet is now open! Please check the events section for details.',
                type: 'College',
                senderId: admin.id
            }
        ];

        for (const data of announcementsData) {
            const exists = await Announcement.findOne({ where: { title: data.title } });
            if (!exists) {
                await Announcement.create(data);
                console.log(`Created announcement: ${data.title}`);
            } else {
                console.log(`Announcement already exists: ${data.title}`);
            }
        }

        console.log('Seeding announcements completed.');
    } catch (err) {
        console.error('Error seeding announcements:', err);
    } finally {
        process.exit();
    }
}

seedAnnouncements();
