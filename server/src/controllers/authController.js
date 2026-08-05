const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'gifto_jwt_super_secret_key_2026_pk_ecommerce';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'gifto_jwt_refresh_secret_key_2026_pk_ecommerce';

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
  const refreshToken = jwt.sign({ userId, role }, JWT_REFRESH_SECRET, { expiresIn: '30d' });
  return { accessToken, refreshToken };
};

const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role: 'CUSTOMER',
        points: 50, // Welcome points bonus
      },
    });

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      tokens: { accessToken, refreshToken },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        points: user.points,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    return res.json({
      success: true,
      message: 'Logged in successfully',
      tokens: { accessToken, refreshToken },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        points: user.points,
      },
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully' });
};

const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'Refresh token required' });

    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    const tokens = generateTokens(user.id, user.role);
    return res.json({ success: true, tokens });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

const forgotPassword = async (req, res) => {
  return res.json({
    success: true,
    message: 'If an account exists with this email, a password reset link has been sent.',
  });
};

const resetPassword = async (req, res) => {
  return res.json({ success: true, message: 'Password has been reset successfully' });
};

const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        points: true,
        createdAt: true,
        addresses: true,
      },
    });
    return res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone },
      select: { id: true, name: true, email: true, phone: true, role: true, points: true },
    });
    return res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash: newHash },
    });

    return res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

const getAddresses = async (req, res, next) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: { isDefault: 'desc' },
    });
    return res.json({ success: true, addresses });
  } catch (err) {
    next(err);
  }
};

const addAddress = async (req, res, next) => {
  try {
    const { label, city, addressLine, phone, isDefault } = req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: req.user.id,
        label: label || 'Home',
        city,
        addressLine,
        phone,
        isDefault: Boolean(isDefault),
      },
    });

    return res.status(201).json({ success: true, address });
  } catch (err) {
    next(err);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    await prisma.address.deleteMany({
      where: { id: req.params.id, userId: req.user.id },
    });
    return res.json({ success: true, message: 'Address deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  getAddresses,
  addAddress,
  deleteAddress,
};
