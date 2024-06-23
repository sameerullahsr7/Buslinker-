import mongoose from 'mongoose';
const companySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: true
    }
})

export const companyModel = mongoose.model('Company', companySchema);