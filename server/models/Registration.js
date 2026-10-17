const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Event = require('./Event');

const Registration = sequelize.define(
  'Registration',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Event,
        key: 'id',
      },
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rollNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentScreenshotUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'verified', 'rejected'),
      defaultValue: 'pending',
    },
  },
  {
    timestamps: true,
    tableName: 'registrations',
  }
);

// Association setup
Registration.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });
Event.hasMany(Registration, { foreignKey: 'eventId', as: 'registrations' });

// Compatibility getter so frontend `_id` continues to work cleanly
Registration.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = Registration;
