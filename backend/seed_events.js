const { Event, Club, User } = require('./models');
const { sequelize } = require('./config/db');

async function seedEvents() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database...');

        // Find or create a club admin
        let admin = await User.findOne({ where: { role: 'Club Admin' } });
        if (!admin) {
            admin = await User.create({
                name: 'Club Admin',
                email: 'club@example.com',
                password: 'password123',
                role: 'Club Admin'
            });
        }

        // Find or create a club
        let club = await Club.findOne();
        if (!club) {
            club = await Club.create({
                name: 'Coding Club',
                description: 'A club for developers',
                adminId: admin.id,
                isApproved: true
            });
        }

        const eventsData = [
            {
                title: 'Upcoming Tech Talk',
                description: 'A look into the future of AI',
                date: '2026-04-15',
                time: '10:00 AM',
                venue: 'Main Hall',
                status: 'Upcoming',
                clubId: club.id
            },
            {
                title: 'Ongoing Hackathon',
                description: 'Building the next big thing',
                date: '2026-03-03', // Today
                time: '09:00 AM',
                venue: 'Computer Lab',
                status: 'Ongoing',
                clubId: club.id
            },
            {
                title: 'Completed Workshop',
                description: 'Learn React in a day',
                date: '2026-02-10',
                time: '02:00 PM',
                venue: 'Seminar Room',
                status: 'Completed',
                clubId: club.id
            }
        ];

        for (const data of eventsData) {
            const exists = await Event.findOne({ where: { title: data.title } });
            if (!exists) {
                await Event.create(data);
                console.log(`Created event: ${data.title}`);
            } else {
                console.log(`Event already exists: ${data.title}`);
                // Update status just in case
                exists.status = data.status;
                await exists.save();
            }
        }

        console.log('Seeding completed.');
    } catch (err) {
        console.error('Error seeding events:', err);
    } finally {
        process.exit();
    }
}

seedEvents();
