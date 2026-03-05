const { Notification } = require('../models');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
    const notifications = await Notification.findAll({
        where: { recipientId: req.user.id },
        order: [['createdAt', 'DESC']]
    });
    res.json(notifications);
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    const notification = await Notification.findByPk(req.params.id);
    if (notification && (notification.recipientId === req.user.id || req.user.role === 'Super Admin')) {
        notification.isRead = true;
        await notification.save();
        res.json({ message: 'Notification marked as read' });
    } else {
        res.status(404).json({ message: 'Notification not found' });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
    await Notification.update({ isRead: true }, { where: { recipientId: req.user.id } });
    res.json({ message: 'All notifications marked as read' });
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
    const notification = await Notification.findByPk(req.params.id);
    if (notification && (notification.recipientId === req.user.id || req.user.role === 'Super Admin')) {
        await notification.destroy();
        res.json({ message: 'Notification deleted' });
    } else {
        res.status(404).json({ message: 'Notification not found' });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
};
