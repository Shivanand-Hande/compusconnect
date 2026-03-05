const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Notification;
