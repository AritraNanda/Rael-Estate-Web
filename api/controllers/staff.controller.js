import Staff from '../models/staff.model.js';
import Admin from '../models/admin.model.js';
import bcrypt from 'bcrypt';

// Create new staff member
export const createStaff = async (req, res, next) => {
  try {
    const { name, email, emp_id, password } = req.body;

    // Check if staff with same email or emp_id exists
    const existingStaff = await Staff.findOne({ $or: [{ email }, { emp_id }] });
    if (existingStaff) {
      return res.status(400).json({
        success: false,
        message: 'Staff member with this email or employee ID already exists'
      });
    }

    // Create new staff member
    const newStaff = new Staff({
      name,
      email,
      emp_id,
      password
    });

    // Save to database
    await newStaff.save();

    // Remove password from response
    const { password: pass, ...rest } = newStaff._doc;

    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      data: rest
    });

  } catch (error) {
    next(error);
  }
};

// Get all staff members
export const getAllStaff = async (req, res, next) => {
  try {
    const staffMembers = await Staff.find().select('-password');
    res.status(200).json({
      success: true,
      data: staffMembers
    });
  } catch (error) {
    next(error);
  }
};

// Delete staff member
export const deleteStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Staff member deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Create new admin
export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, emp_id, password, ssn } = req.body;

    // Check if admin with same email, emp_id, or ssn exists
    const existingAdmin = await Admin.findOne({ 
      $or: [{ email }, { emp_id }, { ssn }] 
    });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email, employee ID, or SSN already exists'
      });
    }

    // Create new admin with only the required fields
    const newAdmin = new Admin({
      name,
      email,
      emp_id,
      password,
      ssn,
      role: 'admin',
      isActive: true,
      permissions: {
        manageUsers: true,
        manageListings: true,
        manageSettings: true,
        manageTransactions: true,
        manageAdmins: false
      }
    });

    // Save to database
    await newAdmin.save();

    // Remove sensitive information from response
    const { password: pass, ssn: adminSsn, ...rest } = newAdmin._doc;

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: rest
    });

  } catch (error) {
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `An admin with this ${field} already exists`
      });
    }
    next(error);
  }
};

// Get all admins
export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find().select('-password -ssn');
    res.status(200).json({
      success: true,
      data: admins
    });
  } catch (error) {
    next(error);
  }
};

// Delete admin
export const deleteAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 