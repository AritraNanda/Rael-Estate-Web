import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';

export default function MyListings() {
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);
  //const { currentUser } = useSelector((state) => state.user);
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


    const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
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
                  onClick={() => handleListingDelete(listing._id)}
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
    </div>
  );
}