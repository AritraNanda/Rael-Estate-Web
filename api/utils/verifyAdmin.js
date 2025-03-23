import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
import Admin from '../models/admin.model.js';

export const verifyAdminToken = async (req, res, next) => {
  const token = req.cookies.admin_token;

  if (!token) {
    return next(errorHandler(401, 'Unauthorized - Please login'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET3);

    // Check if user exists and is an admin
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin || !admin.isActive) {
      return next(errorHandler(401, 'Unauthorized - Invalid or inactive admin account'));
    }

    // Check if the token role matches the user's role
    if (decoded.role !== admin.role) {
      return next(errorHandler(401, 'Unauthorized - Role mismatch'));
    }

    // Add admin to request object
    req.user = admin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(errorHandler(401, 'Session expired - Please login again'));
    }
    return next(errorHandler(401, 'Invalid token'));
  }
};

// Middleware to check specific admin permissions
export const checkAdminPermission = (permission) => {
  return (req, res, next) => {
    const admin = req.user;

    if (!admin.permissions[permission]) {
      return next(errorHandler(403, 'Forbidden - Insufficient permissions'));
    }

    next();
  };
};

// Middleware to ensure superadmin role
export const requireSuperAdmin = (req, res, next) => {
  const admin = req.user;

  if (admin.role !== 'superadmin') {
    return next(errorHandler(403, 'Forbidden - Superadmin access required'));
  }

  next();
}; 