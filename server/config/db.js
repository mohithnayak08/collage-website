const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not set in environment variables');
  process.exit(1);
}

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false, // Set to console.log if you want SQL query debugging
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('NeonDB (PostgreSQL) connected successfully.');
    // Synchronize schemas with the database
    await sequelize.sync({ alter: true });
    console.log('Database tables synchronized.');
  } catch (error) {
    console.error('Unable to connect to NeonDB:', error.message);
  }
};

module.exports.sequelize = sequelize;
module.exports.connectDB = connectDB;
module.exports.default = sequelize;
