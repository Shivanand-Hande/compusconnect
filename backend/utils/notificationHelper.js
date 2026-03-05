const { Notification, User } = require('../models');

const createNotification = async (io, { recipientId, title, message, type }) => {
    try {
        const notification = await Notification.create({
            recipientId,
            title,
            message,
            type,
            isRead: false
        });

        // Emit socket event if io is provided
        if (io) {
            io.to(`user_${recipientId}`).emit('new_notification', notification);
        }

        return notification;
    } catch (err) {
        console.error('Failed to create notification:', err);
    }
};

const notifyAdmins = async (io, { title, message, type }) => {
    const admins = await User.findAll({ where: { role: 'Super Admin' } });
    for (const admin of admins) {
        await createNotification(io, { recipientId: admin.id, title, message, type });
    }
};

module.exports = { createNotification, notifyAdmins };
