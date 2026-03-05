const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Registration = sequelize.define('Registration', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
        defaultValue: 'Pending'
    },
    qrCode: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Registration;
