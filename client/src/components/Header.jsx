import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import {useSelector} from "react-redux";

export default function Header() {
  // State to toggle the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {currentUser} = useSelector(state=>state.user)

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
        <Link to="/" className="text-gray-700 hover:text-blue-600">
          Home
        </Link>
        <Link to="/about" className="text-gray-700 hover:text-blue-600">
          About
        </Link>
        <Link to="/profile">
        {currentUser?(
              <img 
              src={currentUser.avatar} 
              alt="Profile" 
              className="w-7 h-7 rounded-full object-cover"
            />
            
            ):(
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Sign In</button>)
            }
        </Link>
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
          <Link to="/" className="text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
            About
          </Link>
          <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
            {currentUser?(
              <img 
              src={currentUser.avatar} 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover"
            />
            
            ):(
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Sign In</button>)
            }
          </Link>
        </div>
      )}
    </nav>
  );
}
