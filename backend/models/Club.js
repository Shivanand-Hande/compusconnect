const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Club = sequelize.define('Club', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    logo: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Club;
