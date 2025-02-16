import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi"; // Sign Out Icon
import { MdDelete } from "react-icons/md"; // Delete Icon

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-[16px] overflow-hidden p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">Profile</h1>

        {/* Avatar */}
        <div className="relative w-24 h-24 mx-auto">
          <img
            src={currentUser?.avatar || "https://i.ibb.co/yncvwSRK/profile-circle-svgrepo-com.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover cursor-pointer"
            onClick={() => setIsModalOpen(true)} // Open modal on click
          />
          <label
            htmlFor="avatar"
            className="absolute bottom-0 right-1 bg-blue-600 text-white text-xs p-1 rounded-full cursor-pointer hover:bg-blue-700 transition"
          >
            ✎
          </label>
          <input type="file" id="avatar" className="hidden" />
        </div>

        {/* Name */}
        <div className="mt-4">
          <label className="text-gray-600 font-semibold block mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={currentUser?.username || "Guest User"}
            className="w-full border-2 border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        </div>

        {/* Email */}
        <div className="mt-4">
          <label className="text-gray-600 font-semibold block mb-1">Email</label>
          <input
            type="email"
            value={currentUser?.email || "guest@example.com"}
            className="w-full border-2 border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        </div>

        {/* Password */}
        <div className="mt-4">
          <label className="text-gray-600 font-semibold block mb-1">
            Password
          </label>
          <input
            type="password"
            value="********"
            className="w-full border-2 border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        </div>

        {/* Update Profile Button */}
        <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          Update Profile
        </button>

        {/* Sign Out Button */}
        <button className="mt-3 w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">
          <FiLogOut className="text-xl" />
          Sign Out
        </button>

        {/* Delete Account Button */}
        <button className="mt-3 w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition">
          <MdDelete className="text-xl" />
          Delete Account
        </button>
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-md"
          onClick={() => setIsModalOpen(false)} // Close modal on click
        >
          <div className="p-2 bg-transparent rounded-lg">
            <img
              src={currentUser?.avatar || "https://i.ibb.co/yncvwSRK/profile-circle-svgrepo-com.png"}
              alt="Profile Preview"
              className="w-64 h-64 rounded-full object-cover"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
            />
          </div>
        </div>
      )}
    </div>
  );
}
