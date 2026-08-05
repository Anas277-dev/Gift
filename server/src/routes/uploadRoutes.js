const express = require('express');
const multer = require('multer');
const { uploadImage } = require('../controllers/uploadController');
const { authenticateToken } = require('../middlewares/auth');
const checkRole = require('../middlewares/roleCheck');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  checkRole(['SHOP_MANAGER', 'SUPER_ADMIN']),
  upload.single('image'),
  uploadImage
);

module.exports = router;
