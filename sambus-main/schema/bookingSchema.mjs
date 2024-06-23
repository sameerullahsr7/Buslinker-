import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
  passengers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Passenger',
    required: true
  }],
  isBooked: {
    type: Boolean,
    default: false
  }
});

export const bookingModel = mongoose.model('Booking', bookingSchema);