import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBed, FaBath, FaRupeeSign } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

export default function ListingItem({ listing }) {
  return (
    <div className='bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden'>
      <Link to={`/buyer/listing/${listing._id}`}>
        <div className='relative'>
          <img
            src={
              listing.imageUrls[0] ||
              'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
            }
            alt={listing.name}
            className='h-48 w-full object-cover'
          />
          {/* Property Type Badge */}
          <div className='absolute top-2 left-2'>
            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
              listing.type === 'rent' 
                ? 'bg-blue-600 text-white' 
                : 'bg-green-600 text-white'
            }`}>
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
          </div>
          {/* Verified Badge */}
          {/* <div className='absolute top-2 right-2'>
            <span className='bg-white/90 p-1 rounded-full'>
              <MdVerified className='text-blue-600 text-lg' />
            </span>
          </div> */}
        </div>

        <div className='p-4'>
          {/* Title */}
          <h3 className='text-lg font-semibold text-gray-900 mb-2 line-clamp-1'>
            {listing.name}
          </h3>

          {/* Location */}
          <div className='flex items-center gap-1 mb-3'>
            <FaMapMarkerAlt className='text-blue-600' />
            <p className='text-sm text-gray-600 line-clamp-1'>
              {listing.address}
            </p>
          </div>

          {/* Features */}
          <div className='flex items-center gap-4 mb-3 text-gray-600'>
            <div className='flex items-center gap-1'>
              <FaBed className='text-blue-600' />
              <span className='text-sm'>{listing.bedrooms} {listing.bedrooms > 1 ? 'beds' : 'bed'}</span>
            </div>
            <div className='flex items-center gap-1'>
              <FaBath className='text-blue-600' />
              <span className='text-sm'>{listing.bathrooms} {listing.bathrooms > 1 ? 'baths' : 'bath'}</span>
            </div>
          </div>

          {/* Price */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1'>
              <FaRupeeSign className='text-blue-600' />
              <span className='text-lg font-bold text-gray-900'>
                {listing.offer
                  ? listing.discountPrice.toLocaleString('en-IN')
                  : listing.regularPrice.toLocaleString('en-IN')}
                {listing.type === 'rent' && <span className='text-sm text-gray-600'>/month</span>}
              </span>
            </div>
            {listing.offer && (
              <span className='text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full'>
                {Math.round((listing.regularPrice - listing.discountPrice) / listing.regularPrice * 100)}% off
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
} 