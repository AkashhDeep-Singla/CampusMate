const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
        match: [/^[a-zA-Z\s]+$/, 'Can only contain alphabets and spaces']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
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
    role: {
        type: String,
        default: 'Student'
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    enrollmentID: {
        type: Number,
        required: [true, 'Enrollment ID is required'],
        unique: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v.toString());
            },
            message: 'Enrollment ID must be an 10-digit number'
        }
    },
    avatar: {
        public_id: {
            type: String,
            default: ''
        },
        url: {
            type: String,
            validate: {
                validator: function (v) {
                    return v === '' || /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(v);
                },
                message: 'Invalid avatar URL'
            }
        }
    },
    qrCode: {
        type: String,
        required: [true, 'QR Code is required'],
        unique: true
    },
    token: {
        type: String
    },
    newsletter: {
        type: String,
        enum: ['YES', 'NO'],
        default: 'NO'
    },
    messEntry: {
        type: String,
        enum: {
            values: ['IN', 'OUT'],
            message: 'Mess entry must be either IN or OUT'
        },
        default: 'OUT'
    },
    gateEntry: {
        type: String,
        enum: {
            values: ['IN', 'OUT', 'IN-OUT'],
            message: 'Mess entry must be either IN , OUT or IN-OUT'
        },
        default: 'IN'
    },
    img: {
        type: String,
        required: true
    }
}, { timestamps: true });


studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

studentSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);