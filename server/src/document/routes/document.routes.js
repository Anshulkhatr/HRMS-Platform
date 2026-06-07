const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../config/cloudinary');
const config = require('../../config/env');
const documentController = require('../controllers/document.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const path = require('path');
const fs = require('fs');

const router = express.Router();

let storage;

if (config.cloudinary.cloudName && config.cloudinary.apiKey) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'hrms_documents',
      resource_type: 'auto', // Automatically detect and allow all resource types (image, video, raw document, etc.)
    },
  });
} else {
  // Local storage fallback
  const uploadDir = path.join(__dirname, '../../../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
}

const upload = multer({ storage: storage });

router.use(authMiddleware);

router.post('/upload', upload.single('file'), documentController.uploadFile);
router.get('/', documentController.getDocuments);
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
