import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaUser, FaEnvelope, FaPhone, FaKey, FaImage, FaBuilding, FaSave, FaBell } from 'react-icons/fa';

const ProfileSettings = () => {
  const { currentStaff: staff } = useSelector(state => state.staff);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: '',
    position: '',
    department: '',
    bio: '',
    notificationPreferences: {
      email: true,
      sms: false,
      app: true
    },
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ status: '', message: '' });
  
  // Load user data when component mounts
  useEffect(() => {
    if (staff) {
      // Populate form data with current staff information
      setFormData({
        name: staff.name || '',
        email: staff.email || '',
        phone: staff.phone || '+91 98765 43210', // Mock data
        profileImage: staff.profileImage || '',
        position: staff.position || 'Real Estate Agent', // Mock data
        department: staff.department || 'Sales', // Mock data
        bio: staff.bio || 'Experienced real estate professional with 5+ years in the luxury property market.', // Mock data
        notificationPreferences: staff.notificationPreferences || {
          email: true,
          sms: false,
          app: true
        },
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [staff]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationChange = (type) => {
    setFormData(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [type]: !prev.notificationPreferences[type]
      }
    }));
  };
  
  const handleSave = (e) => {
    e.preventDefault();
    setSaveStatus({ status: 'loading', message: 'Saving changes...' });
    
    // Mock API call to save profile
    setTimeout(() => {
      setSaveStatus({ status: 'success', message: 'Profile updated successfully!' });
      setIsEditing(false);
      
      // Clear message after a delay
      setTimeout(() => {
        setSaveStatus({ status: '', message: '' });
      }, 3000);
    }, 1500);
  };
  
  const handleChangePassword = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (formData.newPassword !== formData.confirmPassword) {
      setSaveStatus({ status: 'error', message: 'New passwords do not match!' });
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setSaveStatus({ status: 'error', message: 'Password must be at least 6 characters long!' });
      return;
    }
    
    setSaveStatus({ status: 'loading', message: 'Updating password...' });
    
    // Mock API call to change password
    setTimeout(() => {
      setSaveStatus({ status: 'success', message: 'Password updated successfully!' });
      
      // Clear form fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      // Clear message after a delay
      setTimeout(() => {
        setSaveStatus({ status: '', message: '' });
      }, 3000);
    }, 1500);
  };
  
  return (
    <div className="pb-8">
      <div className="flex flex-col lg:flex-row justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
        </div>
        {activeTab === 'profile' && (
          <div className="mt-4 lg:mt-0">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg ${
                isEditing 
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } transition duration-200`}
            >
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
          </div>
        )}
      </div>
      
      {/* Save status message */}
      {saveStatus.message && (
        <div className={`mb-6 p-4 rounded-lg ${
          saveStatus.status === 'success' ? 'bg-green-100 text-green-800' : 
          saveStatus.status === 'error' ? 'bg-red-100 text-red-800' : 
          'bg-blue-100 text-blue-800'
        }`}>
          {saveStatus.message}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaUser className="inline mr-2" />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'security'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaKey className="inline mr-2" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'notifications'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaBell className="inline mr-2" />
              Notifications
            </button>
          </nav>
        </div>
        
        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <div className="p-6">
            <form onSubmit={handleSave}>
              <div className="flex flex-col md:flex-row">
                {/* Left column - Profile Image */}
                <div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                      {formData.profileImage ? (
                        <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl font-bold text-blue-600">
                          {formData.name ? formData.name.charAt(0).toUpperCase() : 'S'}
                        </span>
                      )}
                    </div>
                    {isEditing && (
                      <button 
                        type="button"
                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700"
                      >
                        <FaImage />
                      </button>
                    )}
                  </div>
                  
                  <div className="mt-4 text-center">
                    <h2 className="text-xl font-bold text-gray-800">{formData.name}</h2>
                    <p className="text-gray-600">{formData.position}</p>
                    <p className="text-sm text-gray-500">{formData.department} Department</p>
                  </div>
                </div>
                
                {/* Right column - Form Fields */}
                <div className="md:w-2/3 md:pl-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`pl-10 w-full p-2 border border-gray-300 rounded-lg ${
                            !isEditing ? 'bg-gray-50' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
                          }`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`pl-10 w-full p-2 border border-gray-300 rounded-lg ${
                            !isEditing ? 'bg-gray-50' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
                          }`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`pl-10 w-full p-2 border border-gray-300 rounded-lg ${
                            !isEditing ? 'bg-gray-50' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
                          }`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaBuilding className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`pl-10 w-full p-2 border border-gray-300 rounded-lg ${
                            !isEditing ? 'bg-gray-50' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
                          }`}
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows="4"
                        className={`w-full p-2 border border-gray-300 rounded-lg ${
                          !isEditing ? 'bg-gray-50' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
                        }`}
                      ></textarea>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="mt-6 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                      >
                        <FaSave className="mr-2" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}
        
        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="p-6">
            <form onSubmit={handleChangePassword}>
              <div className="max-w-md mx-auto">
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long.</p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="border-t border-gray-200 pt-5">
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
            
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h3 className="font-medium text-gray-800">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive updates and alerts via email</p>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                  <input
                    type="checkbox"
                    id="email-toggle"
                    className="opacity-0 w-0 h-0"
                    checked={formData.notificationPreferences.email}
                    onChange={() => handleNotificationChange('email')}
                  />
                  <label
                    htmlFor="email-toggle"
                    className={`absolute left-0 top-0 block w-12 h-6 rounded-full transition-colors duration-200 ease-in cursor-pointer ${
                      formData.notificationPreferences.email ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in transform ${
                        formData.notificationPreferences.email ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h3 className="font-medium text-gray-800">SMS Notifications</h3>
                  <p className="text-sm text-gray-600">Receive important alerts via SMS</p>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                  <input
                    type="checkbox"
                    id="sms-toggle"
                    className="opacity-0 w-0 h-0"
                    checked={formData.notificationPreferences.sms}
                    onChange={() => handleNotificationChange('sms')}
                  />
                  <label
                    htmlFor="sms-toggle"
                    className={`absolute left-0 top-0 block w-12 h-6 rounded-full transition-colors duration-200 ease-in cursor-pointer ${
                      formData.notificationPreferences.sms ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in transform ${
                        formData.notificationPreferences.sms ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between pb-4">
                <div>
                  <h3 className="font-medium text-gray-800">In-App Notifications</h3>
                  <p className="text-sm text-gray-600">Receive notifications within the application</p>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                  <input
                    type="checkbox"
                    id="app-toggle"
                    className="opacity-0 w-0 h-0"
                    checked={formData.notificationPreferences.app}
                    onChange={() => handleNotificationChange('app')}
                  />
                  <label
                    htmlFor="app-toggle"
                    className={`absolute left-0 top-0 block w-12 h-6 rounded-full transition-colors duration-200 ease-in cursor-pointer ${
                      formData.notificationPreferences.app ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in transform ${
                        formData.notificationPreferences.app ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings; 