const express = require('express');
const {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  searchProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} = require('../controllers/productController');
const { authenticateToken } = require('../middlewares/auth');
const checkRole = require('../middlewares/roleCheck');

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/:slug', getProductBySlug);

// Admin Routes
router.post(
  '/admin',
  authenticateToken,
  checkRole(['SHOP_MANAGER', 'SUPER_ADMIN']),
  adminCreateProduct
);
router.put(
  '/admin/:id',
  authenticateToken,
  checkRole(['SHOP_MANAGER', 'SUPER_ADMIN']),
  adminUpdateProduct
);
router.delete(
  '/admin/:id',
  authenticateToken,
  checkRole(['SHOP_MANAGER', 'SUPER_ADMIN']),
  adminDeleteProduct
);

module.exports = router;
