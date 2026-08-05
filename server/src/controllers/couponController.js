const prisma = require('../config/db');

const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Coupon code required' });

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code' });
    }

    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ success: false, message: 'Coupon code has expired' });
    }

    if (subtotal && subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of PKR ${coupon.minOrderAmount} required for this coupon.`,
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * coupon.value) / 100;
    } else {
      discountAmount = coupon.value;
    }

    return res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        value: coupon.value,
        discountAmount,
      },
    });
  } catch (err) {
    next(err);
  }
};

const adminGetCoupons = async (req, res, next) => {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json({ success: true, coupons });
  } catch (err) {
    next(err);
  }
};

const adminCreateCoupon = async (req, res, next) => {
  try {
    const { code, discountType, value, minOrderAmount, expiryDate, isActive } = req.body;
    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType: discountType || 'PERCENTAGE',
        value: parseFloat(value),
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : 0,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });
    return res.status(201).json({ success: true, coupon });
  } catch (err) {
    next(err);
  }
};

const adminDeleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.coupon.delete({ where: { id } });
    return res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  validateCoupon,
  adminGetCoupons,
  adminCreateCoupon,
  adminDeleteCoupon,
};
