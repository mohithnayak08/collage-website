const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL;

let sequelize;

if (connectionString) {
  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  console.warn(
    'WARNING: DATABASE_URL is not set in environment variables! Using uninitialized placeholder. Ensure DATABASE_URL is added to Vercel Environment Variables.'
  );
  sequelize = new Sequelize('postgres://localhost:5432/placeholder', {
    dialect: 'postgres',
    logging: false,
  });
}

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  if (!connectionString) {
    console.warn('DATABASE_URL is missing. Skipping database connection. Check Vercel Environment Variables.');
    return;
  }
  try {
    await sequelize.authenticate();
    isConnected = true;
    console.log('NeonDB (PostgreSQL) connected successfully.');
    await sequelize.sync({ alter: false });
    console.log('Database tables verified.');
  } catch (error) {
    console.error('Unable to connect to NeonDB:', error.message);
  }
};

module.exports.sequelize = sequelize;
module.exports.connectDB = connectDB;
module.exports.default = sequelize;
