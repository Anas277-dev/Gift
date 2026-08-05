const prisma = require('../config/db');

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
    return res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};

const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await prisma.category.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: {
        parent: true,
        children: true,
        products: {
          where: { isActive: true },
          take: 20,
        },
      },
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    return res.json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

const adminCreateCategory = async (req, res, next) => {
  try {
    const { name, slug, description, imageUrl, parentId } = req.body;
    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const category = await prisma.category.create({
      data: {
        name,
        slug: generatedSlug,
        description,
        imageUrl,
        parentId: parentId || null,
      },
    });

    return res.status(201).json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

const adminUpdateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.update({
      where: { id },
      data: req.body,
    });
    return res.json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

const adminDeleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    return res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
};
