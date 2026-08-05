const prisma = require('../config/db');

const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, reviews });
  } catch (err) {
    next(err);
  }
};

const addReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    const review = await prisma.review.create({
      data: {
        productId,
        userId: req.user.id,
        rating: parseInt(rating, 10),
        comment,
        isApproved: true,
      },
    });

    // Update product ratingAverage and reviewCount
    const allApproved = await prisma.review.findMany({
      where: { productId, isApproved: true },
    });

    const avg = allApproved.reduce((acc, curr) => acc + curr.rating, 0) / allApproved.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        ratingAverage: Math.round(avg * 10) / 10,
        reviewCount: allApproved.length,
      },
    });

    return res.status(201).json({ success: true, message: 'Review added successfully', review });
  } catch (err) {
    next(err);
  }
};

const adminGetReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        product: { select: { name: true, images: true } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, reviews });
  } catch (err) {
    next(err);
  }
};

const adminApproveReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    const review = await prisma.review.update({
      where: { id },
      data: { isApproved: Boolean(isApproved) },
    });
    return res.json({ success: true, review });
  } catch (err) {
    next(err);
  }
};

const adminDeleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id } });
    return res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProductReviews,
  addReview,
  adminGetReviews,
  adminApproveReview,
  adminDeleteReview,
};
