import mongoose from 'mongoose';
const busSchema = new mongoose.Schema({
    busNumber: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    }
  });
export const busModel = mongoose.model('Bus', busSchema);
