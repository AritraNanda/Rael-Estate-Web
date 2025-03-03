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
  const { currentSeller } = useSelector((state) => state.seller);

  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

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
    <nav className="bg-white text-black shadow-md p-4 flex items-center justify-between w-full">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold">
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

        {/* Create Listing Button (YouTube Style) */}
        <Link to="/seller/create-listing">
          <button title="Create Listing" className="border border-gray-300 text-black px-4 py-2 rounded-3xl font-medium hover:bg-gray-100 transition">
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
                className="w-7 h-7 rounded-full object-cover cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
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
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
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
  );
}
