const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        match: [/^[a-zA-Z\s]+$/, 'Can only contain alphabets and spaces']
    },
    lastName: {
        type: String,
        trim: true,
        match: [/^[a-zA-Z\s]+$/, 'Can only contain alphabets and spaces']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                return emailRegex.test(v);
            },
            message: 'Please provide a valid email address'
        }
    },
    enrollmentNumber: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Female', 'Male'],
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true,
        match: [/^[a-zA-Z\s]+$/, 'Can only contain alphabets and spaces']
    },
    state: {
        type: String,
        required: true,
        match: [/^[a-zA-Z\s]+$/, 'Can only contain alphabets and spaces']
    },
    country: {
        type: String,
        required: true,
        trim: true,
        match: [/^[a-zA-Z\s]+$/, 'Can only contain alphabets and spaces']
    },
    parentname: {
        type: String,
        required: true,
        trim: true,
        match: [/^[a-zA-Z\s]+$/, 'Can only contain alphabets and spaces']
    },
    parentphone: {
        type: String,
        required: true,
        unique: true
    },
    parentEmail: {
        type: String,
        lowercase: true,
        validate: {
            validator: function (v) {
                const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                return emailRegex.test(v);
            },
            message: 'Please provide a valid email address'
        }
    },
    roomtype: {
        type: String,
        required: true,
        enum: ['Attach Bathroom Non AC', 'Common Bathroom Non AC', 'Attach Bathroom With AC', 'Common Bathroom With AC'],
    },
    hostelname: {
        type: String,
        required: true
    },
    roomseater: {
        type: String,
        required: true,
        enum: ['1', '2', '3', '4'],
    },
    roomfloor: {
        type: String,
        required: true,
        enum: ['1', '2', '3', '4', '5', '6', '7', '8'],
    },
}, { timestamps: true });

module.exports = mongoose.model('reservation', reservationSchema);