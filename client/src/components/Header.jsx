import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { FiLogOut, FiUser } from "react-icons/fi"; // Import FiUser for profile icon
import { 
  signOutUserStart, 
  signOutUserSuccess, 
  signOutUserFailure 
} from '../redux/user/userSlice'

export default function Header() {
  // State to toggle the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State to toggle the profile dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  // Ref for the dropdown menu
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();

  // Function to handle sign-out
  const handleSignOut = async () => {
  try {
    dispatch(signOutUserStart());
    const res = await fetch('/api/auth/signout', {
      method: 'POST', // Use POST method
      credentials: 'include', // Include cookies in the request
    });
    const data = await res.json();
    console.log("Sign Out Response:", data); // Log the response
    
    if (data.success === false) {
      dispatch(signOutUserFailure(data.message));
      return;
    }
    dispatch(signOutUserSuccess());
  } catch (error) {
    console.error("Sign Out Error:", error); // Log any errors
    dispatch(signOutUserFailure(error.message));
  }
};

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white text-black shadow-md p-4 flex items-center justify-between w-full">
      {/* Company Name */}
      <Link to="/" className="text-xl font-bold">
        <span className="text-blue-600">Estate</span>
        <span className="text-lightblue-600">Bro</span>
      </Link>

      {/* Search Bar */}
      <div className="flex-1 mx-4 max-w-md relative">
        <input
          type="text"
          placeholder="Search..."
          aria-label="Search"
          className="bg-gray-100 pl-10 py-2 px-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-3 text-gray-500" size={20} />
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center space-x-6">
        <Link to="/buyer/" className="text-gray-700 hover:text-blue-600">
          Home
        </Link>
        <Link to="/buyer/about" className="text-gray-700 hover:text-blue-600">
          About
        </Link>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          {currentUser ? (
            <div>
              <img
                src={currentUser.avatar}
                alt="Profile"
                className="w-7 h-7 rounded-full object-cover cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                  <Link
                    to="/buyer/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FiUser className="text-xl" /> {/* Profile icon */}
                    Profile
                  </Link>
                  <button
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={handleSignOut}
                  >
                    <FiLogOut className="text-xl" /> {/* Sign-out icon */}
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/buyer/profile">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Hamburger Icon */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-700 hover:text-blue-600 focus:outline-none"
        >
          <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
          <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
          <span className="block w-6 h-0.5 bg-gray-700"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md p-4 flex flex-col space-y-4">
          <Link
            to="/buyer/"
            className="text-gray-700 hover:text-blue-600 font-bold"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/buyer/about"
            className="text-gray-700 hover:text-blue-600 font-bold"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>

          {/* Profile and Sign Out Options */}
          {currentUser ? (
            <>

              <img
                src={currentUser.avatar}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />

              <Link
                to="/buyer/profile"
                className="text-gray-700 hover:text-blue-600 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <FiUser className="text-xl" /> {/* Profile icon */}
                Profile
              </Link>
              <button
                className="text-gray-700 hover:text-blue-600 flex items-center gap-2"
                onClick={handleSignOut}
              >
                <FiLogOut className="text-xl" /> {/* Sign-out icon */}
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/buyer/profile"
              className="text-gray-700 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
                Sign In
              </button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}