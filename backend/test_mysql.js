require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
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
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('MySQL Connection successful!');
    } catch (error) {
        console.error('MySQL connection failed:', error.message);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

testConnection();
