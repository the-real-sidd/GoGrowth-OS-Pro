const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true
  },
  assignedTo: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Not Started', 'Pending', 'In progress', 'Completed'],
    default: 'Not Started'
  },
  client: {
    type: String,
    required: true
  },
  assignedOn: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date,
    required: true
  },
  completedOn: {
    type: Date,
    default: null
  },
  remarks: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  description: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate turnaround time
taskSchema.methods.getTurnaroundTime = function() {
  if (!this.completedOn) return null;
  const timeDiff = new Date(this.completedOn) - new Date(this.assignedOn);
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return days;
};

module.exports = mongoose.model('Task', taskSchema);
