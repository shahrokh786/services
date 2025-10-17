const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure unique chat between two users for a booking
chatSchema.index({ participants: 1, booking: 1 }, { unique: true });

module.exports = mongoose.model('Chat', chatSchema);