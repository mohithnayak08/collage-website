const { DataTypes } = require('sequelize');
const db = require('../config/db');

const sequelize = db.sequelize || db.default;

const Event = sequelize.define(
  'Event',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fee: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    upiId: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    qrCodeUrl: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: 'events',
  }
);

// Compatibility getter so frontend `_id` continues to work cleanly
Event.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = Event;
