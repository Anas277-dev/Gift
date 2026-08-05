const prisma = require('../config/db');

const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      deliveryCity,
      deliveryAddress,
      recipientName,
      recipientPhone,
      giftCardMessage,
      deliveryDate,
      deliveryTimeSlot,
      paymentMethod,
      couponCode,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required' });
    }

    let subtotal = 0;
    const orderItemsData = [];

    // Verify products and calculate total
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return res.status(400).json({ success: false, message: `Product not found: ${item.productId}` });
      }

      // Check deliverability city
      if (!product.deliverableCities.includes(deliveryCity)) {
        return res.status(400).json({
          success: false,
          message: `Product "${product.name}" is not deliverable to ${deliveryCity}.`,
        });
      }

      const price = product.salePrice || product.price;
      subtotal += price * item.quantity;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        priceAtPurchase: price,
      });
    }

    // Check delivery charge for city
    const zone = await prisma.deliveryZone.findUnique({ where: { cityName: deliveryCity } });
    const deliveryCharge = zone ? zone.deliveryCharge : 250;

    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      if (coupon && coupon.isActive) {
        if (subtotal >= coupon.minOrderAmount) {
          if (coupon.discountType === 'PERCENTAGE') {
            discount = (subtotal * coupon.value) / 100;
          } else {
            discount = coupon.value;
          }
        }
      }
    }

    const totalAmount = Math.max(0, subtotal + deliveryCharge - discount);
    const pointsEarned = Math.floor(totalAmount * 0.05); // 5% points earned

    const orderNumber = `GFT-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user ? req.user.id : null,
        status: 'PENDING',
        totalAmount,
        deliveryCity,
        deliveryAddress,
        recipientName,
        recipientPhone,
        giftCardMessage,
        deliveryDate,
        deliveryTimeSlot,
        paymentMethod: paymentMethod || 'Cash on Delivery',
        paymentStatus: 'PENDING',
        pointsEarned,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    // Award loyalty points to user if logged in
    if (req.user) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { points: { increment: pointsEarned } },
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order,
    });
  } catch (err) {
    next(err);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: { select: { name: true, images: true, slug: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: {
          include: { product: true },
        },
        user: { select: { name: true, email: true, phone: true } },
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

const trackOrder = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ orderNumber: orderNumber.trim() }, { id: orderNumber.trim() }],
      },
      include: {
        items: {
          include: { product: { select: { name: true, images: true } } },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order number not found' });
    }

    return res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// Admin Controllers
const adminGetOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const where = {};
    if (status) where.status = status;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { name: true, email: true, phone: true } },
          items: { include: { product: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.order.count({ where }),
    ]);

    return res.json({
      success: true,
      orders,
      pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
};

const adminUpdateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const data = {};
    if (status) data.status = status;
    if (paymentStatus) data.paymentStatus = paymentStatus;

    const order = await prisma.order.update({
      where: { id },
      data,
    });

    return res.json({ success: true, message: 'Order status updated', order });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  trackOrder,
  adminGetOrders,
  adminUpdateOrderStatus,
};
