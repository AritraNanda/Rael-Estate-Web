import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css/bundle';
import { useSelector } from 'react-redux';
import Preloader from '../components/Preloader';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaEdit,
  FaLock
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

export default function ListingPreview() {
  SwiperCore.use([Navigation, Pagination, EffectFade]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const params = useParams();
  const { currentSeller } = useSelector((state) => state.seller);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListingAndSubscription = async () => {
      try {
        if (!params.listingId) {
          throw new Error('No listing ID provided');
        }

        setLoading(true);
        setError(false);
        setErrorMessage('');

        // Fetch subscription status
        const subRes = await fetch('/api/demo-payment/subscription-status', {
          credentials: 'include'
        });
        const subData = await subRes.json();
        setHasActiveSubscription(subData.hasActiveSubscription);

        // Fetch listing details
        const response = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await response.json();

        if (data && data._id) {
          // Verify that the listing belongs to the current user
          if (data.userRef !== currentSeller._id) {
            navigate('/seller/my-listings');
            return;
          }
          setListing(data);
          setError(false);
        } else {
          throw new Error('Invalid data received from server');
        }
      } catch (error) {
        console.error('Error:', error);
        setError(true);
        setErrorMessage(error.message || 'Failed to fetch listing details');
      } finally {
        setLoading(false);
      }
    };

    fetchListingAndSubscription();
  }, [params.listingId, currentSeller._id, navigate]);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <Link
            to="/seller/my-listings"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to My Listings
          </Link>
        </div>
      </div>
    );
  }

  if (!listing) {
    return <Preloader />;
  }

  return (
    <main className="bg-gray-50 min-h-screen pt-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Image Gallery */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg mb-8">
          <Swiper
            navigation
            pagination={{ type: 'fraction' }}
            effect="fade"
            className="h-[75vh] bg-gray-100"
          >
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-full w-full"
                  style={{
                    background: `url(${url}) center center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Edit Button */}
          <Link
            to={`/seller/update-listing/${listing._id}`}
            className="absolute top-4 right-4 z-10 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all transform hover:scale-110 hover:shadow-xl"
          >
            <FaEdit className="text-blue-600 text-xl" />
          </Link>
        </div>

        {/* Content */}
        <div className="pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {listing.name}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarkerAlt className="text-blue-600" />
                      <p>{listing.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {listing.offer ? (
                      <>
                        <div className="flex items-center justify-end gap-2 mb-1">
                          <span className="text-3xl font-bold text-blue-600">
                            ₹{listing.discountPrice.toLocaleString('en-US')}
                            {listing.type === 'rent' && (
                              <span className="text-sm text-gray-500 ml-1">/month</span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-end gap-3">
                          <span className="text-lg text-gray-400 line-through">
                            ₹{listing.regularPrice.toLocaleString('en-US')}
                            {listing.type === 'rent' && (
                              <span> /month</span>
                            )}
                          </span>
                          <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            {Math.round((listing.regularPrice - listing.discountPrice) / listing.regularPrice * 100)}% off
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-3xl font-bold text-blue-600">
                          ₹{listing.regularPrice.toLocaleString('en-US')}
                        </span>
                        {listing.type === 'rent' && (
                          <span className="text-sm text-gray-500 ml-1">/month</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Property Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-gray-100">
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <FaBed className="text-3xl text-blue-600 mb-3" />
                    <p className="text-gray-600">
                      {listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <FaBath className="text-3xl text-blue-600 mb-3" />
                    <p className="text-gray-600">
                      {listing.bathrooms} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <FaParking className="text-3xl text-blue-600 mb-3" />
                    <p className="text-gray-600">
                      {listing.parking ? 'Parking' : 'No Parking'}
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <FaChair className="text-3xl text-blue-600 mb-3" />
                    <p className="text-gray-600">
                      {listing.furnished ? 'Furnished' : 'Unfurnished'}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-4">About this property</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {listing.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                    <MdVerified className="text-3xl text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Verified Property</h3>
                    <p className="text-sm text-gray-600">Your listed property</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold mb-4">Property Overview</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Listed</span>
                      <span className="font-medium">
                        {new Date(listing.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Property Type</span>
                      <span className="font-medium capitalize">{listing.type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status</span>
                      <span className="font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">Active</span>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="mt-8">
                  {hasActiveSubscription ? (
                    <Link
                      to={`/seller/update-listing/${listing._id}`}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2 font-semibold"
                    >
                      <FaEdit className="text-xl" />
                      Edit Property
                    </Link>
                  ) : (
                    <div className="space-y-4">
                      <button
                        disabled
                        className="w-full bg-gray-400 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold cursor-not-allowed"
                      >
                        <FaLock className="text-xl" />
                        Editing Locked
                      </button>
                      <p className="text-sm text-gray-600 text-center">
                        You need an active subscription to edit listings.{' '}
                        <Link to="/seller/subscription" className="text-blue-600 hover:underline">
                          Get Subscription
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 