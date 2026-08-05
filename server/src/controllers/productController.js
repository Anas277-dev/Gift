const prisma = require('../config/db');

const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      city,
      minPrice,
      maxPrice,
      search,
      featured,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20,
    } = req.query;

    const where = {
      isActive: true,
    };

    if (category) {
      // Find category by slug or id, including child categories
      const catObj = await prisma.category.findFirst({
        where: { OR: [{ slug: category }, { id: category }] },
        include: { children: true },
      });

      if (catObj) {
        const catIds = [catObj.id, ...catObj.children.map((c) => c.id)];
        where.categoryId = { in: catIds };
      }
    }

    if (city) {
      where.deliverableCities = { has: city };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    let orderBy = {};
    if (sortBy === 'priceAsc') orderBy = { price: 'asc' };
    else if (sortBy === 'priceDesc') orderBy = { price: 'desc' };
    else if (sortBy === 'rating') orderBy = { ratingAverage: 'desc' };
    else orderBy = { createdAt: 'desc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: { select: { name: true, slug: true } } },
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    return res.json({
      success: true,
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: {
        category: true,
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Related products from same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      take: 4,
    });

    return res.json({ success: true, product, relatedProducts });
  } catch (err) {
    next(err);
  }
};

const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: { category: { select: { name: true, slug: true } } },
      take: 8,
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
};

const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, products: [] });

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 10,
    });

    return res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
};

// Admin Controllers
const adminCreateProduct = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      salePrice,
      sku,
      stock,
      categoryId,
      images,
      deliverableCities,
      isFeatured,
      isActive,
    } = req.body;

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await prisma.product.create({
      data: {
        name,
        slug: generatedSlug,
        description,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        sku: sku || `SKU-${Date.now()}`,
        stock: stock ? parseInt(stock, 10) : 50,
        categoryId,
        images: images || [],
        deliverableCities: deliverableCities || ['Lahore', 'Karachi', 'Islamabad'],
        isFeatured: Boolean(isFeatured),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return res.status(201).json({ success: true, message: 'Product created', product });
  } catch (err) {
    next(err);
  }
};

const adminUpdateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (data.price) data.price = parseFloat(data.price);
    if (data.salePrice) data.salePrice = parseFloat(data.salePrice);
    if (data.stock) data.stock = parseInt(data.stock, 10);

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    return res.json({ success: true, message: 'Product updated', product });
  } catch (err) {
    next(err);
  }
};

const adminDeleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    return res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  searchProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
};
