const mongoose = require('mongoose');

const potholeSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  }, 
  numberOfPotholes: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Pothole = mongoose.model('Pothole', potholeSchema);

module.exports = Pothole;