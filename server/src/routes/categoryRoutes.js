const express = require('express');
const {
  getCategories,
  getCategoryBySlug,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} = require('../controllers/categoryController');
const { authenticateToken } = require('../middlewares/auth');
const checkRole = require('../middlewares/roleCheck');

const router = express.Router();

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin Routes
router.post(
  '/admin',
  authenticateToken,
  checkRole(['SHOP_MANAGER', 'SUPER_ADMIN']),
  adminCreateCategory
);
router.put(
  '/admin/:id',
  authenticateToken,
  checkRole(['SHOP_MANAGER', 'SUPER_ADMIN']),
  adminUpdateCategory
);
router.delete(
  '/admin/:id',
  authenticateToken,
  checkRole(['SHOP_MANAGER', 'SUPER_ADMIN']),
  adminDeleteCategory
);

module.exports = router;
