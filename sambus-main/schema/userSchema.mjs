import mongoose from 'mongoose';
import { profilePicturePattern, emailPattern } from './schemaConstants.mjs';

const userSchema = new mongoose.Schema({
    profilePhoto: {
        type: String,
        default: '',
        maxlength: 1000,
        match: profilePicturePattern,
    },
    userName: {
        type: String,
        default: '',
        maxlength: 50,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        minlength: 3,
        maxlength: 100,
        trim: true,
        match: emailPattern,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    isSuspended: {
        type: Boolean,
        default: false,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
});
userSchema.pre('save', function (next) {
    if (this.email) {
        this.email = this.email.toLowerCase();
    }
    next();
});

export const userModel = mongoose.model('users', userSchema);

