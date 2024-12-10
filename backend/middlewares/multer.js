const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: "dhwaifalx",
    api_key: "651532951972956",
    api_secret: "paYSikvw8oYgs8o6bNLwu0yl3x8",
});

// Configure Cloudinary Storage for Multer
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'campusMate',
        allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed formats
    },
});

const upload = multer({ storage: cloudinaryStorage });

module.exports = upload; 
