import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { MdEdit, MdLock } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import Preloader from '../components/Preloader';
import Modal from '../components/Modal';

export default function MyListings() {
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showListingsError, setShowListingsError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const { currentSeller } = useSelector((state) => state.seller);

  useEffect(() => {
    const fetchListingsAndSubscription = async () => {
      try {
        // Fetch subscription status
        const subRes = await fetch('/api/demo-payment/subscription-status', {
          credentials: 'include'
        });
        const subData = await subRes.json();
        setHasActiveSubscription(subData.hasActiveSubscription);

        // Fetch listings
        const res = await fetch(`/api/user/listings/${currentSeller._id}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setUserListings(data);
          setShowListingsError(false);
        }
      } catch (error) {
        setShowListingsError(true);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchListingsAndSubscription();
  }, [currentSeller._id]);

  const confirmDelete = (listing) => {
    setListingToDelete(listing);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/listing/delete/${listingToDelete._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingToDelete._id)
      );
      toast.success('Listing deleted successfully');
    } catch (error) {
      toast.error('Error deleting listing');
    } finally {
      setShowDeleteModal(false);
      setListingToDelete(null);
    }
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className='p-3 max-w-4xl mx-auto'>
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className='text-3xl font-semibold text-center my-7 text-blue-600'>Your Listings</h1>
      
      {!hasActiveSubscription && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <MdLock className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your subscription is inactive. You can view your listings but cannot edit them.{' '}
                <Link to="/seller/subscription" className="font-medium underline hover:text-yellow-800">
                  Renew Subscription
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

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
              <Link to={`/seller/listing-preview/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-cover rounded-lg'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold hover:underline truncate flex-1'
                to={`/seller/listing-preview/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex gap-3 items-center'>
                {hasActiveSubscription ? (
                  <Link to={`/seller/update-listing/${listing._id}`}>
                    <button 
                      className='text-green-700 hover:text-green-900 p-2 rounded-full hover:bg-green-100 transition'
                      title="Edit listing"
                    >
                      <MdEdit size={20} />
                    </button>
                  </Link>
                ) : (
                  <button 
                    disabled
                    className='text-gray-400 p-2 rounded-full cursor-not-allowed'
                    title="Subscription required to edit"
                  >
                    <MdLock size={20} />
                  </button>
                )}
              
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
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
      >
        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete this listing? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}