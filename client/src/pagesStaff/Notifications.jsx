import { useState, useEffect } from 'react';
import { FaBell, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  // Demo notifications data
  useEffect(() => {
    // In a real app, you would fetch this from an API
    const demoNotifications = [
      {
        id: 1,
        type: 'info',
        title: 'New Property Listed',
        message: 'A new property "Riverside Villa" has been listed.',
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
        read: false
      },
      {
        id: 2,
        type: 'success',
        title: 'Property Sold',
        message: 'Property "Downtown Apartment" has been successfully sold for ₹45,00,000.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        read: false
      },
      {
        id: 3,
        type: 'warning',
        title: 'Subscription Expiring',
        message: 'Premium subscription for client "Rahul Sharma" is expiring in 3 days.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        read: true
      },
      {
        id: 4,
        type: 'error',
        title: 'Payment Failed',
        message: 'Payment for listing ID #8745 has failed. Please contact the customer.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        read: true
      },
      {
        id: 5,
        type: 'info',
        title: 'New Inquiry',
        message: 'You have received 5 new property inquiries today.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), // 30 hours ago
        read: false
      },
      {
        id: 6,
        type: 'success',
        title: 'New User Registration',
        message: 'A new agent "Priya Patel" has registered on the platform.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        read: true
      },
      {
        id: 7,
        type: 'warning',
        title: 'Server Maintenance',
        message: 'Scheduled maintenance will occur on Sunday at 2:00 AM IST.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
        read: true
      }
    ];

    setNotifications(demoNotifications);
  }, []);

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Filter notifications
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread' 
      ? notifications.filter(notification => !notification.read) 
      : notifications.filter(notification => notification.type === filter);

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500 text-xl" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500 text-xl" />;
      case 'error':
        return <FaTimes className="text-red-500 text-xl" />;
      case 'info':
      default:
        return <FaInfoCircle className="text-blue-500 text-xl" />;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Notifications</h2>
          
          <div className="flex space-x-2">
            <button 
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              Mark All as Read
            </button>
            <button 
              onClick={clearAllNotifications}
              className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex mb-6 bg-white rounded-lg p-2 shadow-md">
          <button 
            className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${filter === 'unread' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('unread')}
          >
            Unread
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${filter === 'info' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('info')}
          >
            Info
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${filter === 'success' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('success')}
          >
            Success
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${filter === 'warning' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('warning')}
          >
            Warning
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${filter === 'error' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('error')}
          >
            Error
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <FaBell className="text-gray-400 text-4xl mx-auto mb-3" />
              <p className="text-gray-500">No notifications to display</p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`bg-white p-5 rounded-lg shadow-md border-l-4 ${
                  notification.read ? 'border-gray-300' : 
                    notification.type === 'success' ? 'border-green-500' :
                    notification.type === 'warning' ? 'border-yellow-500' :
                    notification.type === 'error' ? 'border-red-500' :
                    'border-blue-500'
                } ${!notification.read && 'bg-blue-50'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        {!notification.read && (
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">New</span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-sm text-gray-500 mt-2">{formatTimestamp(notification.timestamp)}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Mark as read
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications; 