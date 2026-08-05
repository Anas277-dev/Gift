const express = require('express');
const {
  getDashboardStats,
  getSalesReport,
  getCustomers,
  getCustomerById,
  getSettings,
  updateSettings,
} = require('../controllers/adminController');
const { authenticateToken } = require('../middlewares/auth');
const checkRole = require('../middlewares/roleCheck');

const router = express.Router();

router.use(authenticateToken);
router.use(checkRole(['SHOP_MANAGER', 'SUPPORT', 'SUPER_ADMIN']));

router.get('/dashboard-stats', getDashboardStats);
router.get('/reports/sales', getSalesReport);
router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerById);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
