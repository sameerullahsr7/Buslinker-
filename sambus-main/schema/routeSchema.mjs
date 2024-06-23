import mongoose from 'mongoose';
const routeSchema = new mongoose.Schema({
    origin: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    bus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 5000,
    },
    availableSeats: {
      type: Number,
      required: true,
    }
  });
  
export const routeModel = mongoose.model('Route', routeSchema);  