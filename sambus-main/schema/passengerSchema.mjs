import mongoose from 'mongoose';
import { phonePattern } from './schemaConstants.mjs';

const passengerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  seatNumber: {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    trim: true,
    required: [true, 'Phone Number is required'],
    match: phonePattern,
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 5000,
  },
  isPaid: {
    type: Boolean,
    default: false
  }
});

export const passengerModel = mongoose.model('Passenger', passengerSchema);