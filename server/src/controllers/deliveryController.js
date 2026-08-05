const prisma = require('../config/db');

const getDeliveryZones = async (req, res, next) => {
  try {
    const zones = await prisma.deliveryZone.findMany({
      where: { isActive: true },
      orderBy: { cityName: 'asc' },
    });
    return res.json({ success: true, zones });
  } catch (err) {
    next(err);
  }
};

const adminGetDeliveryZones = async (req, res, next) => {
  try {
    const zones = await prisma.deliveryZone.findMany({ orderBy: { cityName: 'asc' } });
    return res.json({ success: true, zones });
  } catch (err) {
    next(err);
  }
};

const adminCreateDeliveryZone = async (req, res, next) => {
  try {
    const { cityName, deliveryCharge, isActive } = req.body;
    const zone = await prisma.deliveryZone.create({
      data: {
        cityName,
        deliveryCharge: parseFloat(deliveryCharge),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });
    return res.status(201).json({ success: true, zone });
  } catch (err) {
    next(err);
  }
};

const adminUpdateDeliveryZone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cityName, deliveryCharge, isActive } = req.body;
    const zone = await prisma.deliveryZone.update({
      where: { id },
      data: {
        cityName,
        deliveryCharge: deliveryCharge ? parseFloat(deliveryCharge) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      },
    });
    return res.json({ success: true, zone });
  } catch (err) {
    next(err);
  }
};

const adminDeleteDeliveryZone = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.deliveryZone.delete({ where: { id } });
    return res.json({ success: true, message: 'Delivery zone deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDeliveryZones,
  adminGetDeliveryZones,
  adminCreateDeliveryZone,
  adminUpdateDeliveryZone,
  adminDeleteDeliveryZone,
};
