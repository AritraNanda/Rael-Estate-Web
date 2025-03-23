import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

// Drop any existing indexes before creating new ones
const dropIndexes = async () => {
  try {
    await mongoose.model('Admin').collection.dropIndexes();
  } catch (error) {
    console.error('Error dropping indexes:', error);
  }
};

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  emp_id: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true
  },
  ssn: {
    type: String,
    required: [true, 'SSN is required'],
    unique: true,
    match: [/^\d{3}-\d{2}-\d{4}$/, 'Please enter SSN in XXX-XX-XXXX format']
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'superadmin']
  },
  lastLogin: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  permissions: {
    manageUsers: { type: Boolean, default: true },
    manageListings: { type: Boolean, default: true },
    manageSettings: { type: Boolean, default: true },
    manageTransactions: { type: Boolean, default: true },
    manageAdmins: { type: Boolean, default: false }
  }
}, { timestamps: true });

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update lastLogin
adminSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  await this.save();
};

// Create initial superadmin if no admin exists
adminSchema.statics.createInitialSuperAdmin = async function() {
  try {
    const adminCount = await this.countDocuments();
    if (adminCount === 0) {
      await this.create({
        name: 'superadmin',
        email: process.env.SUPER_ADMIN_EMAIL || 'admin@realestate.com',
        password: process.env.SUPER_ADMIN_PASSWORD || 'admin123',
        emp_id: 'superadmin',
        ssn: 'superadmin',
        role: 'superadmin',
        permissions: {
          manageUsers: true,
          manageListings: true,
          manageSettings: true,
          manageTransactions: true,
          manageAdmins: true
        }
      });
      console.log('Initial superadmin created');
    }
  } catch (error) {
    console.error('Error creating initial superadmin:', error);
  }
};

const Admin = mongoose.model('Admin', adminSchema);

// Drop old indexes before initializing
dropIndexes();

// Create initial superadmin
Admin.createInitialSuperAdmin();

export default Admin; 