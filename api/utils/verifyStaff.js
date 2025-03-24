import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
import Staff from '../models/staff.model.js';

export const verifyStaffToken = async (req, res, next) => {
  const token = req.cookies.staff_token;

  if (!token) {
    return next(errorHandler(401, 'Unauthorized - Please login as staff'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET4);

    // Check if user exists and is a staff member
    const staff = await Staff.findById(decoded.id).select('-password');
    if (!staff) {
      return next(errorHandler(401, 'Unauthorized - Invalid staff account'));
    }

    // Add staff to request object
    req.staff = staff;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(errorHandler(401, 'Session expired - Please login again'));
    }
    return next(errorHandler(401, 'Invalid token'));
  }
}; 