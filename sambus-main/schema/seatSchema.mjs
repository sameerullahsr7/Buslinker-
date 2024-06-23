import mongoose from 'mongoose';
const seatSchema = new mongoose.Schema({
    seatNumber: {
      type: String,
      required: true,
    },
    passenger: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Passenger',
        required: true
    }],
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: true,
    },
  });
export const seatModel = mongoose.model('Seat', seatSchema);