import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import Preloader from '../components/Preloader';
import { FaSearch, FaFilter, FaSort } from 'react-icons/fa';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/buyer/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar */}
          <div className='lg:w-1/4'>
            <div className='bg-white rounded-xl shadow-lg p-6'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2'>
                <FaFilter className='text-blue-600' />
                Filters
              </h2>
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Search Input */}
                <div className='relative'>
                  <input
                    type='text'
                    id='searchTerm'
                    placeholder='Search properties...'
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    value={sidebardata.searchTerm}
                    onChange={handleChange}
                  />
                  <FaSearch className='absolute left-3 top-3 text-gray-400' />
                </div>

                {/* Property Type */}
                <div className='space-y-3'>
                  <h3 className='font-semibold text-gray-900'>Property Type</h3>
                  <div className='space-y-2'>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        id='all'
                        className='w-5 h-5 text-blue-600 rounded focus:ring-blue-500'
                        onChange={handleChange}
                        checked={sidebardata.type === 'all'}
                      />
                      <span>All Properties</span>
                    </label>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        id='rent'
                        className='w-5 h-5 text-blue-600 rounded focus:ring-blue-500'
                        onChange={handleChange}
                        checked={sidebardata.type === 'rent'}
                      />
                      <span>For Rent</span>
                    </label>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        id='sale'
                        className='w-5 h-5 text-blue-600 rounded focus:ring-blue-500'
                        onChange={handleChange}
                        checked={sidebardata.type === 'sale'}
                      />
                      <span>For Sale</span>
                    </label>
                  </div>
                </div>

                {/* Amenities */}
                <div className='space-y-3'>
                  <h3 className='font-semibold text-gray-900'>Amenities</h3>
                  <div className='space-y-2'>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        id='parking'
                        className='w-5 h-5 text-blue-600 rounded focus:ring-blue-500'
                        onChange={handleChange}
                        checked={sidebardata.parking}
                      />
                      <span>Parking Available</span>
                    </label>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        id='furnished'
                        className='w-5 h-5 text-blue-600 rounded focus:ring-blue-500'
                        onChange={handleChange}
                        checked={sidebardata.furnished}
                      />
                      <span>Furnished</span>
                    </label>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        id='offer'
                        className='w-5 h-5 text-blue-600 rounded focus:ring-blue-500'
                        onChange={handleChange}
                        checked={sidebardata.offer}
                      />
                      <span>Special Offer</span>
                    </label>
                  </div>
                </div>

                {/* Sort */}
                <div className='space-y-3'>
                  <h3 className='font-semibold text-gray-900 flex items-center gap-2'>
                    <FaSort className='text-blue-600' />
                    Sort By
                  </h3>
                  <select
                    onChange={handleChange}
                    defaultValue={'created_at_desc'}
                    id='sort_order'
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  >
                    <option value='regularPrice_desc'>Price: High to Low</option>
                    <option value='regularPrice_asc'>Price: Low to High</option>
                    <option value='createdAt_desc'>Latest</option>
                    <option value='createdAt_asc'>Oldest</option>
                  </select>
                </div>

                <button className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2'>
                  <FaSearch />
                  Search Properties
                </button>
              </form>
            </div>
          </div>

          {/* Main Content */}
          <div className='lg:w-3/4'>
            <div className='bg-white rounded-xl shadow-lg p-6'>
              <h1 className='text-2xl font-bold text-gray-900 mb-6'>
                Search Results
                {listings.length > 0 && (
                  <span className='text-gray-500 text-lg font-normal ml-2'>
                    ({listings.length} properties found)
                  </span>
                )}
              </h1>

              {listings.length === 0 ? (
                <div className='text-center py-12'>
                  <p className='text-gray-600 text-lg mb-4'>No properties found matching your criteria</p>
                  <button
                    onClick={() => navigate('/buyer')}
                    className='text-blue-600 hover:underline'
                  >
                    View all properties
                  </button>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {listings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing} />
                  ))}
                </div>
              )}

              {showMore && (
                <div className='text-center mt-8'>
                  <button
                    onClick={onShowMoreClick}
                    className='bg-blue-50 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-100 transition-colors'
                  >
                    Load More Properties
                  </button>
                </div>
              )}
            </div>
            <p>Main</p>
          </div>
        </div>
      </div>
    </div>
  );
} 