import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiLogOut, FiUser, FiList } from "react-icons/fi"; 
import { useSelector, useDispatch } from "react-redux";
import {
  signOutSellerStart,
  signOutSellerSuccess,
  signOutSellerFailure,
} from "../redux/user/sellerSlice";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentSeller } = useSelector((state) => state.seller);

  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      dispatch(signOutSellerStart());
      const res = await fetch("/api/auth/signout2", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutSellerFailure(data.message));
        return;
      }
      dispatch(signOutSellerSuccess());
    } catch (error) {
      dispatch(signOutSellerFailure(error.message));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Spacer div to prevent content jump when header becomes fixed */}
      <div className="h-[72px] md:block hidden" />
      
      <nav className={`bg-white text-black shadow-md md:fixed md:top-0 md:left-0 md:right-0 md:z-50 transition-all duration-300`}>
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? 'md:h-[56px]' : 'md:h-[72px]'
          } h-[72px]`}>
            {/* Logo */}
            <Link to="/" className={`text-xl font-bold transition-all duration-300 ${
              isScrolled ? 'md:scale-90' : ''
            }`}>
              <span className="text-blue-600">Estate</span>
              <span className="text-lightblue-600">Bro</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/seller" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
              <Link to="/seller/about" className="text-gray-700 hover:text-blue-600">
                About
              </Link>
              <Link to="/seller/guide" className="text-gray-700 hover:text-blue-600">
                Guide
              </Link>
              <Link to="/seller/contact-support" className="text-gray-700 hover:text-blue-600">
                Contact
              </Link>

              {/* Create Listing Button (YouTube Style) */}
              <Link to="/seller/create-listing">
                <button title="Create Listing" className={`border border-gray-300 text-black font-medium hover:bg-gray-100 transition-all duration-300 ${
                  isScrolled ? 'md:px-3 md:py-1.5 md:text-sm' : 'md:px-4 md:py-2'
                } px-4 py-2 rounded-3xl`}>
                  + Create
                </button>
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                {currentSeller ? (
                  <div>
                    <img
                      src={currentSeller.avatar}
                      alt="Profile"
                      className={`rounded-full object-cover cursor-pointer transition-all duration-300 ${
                        isScrolled ? 'md:w-6 md:h-6' : 'md:w-7 md:h-7'
                      } w-7 h-7`}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    />

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                        <Link
                          to="/seller/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FiUser className="text-xl" />
                          Profile
                        </Link>
                        <Link
                          to="/seller/my-listings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FiList className="text-xl" />
                          My Listings
                        </Link>
                        <button
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          onClick={handleSignOut}
                        >
                          <FiLogOut className="text-xl" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/seller/signin">
                    <button className={`bg-blue-600 text-white rounded-md transition-all duration-300 ${
                      isScrolled ? 'md:px-3 md:py-1.5 md:text-sm' : 'md:px-4 md:py-2'
                    } px-4 py-2`}>
                      Sign In
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile View: Create Button & Menu Icon */}
            <div className="md:hidden flex items-center space-x-4">
              <Link to="/seller/create-listing">
                <button className="border border-gray-300 text-black px-4 py-2 rounded-3xl font-medium hover:bg-gray-100 transition">
                  + Create
                </button>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
                <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
                <span className="block w-6 h-0.5 bg-gray-700"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md p-4 flex flex-col space-y-4">
            <Link
              to="/seller"
              className="text-gray-700 hover:text-blue-600 font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/seller/about"
              className="text-gray-700 hover:text-blue-600 font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/seller/guide"
              className="text-gray-700 hover:text-blue-600 font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              Guide
            </Link>
            <Link
              to="/seller/contact-support"
              className="text-gray-700 hover:text-blue-600 font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Profile and Sign Out Options */}
            {currentSeller ? (
              <>
                <img
                  src={currentSeller.avatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />

                <Link
                  to="/seller/profile"
                  className="text-gray-700 hover:text-blue-600 flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser className="text-xl" />
                  Profile
                </Link>
                <Link
                  to="/seller/my-listings"
                  className="text-gray-700 hover:text-blue-600 flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiList className="text-xl" />
                  My Listings
                </Link>
                <button
                  className="text-gray-700 hover:text-blue-600 flex items-center gap-2"
                  onClick={handleSignOut}
                >
                  <FiLogOut className="text-xl" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/seller/signin"
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
    </>
  );
}
