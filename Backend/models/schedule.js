const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  activityName: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: String,
    required: true,
  },
  progress: {
    type: Number,
    default: 0, // Initial progress is set to 0%
  },
  photoURL: {
    type: String,
    default: null, // You can store the URL to the attached photo here
  },
  comments: [{
    type: String,
  }]
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = {
    Schedule
};
