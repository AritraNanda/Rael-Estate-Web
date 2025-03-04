import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { MdEdit, MdDelete } from 'react-icons/md';

export default function MyListings() {
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const { currentSeller } = useSelector((state) => state.seller);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setShowListingsError(false);
        const res = await fetch(`/api/user/listings/${currentSeller._id}`);
        const data = await res.json();
        if (data.success === false) {
          setShowListingsError(true);
          return;
        }
        setUserListings(data);
      } catch (error) {
        setShowListingsError(true);
      }
    };
    fetchListings();
  }, [currentSeller._id]);

  const confirmDelete = (listing) => {
    setListingToDelete(listing);
    setIsDeleteModalOpen(true);
  };

  const handleListingDelete = async () => {
    if (!listingToDelete) return;

    try {
      const res = await fetch(`/api/listing/delete/${listingToDelete._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingToDelete._id)
      );
      setIsDeleteModalOpen(false);
      setListingToDelete(null);
    } catch (error) {
      console.log(error.message);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setListingToDelete(null);
  };

  return (
    <div className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 text-blue-600'>Your Listings</h1>
      {showListingsError && (
        <p className='text-red-700 text-center'>Error showing listings</p>
      )}
      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4 hover:shadow-md transition-shadow'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-cover rounded-lg'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex gap-3 items-center'>
                <Link to={`/seller/update-listing/${listing._id}`}>
                  <button 
                    className='text-green-700 hover:text-green-900 p-2 rounded-full hover:bg-green-100 transition'
                    title="Edit listing"
                  >
                    <MdEdit size={20} />
                  </button>
                </Link>
              
                <button
                  onClick={() => confirmDelete(listing)}
                  className='text-red-700 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition'
                  title="Delete listing"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          ))}
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
            <h2 className="text-xl font-bold text-red-600 mb-4">Delete Listing</h2>
            <p className="text-gray-700 mb-6">
              <b>Are you sure</b> you want to delete "{listingToDelete?.name}"? This action <b>cannot be undone</b>.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleListingDelete}
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