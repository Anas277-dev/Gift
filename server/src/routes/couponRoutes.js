const express = require('express');
const {
  validateCoupon,
  adminGetCoupons,
  adminCreateCoupon,
  adminDeleteCoupon,
} = require('../controllers/couponController');
const { authenticateToken } = require('../middlewares/auth');
const checkRole = require('../middlewares/roleCheck');

const router = express.Router();

router.post('/validate', validateCoupon);

// Admin Routes
router.get(
  '/admin/all',
  authenticateToken,
  checkRole(['SHOP_MANAGER', 'SUPER_ADMIN']),
  adminGetCoupons
);
router.post(
  '/admin',
  authenticateToken,
  checkRole(['SHOP_MANAGER', 'SUPER_ADMIN']),
  adminCreateCoupon
);
router.delete(
  '/admin/:id',
  authenticateToken,
  checkRole(['SHOP_MANAGER', 'SUPER_ADMIN']),
  adminDeleteCoupon
);

module.exports = router;
