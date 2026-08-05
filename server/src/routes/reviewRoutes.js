const express = require('express');
const {
  getProductReviews,
  addReview,
  adminGetReviews,
  adminApproveReview,
  adminDeleteReview,
} = require('../controllers/reviewController');
const { authenticateToken } = require('../middlewares/auth');
const checkRole = require('../middlewares/roleCheck');

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', authenticateToken, addReview);

// Admin Routes
router.get(
  '/admin/all',
  authenticateToken,
  checkRole(['SHOP_MANAGER', 'SUPER_ADMIN']),
  adminGetReviews
);
router.put(
  '/admin/:id/approve',
  authenticateToken,
  checkRole(['SHOP_MANAGER', 'SUPER_ADMIN']),
  adminApproveReview
);
router.delete(
  '/admin/:id',
  authenticateToken,
  checkRole(['SHOP_MANAGER', 'SUPER_ADMIN']),
  adminDeleteReview
);

module.exports = router;
