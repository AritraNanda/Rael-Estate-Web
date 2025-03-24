import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHome, FaClipboardList, FaUsers, FaRegCalendarAlt, FaPlus, FaSearch, FaCreditCard } from 'react-icons/fa';

const Home = () => {
  const { currentStaff: staff } = useSelector(state => state.staff);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    pendingListings: 0,
    totalUsers: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    // Simulate fetching data
    const fetchDashboardData = () => {
      setLoading(true);
      
      // For demo purposes, set mock data
      setTimeout(() => {
        setStats({
          totalListings: 152,
          activeListings: 89,
          pendingListings: 12,
          totalUsers: 248
        });
        
        setRecentActivity([
          { id: 1, type: 'listing_added', title: 'New property in Downtown', user: 'John Doe', date: new Date(Date.now() - 1000 * 60 * 30) },
          { id: 2, type: 'user_registered', title: 'New user registration', user: 'Sarah Williams', date: new Date(Date.now() - 1000 * 60 * 120) },
          { id: 3, type: 'listing_viewed', title: 'Property viewed 10+ times', user: 'Beachfront Villa', date: new Date(Date.now() - 1000 * 60 * 180) },
          { id: 4, type: 'inquiry_received', title: 'New inquiry received', user: 'Michael Brown', date: new Date(Date.now() - 1000 * 60 * 240) },
          { id: 5, type: 'listing_updated', title: 'Property price updated', user: 'Modern Apartment', date: new Date(Date.now() - 1000 * 60 * 300) }
        ]);
        
        setLoading(false);
      }, 800);
    };
    
    fetchDashboardData();
  }, []);

  // Format date to readable string
  const formatDate = (date) => {
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 hour
    if (diff < 1000 * 60 * 60) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    
    // Less than 1 day
    if (diff < 1000 * 60 * 60 * 24) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    // Otherwise format as date
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get icon for activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'listing_added':
        return <FaHome className="text-blue-500" />;
      case 'user_registered':
        return <FaUsers className="text-green-500" />;
      case 'listing_viewed':
        return <FaSearch className="text-purple-500" />;
      case 'inquiry_received':
        return <FaClipboardList className="text-yellow-500" />;
      case 'listing_updated':
        return <FaRegCalendarAlt className="text-red-500" />;
      default:
        return <FaClipboardList className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {staff?.name || 'Staff Member'}</p>
        </div>
        <Link
          to="/staff-employee/add-listing"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition duration-200"
        >
          <FaPlus className="mr-2" />
          Add New Property
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaHome className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600 uppercase">Total Listings</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalListings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaClipboardList className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600 uppercase">Active Listings</p>
              <p className="text-2xl font-bold text-gray-800">{stats.activeListings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FaRegCalendarAlt className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600 uppercase">Pending Listings</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingListings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FaUsers className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600 uppercase">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link
              to="/staff-employee/add-listing"
              className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition duration-200"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full mr-3">
                  <FaPlus className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Add New Property</p>
                  <p className="text-sm text-gray-600">Create a new property listing</p>
                </div>
              </div>
            </Link>
            
            <Link
              to="/staff-employee/subscriptions"
              className="block p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition duration-200"
            >
              <div className="flex items-center">
                <div className="p-2 bg-teal-100 rounded-full mr-3">
                  <FaCreditCard className="text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Manage Subscriptions</p>
                  <p className="text-sm text-gray-600">Assign plans to sellers</p>
                </div>
              </div>
            </Link>
            
            <Link
              to="/staff-employee/clients"
              className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition duration-200"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-full mr-3">
                  <FaUsers className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Manage Clients</p>
                  <p className="text-sm text-gray-600">View and manage client accounts</p>
                </div>
              </div>
            </Link>
            
            <Link
              to="/staff-employee/appointments"
              className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition duration-200"
            >
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-full mr-3">
                  <FaRegCalendarAlt className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Schedule Appointments</p>
                  <p className="text-sm text-gray-600">Manage property viewings</p>
                </div>
              </div>
            </Link>
            
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition duration-200">
                <div className="p-2 bg-gray-100 rounded-full mr-3">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.user}</p>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {formatDate(activity.date)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
