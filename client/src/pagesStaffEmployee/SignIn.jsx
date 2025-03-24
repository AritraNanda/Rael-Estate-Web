import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/staffSlice';
import { toast } from 'react-toastify';

const SignIn = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    password: ''
  });
  
  const { loading, currentStaff, error } = useSelector((state) => state.staff);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentStaff) {
      navigate('/staff-employee');
    }
  }, [currentStaff, navigate]);

  // Show error toast when error state changes
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.employeeId || !formData.password) {
      toast.error('Please fill in all fields', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      return;
    }

    try {
      dispatch(signInStart());

      const res = await fetch('/api/staff/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emp_id: formData.employeeId,
          password: formData.password
        }),
        credentials: 'include'
      });
      
      const data = await res.json();

      if (!data.success) {
        dispatch(signInFailure(data.message));
        return;
      }

      // Store staff data in Redux
      dispatch(signInSuccess(data.staff));
      
      // Show success toast
      toast.success('Login successful!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      // Navigate after delay to allow toast to be seen
      setTimeout(() => {
        navigate('/staff-employee');
      }, 3000);

    } catch (error) {
      console.error('Sign in error:', error);
      dispatch(signInFailure('Something went wrong! Please try again later.'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Staff Portal</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to access your staff dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
              Employee ID
            </label>
            <input
              id="employeeId"
              type="text"
              value={formData.employeeId}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your employee ID"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 flex items-center justify-center">
          <div className="text-sm">
            <Link to="/" className="font-medium text-blue-600 hover:text-blue-500">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 