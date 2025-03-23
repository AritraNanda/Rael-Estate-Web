import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';
import Admin from '../models/admin.model.js';

// Admin Login
export const adminLogin = async (req, res, next) => {
  const { employeeId, password, ssnKey } = req.body;

  try {
    // Input validation
    if (!employeeId || !password || !ssnKey) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Find admin by employee ID
    const admin = await Admin.findOne({ emp_id: employeeId });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid employee ID'
      });
    }

    // Verify SSN
    if (admin.ssn !== ssnKey) {
      return res.status(401).json({
        success: false,
        message: 'Invalid SSN'
      });
    }

    // Verify password using bcryptjs compare
    const validPassword = await bcryptjs.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Create JWT token
    const token = jwt.sign(
      { 
        id: admin._id,
        role: admin.role,
        emp_id: admin.emp_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    // Remove sensitive information from response
    const { password: pass, ssn, ...adminInfo } = admin._doc;

    // Set cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 12 * 60 * 60 * 1000 // 12 hours
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      admin: adminInfo
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login. Please try again.'
    });
  }
};

// Admin Logout
export const adminLogout = async (req, res) => {
  try {
    res.clearCookie('admin_token');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during logout'
    });
  }
};

// Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password -ssn');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin profile'
    });
  }
};

// Update Admin Profile
export const updateAdminProfile = async (req, res, next) => {
  const { username, email, currentPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return next(errorHandler(404, 'Admin not found'));
    }

    // Update basic info
    if (username) admin.username = username;
    if (email) admin.email = email;

    // Update password if provided
    if (currentPassword && newPassword) {
      const validPassword = bcryptjs.compareSync(currentPassword, admin.password);
      if (!validPassword) {
        return next(errorHandler(401, 'Current password is incorrect'));
      }

      const hashedPassword = bcryptjs.hashSync(newPassword, 10);
      admin.password = hashedPassword;
    }

    await admin.save();

    const { password, ...adminInfo } = admin._doc;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      admin: adminInfo
    });
  } catch (error) {
    next(error);
  }
}; 