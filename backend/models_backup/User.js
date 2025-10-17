const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['plumbing', 'electrical', 'cleaning', 'carpentry', 'painting', 'other']
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  priceType: {
    type: String,
    enum: ['hourly', 'fixed', 'sqft'],
    default: 'fixed'
  },
  location: {
    city: String,
    state: String
  },
  images: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);