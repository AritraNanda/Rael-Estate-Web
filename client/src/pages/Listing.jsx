import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css/bundle';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaRegHeart,
  FaHeart,
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

export default function Listing() {
  SwiperCore.use([Navigation, Pagination, EffectFade]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        console.log('Current params:', params);
        console.log('ListingId type:', typeof params.id);
        console.log('ListingId value:', params.id);

        if (!params.id) {
          throw new Error('No listing ID provided');
        }

        setLoading(true);
        setError(false);
        setErrorMessage('');

        console.log('Fetching listing with ID:', params.id);

        const response = await fetch(`/api/listing/get/${params.id}`);
        console.log('Response status:', response.status);

        const data = await response.json();
        console.log('Received data:', data);

        if (data && data._id) {
          console.log('Setting listing data:', data);
          setListing(data);
          setError(false);
        } else {
          throw new Error('Invalid data received from server');
        }
      } catch (error) {
        console.error('Error in fetchListing:', error);
        setError(true);
        setErrorMessage(error.message || 'Failed to fetch listing details');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-2">We couldn't load the listing details.</p>
        <p className="text-sm text-gray-500">{errorMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
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

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 z-10 flex gap-3">
            <button
              onClick={() => setFavorite(!favorite)}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all transform hover:scale-110 hover:shadow-xl"
            >
              {favorite ? (
                <FaHeart className="text-red-500 text-xl" />
              ) : (
                <FaRegHeart className="text-gray-600 text-xl" />
              )}
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all transform hover:scale-110 hover:shadow-xl relative"
            >
              <FaShare className="text-gray-600 text-xl" />
              {copied && (
                <span className="absolute -bottom-12 right-0 bg-black text-white text-xs py-2 px-3 rounded-lg shadow-lg">
                  Link copied!
                </span>
              )}
            </button>
          </div>
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
                    <p className="text-sm text-gray-600">Listed by verified agent</p>
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
                      <span className="font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">Available</span>
                    </div>
                  </div>
                </div>

                {/* Contact Button */}
                <div className="mt-8">
                  {currentUser && listing.userRef !== currentUser._id && !contact && (
                    <button 
                      onClick={() => setContact(true)} 
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2 font-semibold"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                      </svg>
                      Contact Landlord
                    </button>
                  )}
                  {contact && (
                    <div className="mt-4">
                      <Contact listing={listing} />
                      <button 
                        onClick={() => setContact(false)}
                        className="w-full mt-4 bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        Close Contact Form
                      </button>
                    </div>
                  )}
                  {!currentUser && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Please sign in to contact the property owner
                    </p>
                  )}
                  {currentUser && listing.userRef === currentUser._id && (
                    <p className="text-xs text-gray-500 text-center">
                      This is your listing
                    </p>
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