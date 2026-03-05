const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    venue: {
        type: DataTypes.STRING,
        allowNull: false
    },
    registrationLimit: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    banner: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    status: {
        type: DataTypes.ENUM('Upcoming', 'Ongoing', 'Completed'),
        defaultValue: 'Upcoming'
    },
    qrCode: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Event;
