const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  trackOrder,
  adminGetOrders,
  adminUpdateOrderStatus,
} = require('../controllers/orderController');
const { authenticateToken, optionalAuth } = require('../middlewares/auth');
const checkRole = require('../middlewares/roleCheck');

const router = express.Router();

router.post('/', optionalAuth, createOrder);
router.get('/my-orders', authenticateToken, getMyOrders);
router.get('/track/:orderNumber', trackOrder);
router.get('/:id', getOrderById);

// Admin Routes
router.get(
  '/admin/all',
  authenticateToken,
  checkRole(['SHOP_MANAGER', 'SUPPORT', 'SUPER_ADMIN']),
  adminGetOrders
);
router.put(
  '/admin/:id/status',
  authenticateToken,
  checkRole(['SHOP_MANAGER', 'SUPPORT', 'SUPER_ADMIN']),
  adminUpdateOrderStatus
);

module.exports = router;
