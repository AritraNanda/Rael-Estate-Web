import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaMapMarkerAlt, FaBed, FaBath } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Preloader from '../components/Preloader';

export default function SavedProperties() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [savedProperties, setSavedProperties] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/buyer/sign-in');
      return;
    }

    const fetchSavedProperties = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch('/api/saved/get', {
          credentials: 'include'
        });
        const data = await res.json();
        console.log('Fetched saved properties:', data);

        if (data.success === false) {
          setError(true);
          return;
        }

        setSavedProperties(data.savedProperties || []);
      } catch (error) {
        console.error('Error fetching saved properties:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, [currentUser, navigate]);

  const handleUnsave = async (listingId) => {
    try {
      const res = await fetch(`/api/saved/unsave/${listingId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        setSavedProperties((prev) =>
          prev.filter((property) => property._id !== listingId)
        );
      }
    } catch (error) {
      console.error('Error removing property:', error);
    }
  };

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <h2 className='text-2xl font-bold text-red-600 mb-4'>
          Something went wrong!
        </h2>
        <button
          onClick={() => window.location.reload()}
          className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto py-8 px-4'>
      <h1 className='text-3xl font-bold mb-8 text-center'>Saved Properties</h1>
      {savedProperties.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-gray-600 mb-4'>No saved properties yet</p>
          <Link
            to='/buyer'
            className='text-blue-600 hover:underline'
          >
            Browse properties
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {savedProperties.map((listing) => (
            <div
              key={listing._id}
              className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow'
            >
              <Link to={`/buyer/listing/${listing._id}`}>
                <div className='relative h-[200px]'>
                  <img
                    src={listing.imageUrls[0]}
                    alt={listing.name}
                    className='h-full w-full object-cover'
                  />
                  {listing.type === 'rent' && (
                    <span className='absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md text-sm'>
                      For Rent
                    </span>
                  )}
                </div>
              </Link>
              <div className='p-4'>
                <div className='flex justify-between items-start mb-4'>
                  <Link to={`/buyer/listing/${listing._id}`}>
                    <h3 className='text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-1'>
                      {listing.name}
                    </h3>
                  </Link>
                  <button
                    onClick={() => handleUnsave(listing._id)}
                    className='text-red-500 hover:text-red-600'
                  >
                    <FaHeart className='text-xl' />
                  </button>
                </div>
                <div className='flex items-center gap-2 text-gray-600 mb-2'>
                  <FaMapMarkerAlt className='text-blue-600' />
                  <p className='line-clamp-1'>{listing.address}</p>
                </div>
                <div className='flex items-center gap-4 text-gray-600 mb-4'>
                  <div className='flex items-center gap-1'>
                    <FaBed className='text-blue-600' />
                    <span>{listing.bedrooms} bed</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <FaBath className='text-blue-600' />
                    <span>{listing.bathrooms} bath</span>
                  </div>
                </div>
                <div className='flex justify-between items-center'>
                  <p className='text-lg font-bold text-blue-600'>
                    ₹{(listing.offer ? listing.discountPrice : listing.regularPrice).toLocaleString('en-US')}
                    {listing.type === 'rent' && <span className='text-sm text-gray-500'>/month</span>}
                  </p>
                  {listing.offer && (
                    <span className='text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full'>
                      {Math.round((listing.regularPrice - listing.discountPrice) / listing.regularPrice * 100)}% off
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 