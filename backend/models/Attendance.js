const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Attendance = sequelize.define('Attendance', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    scannedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Attendance;
