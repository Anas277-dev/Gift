const express = require('express');
const {
  getDeliveryZones,
  adminGetDeliveryZones,
  adminCreateDeliveryZone,
  adminUpdateDeliveryZone,
  adminDeleteDeliveryZone,
} = require('../controllers/deliveryController');
const { authenticateToken } = require('../middlewares/auth');
const checkRole = require('../middlewares/roleCheck');

const router = express.Router();

router.get('/zones', getDeliveryZones);

// Admin Routes
router.get(
  '/admin/all',
  authenticateToken,
  checkRole(['SHOP_MANAGER', 'SUPER_ADMIN']),
  adminGetDeliveryZones
);
router.post(
  '/admin',
  authenticateToken,
  checkRole(['SHOP_MANAGER', 'SUPER_ADMIN']),
  adminCreateDeliveryZone
);
router.put(
  '/admin/:id',
  authenticateToken,
  checkRole(['SHOP_MANAGER', 'SUPER_ADMIN']),
  adminUpdateDeliveryZone
);
router.delete(
  '/admin/:id',
  authenticateToken,
  checkRole(['SHOP_MANAGER', 'SUPER_ADMIN']),
  adminDeleteDeliveryZone
);

module.exports = router;
