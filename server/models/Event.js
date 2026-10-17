const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide an event description'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Please provide an event date'],
    },
    time: {
      type: String,
      required: [true, 'Please provide event time'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Please provide a venue'],
      trim: true,
    },
    fee: {
      type: Number,
      required: [true, 'Please provide a registration fee (0 if free)'],
      default: 0,
    },
    upiId: {
      type: String,
      trim: true,
      default: '',
    },
    qrCodeUrl: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', EventSchema);
