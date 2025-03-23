import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Home from '../pagesStaff/Home';
import SignIn from '../pagesStaff/SignIn';
import ManageStaffAdmin from '../pagesStaff/ManageStaffAdmin';
import Transactions from '../pagesStaff/Transactions';
import SubscriptionManagement from '../pagesStaff/SubscriptionManagement';
import Listings from '../pagesStaff/Listings';
import Settings from '../pagesStaff/Settings';
import Analytics from '../pagesStaff/Analytics';
import Notifications from '../pagesStaff/Notifications';
import { useSelector, useDispatch } from 'react-redux';
import { signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice';
import { toast } from 'react-toastify';

const StaffLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser: admin } = useSelector(state => state.user);

  // Function to check if a path is active
  const isActivePath = (path) => {
    return location.pathname === '/staff' + path;
  };

  // Common link class with active state
  const getLinkClass = (path) => {
    return `block py-2 px-4 rounded transition duration-200 ${
      isActivePath(path) 
        ? 'bg-blue-700 text-white' 
        : 'hover:bg-blue-700 text-white'
    }`;
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      dispatch(signOutUserStart());
      
      const res = await fetch('/api/admin/logout', {
        method: 'GET',
        credentials: 'include'
      });
      const data = await res.json();
      
      if (data.success) {
        dispatch(signOutUserSuccess());
        toast.success('Logged out successfully', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        setTimeout(() => {
          navigate('/staff/signin');
        }, 2000);
      } else {
        dispatch(signOutUserFailure(data.message));
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
      dispatch(signOutUserFailure(error.message));
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
  if (location.pathname === '/staff/signin') {
    return <SignIn />;
  }

  // Otherwise render the staff layout with sidebar
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar - Fixed position with overflow handling */}
      <div className="fixed w-64 h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col z-10">
        <div className="p-6">
          <Link to="/">
          <h1 className="text-2xl font-bold">EstateBro</h1>
          </Link>
          <p className="text-sm text-blue-200">Admin Panel</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <Link to="/staff" className={getLinkClass('')}>Dashboard</Link>
          <Link to="/staff/analytics" className={getLinkClass('/analytics')}>Analytics</Link>
          <Link to="/staff/manage" className={getLinkClass('/manage')}>Staff Management</Link>
          <Link to="/staff/transactions" className={getLinkClass('/transactions')}>Transactions</Link>
          <Link to="/staff/subscriptions" className={getLinkClass('/subscriptions')}>Subscriptions</Link>
          <Link to="/staff/listings" className={getLinkClass('/listings')}>Listings</Link>
          <Link to="/staff/notifications" className={getLinkClass('/notifications')}>Notifications</Link>
          <Link to="/staff/settings" className={getLinkClass('/settings')}>Settings</Link>
        </nav>
        <div className="p-4 border-t border-blue-700 mt-auto sticky bottom-0 bg-gradient-to-b from-blue-800 to-blue-900">
          <p className="text-sm text-blue-200">
            Logged in as <span className="font-semibold">{admin?.name || 'Admin'}</span>
            {admin?.role && (
              <span className="block text-xs mt-1 text-blue-300">Role: {admin.role}</span>
            )}
          </p>
          <button 
            onClick={handleLogout}
            className="mt-2 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded transition duration-200 text-center block"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content - With left margin to make space for fixed sidebar */}
      <div className="flex-1 ml-64 bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/manage" element={<ManageStaffAdmin />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/subscriptions" element={<SubscriptionManagement />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </div>
    </div>
  );
};

export default StaffLayout; 
    