import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import { FaSearch, FaMapMarkerAlt, FaRegCompass } from 'react-icons/fa';
import { MdOutlineVilla, MdOutlineApartment } from 'react-icons/md';
import { BsBuildings, BsArrowRight } from 'react-icons/bs';
import Preloader from '../components/Preloader';

export default function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  
  SwiperCore.use([Navigation, Pagination, Autoplay, EffectFade]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const [offerRes, rentRes, saleRes] = await Promise.all([
          fetch('/api/listing/get?offer=true&limit=4'),
          fetch('/api/listing/get?type=rent&limit=4'),
          fetch('/api/listing/get?type=sale&limit=4')
        ]);

        const [offerData, rentData, saleData] = await Promise.all([
          offerRes.json(),
          rentRes.json(),
          saleRes.json()
        ]);

        setOfferListings(offerData);
        setRentListings(rentData);
        setSaleListings(saleData);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) return <Preloader />;

  const displayListings = () => {
    switch (activeCategory) {
      case 'rent':
        return rentListings;
      case 'sale':
        return saleListings;
      case 'offer':
        return offerListings;
      default:
        const allListings = [...rentListings, ...saleListings];
        // Shuffle array and get 4 random items
        return allListings
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', searchTerm);
    navigate(`/buyer/search?${urlParams.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Dark Gradient Background */}
      <div className="relative h-[93vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 animate-gradient-x">
          <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-30" />
          <div className="absolute inset-0 bg-black/40" /> {/* Additional overlay for darkness */}
        </div>
        
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in drop-shadow-2xl">
              Your Dream Home Awaits
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-200">
              Discover luxury homes, modern apartments, and prime properties across India
            </p>
            
            {/* Search Bar with enhanced glassmorphism */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl p-2 rounded-full border border-white/10 shadow-2xl">
              <div className="flex items-center">
                <div className="flex-1 flex items-center gap-2 px-4">
                  <FaMapMarkerAlt className="text-2xl text-blue-400" />
                  <input
                    type="text"
                    placeholder="Enter location..."
                    className="w-full bg-transparent border-none focus:outline-none text-white placeholder-gray-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full transition-all flex items-center gap-2 shadow-lg"
                >
                  <FaSearch />
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Property Categories */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaRegCompass className="text-xl" />
              All Properties
            </button>
            <button
              onClick={() => setActiveCategory('rent')}
              className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all ${
                activeCategory === 'rent'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MdOutlineApartment className="text-xl" />
              For Rent
            </button>
            <button
              onClick={() => setActiveCategory('sale')}
              className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all ${
                activeCategory === 'sale'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MdOutlineVilla className="text-xl" />
              For Sale
            </button>
            <button
              onClick={() => setActiveCategory('offer')}
              className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all ${
                activeCategory === 'offer'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BsBuildings className="text-xl" />
              Special Offers
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayListings().map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to={`/buyer/search?${activeCategory !== 'all' ? `type=${activeCategory}` : ''}`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All Properties
              <BsArrowRight className="text-xl" />
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Cities */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                name: 'Mumbai',
                imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=2942&auto=format&fit=crop'
              },
              {
                name: 'Delhi',
                imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2940&auto=format&fit=crop'
              },
              {
                name: 'Bangalore',
                imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=2944&auto=format&fit=crop'
              },
              {
                name: 'Hyderabad',
                imageUrl: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=2940&auto=format&fit=crop'
              }
            ].map((city) => (
              <Link
                key={city.name}
                to={`/buyer/search?searchTerm=${city.name}`}
                className="group relative h-48 rounded-xl overflow-hidden"
              >
                <img
                  src={city.imageUrl}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{city.name}</h3>
                  <p className="text-sm text-white/80">View Properties</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Download App Section with Modern Design */}
      <div className="relative py-24 overflow-hidden bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="text-white space-y-8">
              <div className="space-y-4 relative">
                <div className="absolute -left-8 top-0 w-2 h-20 bg-blue-500 rounded-full" />
                <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Get the EstateBro App
                </h2>
                <p className="text-xl text-gray-300 max-w-lg">
                  Search properties, schedule viewings, and connect with agents right from your phone.
                </p>
              </div>
              
              {/* Features List */}
              <div className="grid grid-cols-2 gap-4 py-6">
                {[
                  { icon: '🔍', text: 'Quick Search' },
                  { icon: '📅', text: 'Easy Scheduling' },
                  { icon: '💬', text: 'Live Chat' },
                  { icon: '🏠', text: 'Virtual Tours' }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="text-gray-300">{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-6 pt-4">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download on App Store"
                  className="h-12 cursor-pointer hover:opacity-80 transition-opacity"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Play Store"
                  className="h-12 cursor-pointer hover:opacity-80 transition-opacity"
                />
              </div>

              {/* Social Proof */}
              <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-lg">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 border-2 border-blue-900 flex items-center justify-center">
                        <span className="text-xs">👤</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-white">Join our community</p>
                    <p className="text-sm text-gray-400">10,000+ users already using EstateBro</p>
                  </div>
                </div>
              </div>
            </div>

            {/* App Preview with Enhanced Styling */}
            <div className="hidden md:block relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl rounded-full" />
              <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-3xl backdrop-blur-xl border border-white/10">
                <img
                  src="https://iili.io/3KjGXb1.png"
                  alt="App Preview"
                  className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl"
                />
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}