const User = require('./User');
const Club = require('./Club');
const Event = require('./Event');
const Registration = require('./Registration');
const Attendance = require('./Attendance');
const Announcement = require('./Announcement');
const Notification = require('./Notification');

// User <-> Club (Admin relationship)
User.hasOne(Club, { as: 'ManagedClub', foreignKey: 'adminId' });
Club.belongsTo(User, { as: 'admin', foreignKey: 'adminId' });

// Club <-> Member relationship (Many-to-Many)
User.belongsToMany(Club, { through: 'ClubMembers' });
Club.belongsToMany(User, { through: 'ClubMembers', as: 'members' });

// Club <-> Event
Club.hasMany(Event, { foreignKey: 'clubId' });
Event.belongsTo(Club, { foreignKey: 'clubId', as: 'club' });

// Event <-> Attendee relationship (Many-to-Many via Registration)
User.hasMany(Registration, { foreignKey: 'userId' });
Registration.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Event.hasMany(Registration, { foreignKey: 'eventId' });
Registration.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

// Attendance
User.hasMany(Attendance, { foreignKey: 'userId' });
Attendance.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Event.hasMany(Attendance, { foreignKey: 'eventId' });
Attendance.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

// Announcements
User.hasMany(Announcement, { foreignKey: 'senderId' });
Announcement.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });

Club.hasMany(Announcement, { foreignKey: 'clubId' });
Announcement.belongsTo(Club, { as: 'club', foreignKey: 'clubId' });

// Notifications
User.hasMany(Notification, { foreignKey: 'recipientId' });
Notification.belongsTo(User, { as: 'recipient', foreignKey: 'recipientId' });

module.exports = {
    User,
    Club,
    Event,
    Registration,
    Attendance,
    Announcement,
    Notification
};
