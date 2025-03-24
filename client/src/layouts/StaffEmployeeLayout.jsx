import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOutStaffStart, signOutStaffSuccess, signOutStaffFailure } from '../redux/user/staffSlice';
import { toast } from 'react-toastify';
import { FaHome, FaClipboardList, FaUsers, FaRegCalendarAlt, FaUserCog, FaSignOutAlt, FaCreditCard } from 'react-icons/fa';
import { useEffect } from 'react';

// Import staff pages
import SignIn from '../pagesStaffEmployee/SignIn';
import AddListing from '../pagesStaffEmployee/AddListing';
import Home from '../pagesStaffEmployee/Home';
import ManageSubscriptions from '../pagesStaffEmployee/ManageSubscriptions';
import Listings from '../pagesStaffEmployee/Listings';
import ClientManagement from '../pagesStaffEmployee/ClientManagement';
import Appointments from '../pagesStaffEmployee/Appointments';
import ProfileSettings from '../pagesStaffEmployee/ProfileSettings';

// Import staff pages 
// These will be created in the pagesStaffEmployee folder
const StaffEmployeeLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentStaff: staff } = useSelector(state => state.staff);

  // Function to check if a path is active
  const isActivePath = (path) => {
    return location.pathname === '/staff-employee' + path;
  };

  // Common link class with active state
  const getLinkClass = (path) => {
    return `flex items-center space-x-3 py-3 px-4 rounded transition duration-200 ${
      isActivePath(path) 
        ? 'bg-blue-600 text-white' 
        : 'hover:bg-blue-100 hover:text-blue-600 text-gray-700'
    }`;
  };

  // Use effect to handle navigation redirect if not authenticated
  useEffect(() => {
    // Skip redirection if we're already at the signin page
    if (location.pathname === '/staff-employee/signin') {
      return;
    }
    
    // Redirect to signin if not authenticated
    if (!staff) {
      navigate('/staff-employee/signin');
    }
  }, [staff, navigate, location.pathname]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      dispatch(signOutStaffStart());
      
      const res = await fetch('/api/staff/logout', {
        method: 'GET',
        credentials: 'include'
      });
      const data = await res.json();
      
      if (data.success) {
        dispatch(signOutStaffSuccess());
        toast.success('Logged out successfully', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        setTimeout(() => {
          navigate('/staff-employee/signin');
        }, 2000);
      } else {
        dispatch(signOutStaffFailure(data.message));
        toast.error(data.message || 'Error logging out', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      }
    } catch (error) {
      dispatch(signOutStaffFailure(error.message));
      toast.error('Error logging out. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  };

  // If the current path is signin, render only the SignIn component
  if (location.pathname === '/staff-employee/signin') {
    return <SignIn />;
  }

  // If we're trying to access a protected route and have no staff data, 
  // show a loading indicator instead of returning null (which causes render issues)
  if (!staff) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar - Fixed position with overflow handling */}
      <div className="fixed w-64 h-screen bg-white shadow-lg flex flex-col z-10">
        <div className="p-5 border-b border-gray-200">
          <Link to="/">
            <h1 className="text-2xl font-bold text-blue-600">EstateBro</h1>
          </Link>
          <p className="text-sm text-gray-600">Staff Portal</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link to="/staff-employee" className={getLinkClass('')}>
            <FaHome className="text-lg" />
            <span>Dashboard</span>
          </Link>
          
          <Link to="/staff-employee/listings" className={getLinkClass('/listings')}>
            <FaClipboardList className="text-lg" />
            <span>Property Listings</span>
          </Link>
          
          <Link to="/staff-employee/add-listing" className={getLinkClass('/add-listing')}>
            <FaHome className="text-lg" />
            <span>Add Property</span>
          </Link>
          
          <Link to="/staff-employee/clients" className={getLinkClass('/clients')}>
            <FaUsers className="text-lg" />
            <span>Client Management</span>
          </Link>
          
          <Link to="/staff-employee/subscriptions" className={getLinkClass('/subscriptions')}>
            <FaCreditCard className="text-lg" />
            <span>Manage Subscriptions</span>
          </Link>
          
          <Link to="/staff-employee/appointments" className={getLinkClass('/appointments')}>
            <FaRegCalendarAlt className="text-lg" />
            <span>Appointments</span>
          </Link>
          
          <Link to="/staff-employee/settings" className={getLinkClass('/settings')}>
            <FaUserCog className="text-lg" />
            <span>Profile Settings</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-200 mt-auto sticky bottom-0 bg-white">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <span className="text-blue-600 font-semibold">{staff?.name?.substring(0, 1).toUpperCase() || 'S'}</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">{staff?.name || 'Staff Member'}</p>
              <p className="text-xs text-gray-500">{staff?.email || 'staff@estatebro.com'}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-red-50 text-red-600 hover:bg-red-100 rounded transition duration-200"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content - With left margin to make space for fixed sidebar */}
      <div className="flex-1 ml-64 p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/add-listing" element={<AddListing />} />
          <Route path="/clients" element={<ClientManagement />} />
          <Route path="/subscriptions" element={<ManageSubscriptions />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/settings" element={<ProfileSettings />} />
        </Routes>
      </div>
    </div>
  );
};

export default StaffEmployeeLayout; 