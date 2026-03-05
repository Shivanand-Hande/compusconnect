const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = ['uploads/logo', 'uploads/banner', 'uploads/announcements'];
uploadDirs.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dest = 'uploads/';
        if (file.fieldname === 'logo') dest += 'logo/';
        else if (file.fieldname === 'banner' || file.fieldname === 'image') dest += 'banner/';
        else dest += 'announcements/';

        const fullPath = path.join(__dirname, '..', dest);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
        cb(null, fullPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) return cb(null, true);
        cb(new Error('Only images are allowed (jpeg, jpg, png)'));
    }
});

module.exports = { upload };
