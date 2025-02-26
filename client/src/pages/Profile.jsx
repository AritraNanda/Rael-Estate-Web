import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import supabase from '../supabase'; // Import Supabase
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);  // Upload progress state
  const [fileUploading, setFileUploading] = useState(false); // Tracks if upload is in progress
  const [fileUploadError, setFileUploadError] = useState(false); // Initialize formData as an empty object to track only changed fields
  const [formData, setFormData] = useState({}); // Keep the display avatar separate from the formData
  const [displayAvatar, setDisplayAvatar] = useState(
    currentUser?.avatar || "https://i.ibb.co/yncvwSRK/profile-circle-svgrepo-com.png"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // New state for delete confirmation modal
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);

  //console.log(formData);

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
      .replace(/[ ]/g, ''); // Remove non-breaking space characters ( )
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
  
      // Update the display avatar for UI
      setDisplayAvatar(publicUrlData.publicUrl);
      // Add avatar to formData since it's been updated
      setFormData({ ...formData, avatar: publicUrlData.publicUrl });
      setFileUploadError(false);
  
    } catch (error) {
      console.error('Error uploading file:', error.message);
      setFileUploadError(true);
      setFileUploading(false);
    }
  };

  const handleChange = (e) => {
    // Add the field to formData only when it's changed
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        toast.error(data.message);
        return;
      }

      toast.success("Profile updated successfully!");
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setFormData({});

    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error(error.message);
    }
  };


  const confirmDeleteUser = () => {
    // Open the delete confirmation modal
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        toast.error(data.message);
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success("Account deleted successfully");
      // No need to close modal here as the user will be redirected after deletion
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error(error.message);
      setIsDeleteModalOpen(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white shadow-lg rounded-[16px] overflow-hidden p-6 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl text-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">Profile</h1>

        {/* Avatar with Upload Progress */}
        <div className="relative w-24 h-24 mx-auto">
          <img
            src={displayAvatar}
            alt="Profile"
            className={`w-24 h-24 rounded-full object-cover cursor-pointer ${fileUploading ? "opacity-50" : ""}`}
            onClick={() => setIsModalOpen(true)}
          />
          <label
            htmlFor="avatar"
            className="absolute bottom-0 right-1 bg-blue-600 text-white text-xs p-1 rounded-full cursor-pointer hover:bg-blue-700 transition"
            title="edit"
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
            id="username"
            defaultValue={currentUser?.username || "Guest User"}
            className="w-full border-2 border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>

        <div className="mt-4">
          <label className="text-gray-600 font-semibold block mb-1">Email</label>
          <input
            type="email"
            id="email"
            defaultValue={currentUser?.email || "guest@example.com"}
            className="w-full border-2 border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            //onChange={handleChange}
            readOnly
            title="You can't modify your email"
          />
        </div>

        <div className="mt-4">
          <label className="text-gray-600 font-semibold block mb-1">Password</label>
          <input
            type="password"
            id="password"
            defaultValue="********"
            className="w-full border-2 border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>

        <button 
          onClick={handleSubmit}
          disabled={Object.keys(formData).length === 0}
          className={`mt-6 w-full py-2 rounded-lg font-semibold transition ${
            Object.keys(formData).length === 0 
              ? 'bg-blue-300 text-gray-100 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
          }`}
        >
          Update Profile
        </button>

        <button 
          onClick={confirmDeleteUser} 
          className="mt-3 w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          <MdDelete className="text-xl" />
          Delete Account
        </button>
      </div>

      {/* Image Preview Modal */}
      {isModalOpen && (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-md"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="p-2 bg-transparent rounded-lg">
            <img
              src={displayAvatar}
              alt="Profile Preview"
              className="w-64 h-64 rounded-full object-cover"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-md"
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-red-600 mb-4">Delete Account</h2>
            <p className="text-gray-700 mb-6">
              <b>Are you sure</b> you want to delete your account? This action <b>can not be undone</b> and all your data will be permanently removed.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-1"
              >
                <MdDelete /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}