import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  FaCog, FaBell, FaShieldAlt, FaDatabase, FaUndo, 
  FaPalette, FaMoon, FaSun, FaGlobe, FaCheck 
} from 'react-icons/fa';

const Settings = () => {
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Real Estate Portal',
      siteDescription: 'Find your dream property',
      contactEmail: 'contact@realestate.com',
      phoneNumber: '',
      address: '',
      language: 'English',
      theme: 'light'
    },
    listing: {
      maxImagesPerListing: 10,
      maxListingsPerUser: 50,
      allowUnverifiedListings: false,
      requirePhoneVerification: true,
      enableWatermark: true,
      defaultSortOrder: 'newest',
      showPriceHistory: true
    },
    notification: {
      enableEmailNotifications: true,
      enablePushNotifications: false,
      notifyOnNewListing: true,
      notifyOnListingUpdate: true,
      notifyOnUserRegistration: true,
      emailDigestFrequency: 'daily',
      desktopNotifications: true
    },
    security: {
      requireEmailVerification: true,
      twoFactorAuth: false,
      passwordExpiryDays: 90,
      maxLoginAttempts: 5,
      sessionTimeout: 60,
      autoLogout: true,
      showSecurityAlerts: true
    },
    appearance: {
      primaryColor: '#2563eb',
      accentColor: '#3b82f6',
      darkMode: false,
      compactView: false,
      showAnimations: true,
      fontScale: 1,
      borderRadius: 'medium'
    }
  });

  const [activeSection, setActiveSection] = useState('general');
  const [saveStatus, setSaveStatus] = useState({});

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setSaveStatus({ ...saveStatus, [section]: 'unsaved' });
  };

  const handleSubmit = (section) => {
    // Save to localStorage
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    setSaveStatus({ ...saveStatus, [section]: 'saved' });
    toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings updated successfully`);
    
    // Reset save status after 2 seconds
    setTimeout(() => {
      setSaveStatus(prev => ({ ...prev, [section]: null }));
    }, 2000);
  };

  const handleReset = (section) => {
    const defaultSettings = {
      general: {
        siteName: 'Real Estate Portal',
        siteDescription: 'Find your dream property',
        contactEmail: 'contact@realestate.com',
        phoneNumber: '',
        address: '',
        language: 'English',
        theme: 'light'
      },
      listing: {
        maxImagesPerListing: 10,
        maxListingsPerUser: 50,
        allowUnverifiedListings: false,
        requirePhoneVerification: true,
        enableWatermark: true,
        defaultSortOrder: 'newest',
        showPriceHistory: true
      },
      notification: {
        enableEmailNotifications: true,
        enablePushNotifications: false,
        notifyOnNewListing: true,
        notifyOnListingUpdate: true,
        notifyOnUserRegistration: true,
        emailDigestFrequency: 'daily',
        desktopNotifications: true
      },
      security: {
        requireEmailVerification: true,
        twoFactorAuth: false,
        passwordExpiryDays: 90,
        maxLoginAttempts: 5,
        sessionTimeout: 60,
        autoLogout: true,
        showSecurityAlerts: true
      },
      appearance: {
        primaryColor: '#2563eb',
        accentColor: '#3b82f6',
        darkMode: false,
        compactView: false,
        showAnimations: true,
        fontScale: 1,
        borderRadius: 'medium'
      }
    };

    setSettings(prev => ({
      ...prev,
      [section]: defaultSettings[section]
    }));
    setSaveStatus({ ...saveStatus, [section]: 'unsaved' });
    toast.info(`${section.charAt(0).toUpperCase() + section.slice(1)} settings reset to defaults`);
  };

  const sections = [
    { id: 'general', title: 'General Settings', icon: FaCog },
    { id: 'listing', title: 'Listing Settings', icon: FaDatabase },
    { id: 'notification', title: 'Notification Settings', icon: FaBell },
    { id: 'security', title: 'Security Settings', icon: FaShieldAlt },
    { id: 'appearance', title: 'Appearance Settings', icon: FaPalette }
  ];

  const renderField = (section, field, value) => {
    const label = field.split(/(?=[A-Z])/).join(' ').charAt(0).toUpperCase() + 
                 field.split(/(?=[A-Z])/).join(' ').slice(1);

    if (field === 'theme' || field === 'language' || field === 'emailDigestFrequency' || field === 'borderRadius' || field === 'defaultSortOrder') {
      const options = {
        theme: ['light', 'dark', 'system'],
        language: ['English', 'Spanish', 'French', 'German'],
        emailDigestFrequency: ['daily', 'weekly', 'monthly', 'never'],
        borderRadius: ['small', 'medium', 'large'],
        defaultSortOrder: ['newest', 'price-asc', 'price-desc']
      };

      return (
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
          <select
            value={value}
            onChange={(e) => handleChange(section, field, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {options[field].map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (typeof value === 'boolean') {
      return (
        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
          <div>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <p className="text-xs text-gray-500">
              {`Enable or disable ${label.toLowerCase()}`}
            </p>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => handleChange(section, field, !value)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                value ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  value ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      );
    }

    if (typeof value === 'number') {
      return (
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(section, field, parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(section, field, e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
    );
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Settings</h2>
        
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-md mb-2 transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <section.icon className="mr-3" />
                  <span className="text-sm font-medium">{section.title}</span>
                  {saveStatus[section.id] === 'unsaved' && (
                    <span className="ml-auto text-xs text-orange-500">●</span>
                  )}
                  {saveStatus[section.id] === 'saved' && (
                    <FaCheck className="ml-auto text-green-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  {sections.find(s => s.id === activeSection)?.icon({ className: 'text-blue-600 text-xl mr-2' })}
                  <h3 className="text-xl font-semibold text-gray-800">
                    {sections.find(s => s.id === activeSection)?.title}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReset(activeSection)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaUndo className="mr-2" />
                    Reset
                  </button>
                  <button
                    onClick={() => handleSubmit(activeSection)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {Object.entries(settings[activeSection]).map(([field, value]) => (
                  <div key={field}>
                    {renderField(activeSection, field, value)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 