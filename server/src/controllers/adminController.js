const prisma = require('../config/db');

const getDashboardStats = async (req, res, next) => {
  try {
    const [totalOrders, totalRevenueObj, totalCustomers, lowStockCount, recentOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: 'CANCELLED' } },
      }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count({ where: { stock: { lte: 5 } } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

    return res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: totalRevenueObj._sum.totalAmount || 0,
        totalCustomers,
        lowStockCount,
      },
      recentOrders,
    });
  } catch (err) {
    next(err);
  }
};

const getSalesReport = async (req, res, next) => {
  try {
    // Group sales by city & generate sample daily sales trends for Recharts
    const orders = await prisma.order.findMany({
      where: { status: { not: 'CANCELLED' } },
      select: { totalAmount: true, deliveryCity: true, createdAt: true },
    });

    const revenueByCity = {};
    orders.forEach((o) => {
      revenueByCity[o.deliveryCity] = (revenueByCity[o.deliveryCity] || 0) + o.totalAmount;
    });

    const cityChartData = Object.keys(revenueByCity).map((city) => ({
      city,
      revenue: revenueByCity[city],
    }));

    const dailyTrends = [
      { day: 'Mon', sales: 42000, orders: 12 },
      { day: 'Tue', sales: 68000, orders: 18 },
      { day: 'Wed', sales: 55000, orders: 15 },
      { day: 'Thu', sales: 89000, orders: 24 },
      { day: 'Fri', sales: 112000, orders: 32 },
      { day: 'Sat', sales: 145000, orders: 41 },
      { day: 'Sun', sales: 130000, orders: 38 },
    ];

    return res.json({
      success: true,
      revenueByCity: cityChartData,
      dailyTrends,
    });
  } catch (err) {
    next(err);
  }
};

const getCustomers = async (req, res, next) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      include: {
        orders: { select: { id: true, totalAmount: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, customers });
  } catch (err) {
    next(err);
  }
};

const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          include: { items: { include: { product: true } } },
          orderBy: { createdAt: 'desc' },
        },
        addresses: true,
      },
    });

    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });

    return res.json({ success: true, customer });
  } catch (err) {
    next(err);
  }
};

const getSettings = async (req, res, next) => {
  try {
    const settings = await prisma.siteSetting.findMany();
    const settingsObj = {};
    settings.forEach((s) => {
      settingsObj[s.key] = s.value;
    });
    return res.json({ success: true, settings: settingsObj, settingsList: settings });
  } catch (err) {
    next(err);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const { settings } = req.body; // array of { key, value }

    for (const s of settings) {
      await prisma.siteSetting.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: { key: s.key, value: s.value },
      });
    }

    return res.json({ success: true, message: 'Site settings updated successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardStats,
  getSalesReport,
  getCustomers,
  getCustomerById,
  getSettings,
  updateSettings,
};
