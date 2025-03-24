import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSpinner, FaTimes, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaEye } from 'react-icons/fa';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchListings();
  }, [page]);

  const fetchListings = async () => {
    try {
      const res = await fetch(`/api/listing/recent?page=${page}`);
      const data = await res.json();
      if (data.success) {
        if (page === 1) {
          setListings(data.listings);
        } else {
          setListings(prev => [...prev, ...data.listings]);
        }
        setHasMore(data.hasMore);
      } else {
        toast.error('Failed to fetch listings');
      }
    } catch (error) {
      toast.error('Error fetching listings');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handlePreview = (listing) => {
    setSelectedListing(listing);
    setShowPreview(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const PreviewModal = ({ listing, onClose }) => {
    if (!listing) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{listing.title}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Image Gallery */}
            <div className="mb-6">
              <img
                src={listing.imageUrls[0]}
                alt={listing.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="grid grid-cols-4 gap-2 mt-2">
                {listing.imageUrls.slice(1, 5).map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`${listing.title} ${index + 2}`}
                    className="w-full h-20 object-cover rounded"
                  />
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Property Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{listing.address}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaBed className="mr-2" />
                    <span>{listing.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaBath className="mr-2" />
                    <span>{listing.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaRulerCombined className="mr-2" />
                    <span>{listing.area} sq ft</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Price</h4>
                  <p className="text-2xl text-blue-600 font-bold">
                    {formatPrice(listing.regularPrice)}
                    {listing.type === 'rent' && ' /month'}
                  </p>
                  {listing.discountPrice > 0 && (
                    <p className="text-green-600 mt-1">
                      Discount: {formatPrice(listing.discountPrice)}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Description</h3>
                <p className="text-gray-600">{listing.description}</p>
                
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Features</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {listing.features?.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading && page === 1) {
    return (
      <div className="p-8 flex justify-center">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Recent Listings</h2>

        {/* Table View */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {listings.map((listing, index) => (
                <tr 
                  key={listing._id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-20 w-20 flex-shrink-0">
                        <img
                          src={listing.imageUrls[0]}
                          alt={listing.title}
                          className="h-20 w-20 object-cover rounded"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {listing.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          Listed by: {listing.userRef?.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 truncate max-w-xs">
                      {listing.address}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <span className="flex items-center">
                        <FaBed className="mr-1" /> {listing.bedrooms} |
                        <FaBath className="mx-1" /> {listing.bathrooms} |
                        <FaRulerCombined className="mx-1" /> {listing.area} sq ft
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-blue-600">
                      {formatPrice(listing.regularPrice)}
                      {listing.type === 'rent' && '/month'}
                    </div>
                    {listing.discountPrice > 0 && (
                      <div className="text-sm text-green-600">
                        Discount: {formatPrice(listing.discountPrice)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      listing.type === 'rent' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handlePreview(listing)}
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                    >
                      <FaEye className="mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-6 text-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Loading...
                </>
              ) : (
                'See More'
              )}
            </button>
          </div>
        )}

        {showPreview && (
          <PreviewModal
            listing={selectedListing}
            onClose={() => {
              setShowPreview(false);
              setSelectedListing(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Listings; 