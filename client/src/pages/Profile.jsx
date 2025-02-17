import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import supabase from '../supabase'; // Import Supabase

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);  // Upload progress state
  const [fileUploading, setFileUploading] = useState(false); // Tracks if upload is in progress
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({
    avatar: currentUser?.avatar || "https://i.ibb.co/yncvwSRK/profile-circle-svgrepo-com.png"
  }); //until a new image is uploaded, the old image is the avatar
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const sanitizeFileName = (fileName) => {
    return fileName
      .replace(/[^\w.-]+/g, '_') // Replace non-alphanumeric characters (except underscores, periods, and dashes) with underscores
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/:/g, '-') // Replace colons with dashes
      .replace(/[ ]/g, ''); // Remove non-breaking space characters ( )
  };
  

  const handleFileUpload = async (file) => {
    if (file.size > MAX_FILE_SIZE) {
      setFileUploadError(true);
      return;
    }
  
    try {
      setFileUploading(true); // Start upload animation
      setFilePerc(10); // Simulate starting progress
  
      // Sanitize the file name to avoid special characters causing issues
      const sanitizedFileName = sanitizeFileName(new Date().getTime() + "_" + file.name);
  
      // Upload file to Supabase
      const { data, error } = await supabase.storage
        .from('avatar')  // Bucket name
        .upload(sanitizedFileName, file, {
          cacheControl: '3600',
          upsert: false,
        });
  
      if (error) {
        setFileUploadError(true);
        throw error;
      }
  
      // Simulate upload progress completion
      setFilePerc(100);
  
      // Delay to simulate smoother UI transition
      setTimeout(() => setFileUploading(false), 500); // Hide after short delay
  
      // Get the public URL and update the form data
      const { data: publicUrlData } = supabase.storage
        .from('avatar')
        .getPublicUrl(sanitizedFileName);
  
      setFormData({ ...formData, avatar: publicUrlData.publicUrl });
      setFileUploadError(false);
  
    } catch (error) {
      console.error('Error uploading file:', error.message);
      setFileUploadError(true);
      setFileUploading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white shadow-lg rounded-[16px] overflow-hidden p-6 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl text-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">Profile</h1>

        {/* Avatar with Upload Progress */}
        <div className="relative w-24 h-24 mx-auto">
          <img
            src={formData.avatar}
            alt="Profile"
            className={`w-24 h-24 rounded-full object-cover cursor-pointer ${fileUploading ? "opacity-50" : ""}`}
            onClick={() => setIsModalOpen(true)}
          />
          <label
            htmlFor="avatar"
            className="absolute bottom-0 right-1 bg-blue-600 text-white text-xs p-1 rounded-full cursor-pointer hover:bg-blue-700 transition"
          >
            ✎
          </label>
          <input 
            onChange={(e) => setFile(e.target.files[0])} 
            type="file" 
            id="avatar" 
            className="hidden" 
            accept="image/*" 
          />

          {/* Upload Progress Indicator */}
          {fileUploading && (
            <div className="absolute top-0 left-0 right-0 text-center bg-black bg-opacity-50 text-white text-xs py-1">
              {filePerc < 100 ? `Uploading... ${filePerc}%` : "Upload Complete ✅"}
            </div>
          )}
        </div>

        {/* Upload Error Message */}
        {fileUploadError && (
          <p className="text-red-500 text-sm mt-2">
            Error uploading file (must be less than 2mb)
          </p>
        )}

        {/* User Details */}
        <div className="mt-4">
          <label className="text-gray-600 font-semibold block mb-1">Full Name</label>
          <input
            type="text"
            value={currentUser?.username || "Guest User"}
            className="w-full border-2 border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        </div>

        <div className="mt-4">
          <label className="text-gray-600 font-semibold block mb-1">Email</label>
          <input
            type="email"
            value={currentUser?.email || "guest@example.com"}
            className="w-full border-2 border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        </div>

        <div className="mt-4">
          <label className="text-gray-600 font-semibold block mb-1">Password</label>
          <input
            type="password"
            value="********"
            className="w-full border-2 border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        </div>

        <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          Update Profile
        </button>

        <button className="mt-3 w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">
          <FiLogOut className="text-xl" />
          Sign Out
        </button>

        <button className="mt-3 w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition">
          <MdDelete className="text-xl" />
          Delete Account
        </button>
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-md"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="p-2 bg-transparent rounded-lg">
            <img
              src={formData.avatar}
              alt="Profile Preview"
              className="w-64 h-64 rounded-full object-cover"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
