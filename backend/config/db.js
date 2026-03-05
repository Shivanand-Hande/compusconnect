const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = process.env.MYSQL_HOST ? new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            }
        }
    }
) : new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: false
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`${sequelize.getDialect().toUpperCase()} Connected via Sequelize...`);
    } catch (err) {
        console.error('Unable to connect to the database:', err.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
