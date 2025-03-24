import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaPhone, FaEnvelope, FaEye, FaEdit, FaStar, FaRegStar, FaTag } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch clients data
  useEffect(() => {
    // Simulate fetching data
    const fetchClients = () => {
      setLoading(true);
      
      // Mock data for demo
      setTimeout(() => {
        const mockClients = [
          {
            id: 1,
            name: 'John Smith',
            email: 'johnsmith@example.com',
            phone: '+91 98765 43210',
            type: 'buyer',
            status: 'active',
            lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            isFavorite: true,
            interests: ['Apartments', '2 BHK', 'Central Delhi'],
            notes: 'Looking for property in central area. Budget around 1.5 CR.'
          },
          {
            id: 2,
            name: 'Priya Sharma',
            email: 'priyasharma@example.com',
            phone: '+91 87654 32109',
            type: 'seller',
            status: 'active',
            lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
            isFavorite: false,
            interests: ['Villa', 'Gurgaon', 'Premium'],
            notes: 'Has a premium property to sell in Gurgaon.'
          },
          {
            id: 3,
            name: 'Rajesh Kumar',
            email: 'rajeshkumar@example.com',
            phone: '+91 76543 21098',
            type: 'buyer',
            status: 'inactive',
            lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
            isFavorite: false,
            interests: ['Apartments', '3 BHK', 'South Delhi'],
            notes: 'Was looking for property but has paused the search.'
          },
          {
            id: 4,
            name: 'Anita Desai',
            email: 'anitadesai@example.com',
            phone: '+91 65432 10987',
            type: 'seller',
            status: 'active',
            lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
            isFavorite: true,
            interests: ['Commercial', 'Office Space', 'Noida'],
            notes: 'Has multiple commercial properties to list. High priority.'
          },
          {
            id: 5,
            name: 'Sanjay Patel',
            email: 'sanjaypatel@example.com',
            phone: '+91 54321 09876',
            type: 'buyer',
            status: 'active',
            lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
            isFavorite: false,
            interests: ['Villa', 'Farmhouse', 'Gurgaon'],
            notes: 'Looking for a luxury property. Budget 5CR+'
          },
          {
            id: 6,
            name: 'Meera Kapoor',
            email: 'meerakapoor@example.com',
            phone: '+91 43210 98765',
            type: 'buyer',
            status: 'active',
            lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            isFavorite: false,
            interests: ['Apartments', '4 BHK', 'Premium', 'Golf Course Road'],
            notes: 'Looking for a premium apartment. Prefers new constructions.'
          }
        ];
        
        setClients(mockClients);
        setLoading(false);
      }, 800);
    };
    
    fetchClients();
  }, []);

  // Format date to readable string
  const formatDate = (date) => {
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 day
    if (diff < 1000 * 60 * 60 * 24) {
      return 'Today';
    }
    
    // Less than 7 days
    if (diff < 1000 * 60 * 60 * 24 * 7) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    
    // Otherwise format as date
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Toggle favorite status for a client
  const toggleFavorite = (id) => {
    setClients(clients.map(client => 
      client.id === id ? { ...client, isFavorite: !client.isFavorite } : client
    ));
  };

  // Filter clients based on search and filter
  const filteredClients = clients.filter(client => {
    // Search filter
    const matchesSearch = 
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase()) ||
      client.phone.toLowerCase().includes(search.toLowerCase());
    
    // Type/status filter
    let matchesFilter = true;
    if (filter === 'buyers') {
      matchesFilter = client.type === 'buyer';
    } else if (filter === 'sellers') {
      matchesFilter = client.type === 'seller';
    } else if (filter === 'active') {
      matchesFilter = client.status === 'active';
    } else if (filter === 'inactive') {
      matchesFilter = client.status === 'inactive';
    } else if (filter === 'favorites') {
      matchesFilter = client.isFavorite;
    }
    
    return matchesSearch && matchesFilter;
  });

  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Client Management</h1>
          <p className="text-gray-600 mt-1">Manage and track all your clients</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition duration-200">
            <span className="mr-2">+</span> Add New Client
          </button>
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="w-full md:w-1/2 lg:w-1/3 relative">
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <div className="flex items-center mt-4 md:mt-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-700 hover:text-blue-600 mr-4"
            >
              <FaFilter className="mr-2" />
              <span>Filters</span>
            </button>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Clients</option>
              <option value="buyers">Buyers</option>
              <option value="sellers">Sellers</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="favorites">Favorites</option>
            </select>
          </div>
        </div>
        
        {/* Additional Filters - Hidden by default */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Contact</label>
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option>Any time</option>
                <option>Today</option>
                <option>This week</option>
                <option>This month</option>
                <option>More than 30 days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option>All interests</option>
                <option>Apartments</option>
                <option>Villas</option>
                <option>Commercial</option>
                <option>Farmhouse</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option>Name (A-Z)</option>
                <option>Name (Z-A)</option>
                <option>Last contact (Recent first)</option>
                <option>Last contact (Oldest first)</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Client List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full">
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-2 py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-3">Client</div>
              <div className="col-span-2">Contact</div>
              <div className="col-span-2">Type / Status</div>
              <div className="col-span-2">Last Contact</div>
              <div className="col-span-2">Interests</div>
              <div className="col-span-1 text-center">Actions</div>
            </div>
          </div>
          
          <div className="bg-white divide-y divide-gray-200">
            {filteredClients.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No clients found matching your criteria
              </div>
            ) : (
              filteredClients.map(client => (
                <div key={client.id} className="grid grid-cols-12 gap-2 py-4 px-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="col-span-3 flex items-center">
                    <button 
                      onClick={() => toggleFavorite(client.id)} 
                      className="mr-3 text-gray-400 hover:text-yellow-500"
                    >
                      {client.isFavorite ? 
                        <FaStar className="text-yellow-500" /> : 
                        <FaRegStar />
                      }
                    </button>
                    <div>
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{client.notes}</p>
                    </div>
                  </div>
                  
                  <div className="col-span-2 text-sm text-gray-500 flex flex-col justify-center">
                    <div className="flex items-center mb-1">
                      <FaEnvelope className="mr-2 text-gray-400" />
                      <a href={`mailto:${client.email}`} className="hover:text-blue-600">{client.email}</a>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="mr-2 text-gray-400" />
                      <a href={`tel:${client.phone}`} className="hover:text-blue-600">{client.phone}</a>
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex flex-col justify-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.type === 'buyer' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {client.type === 'buyer' ? 'Buyer' : 'Seller'}
                    </span>
                    <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {client.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="col-span-2 flex items-center text-sm text-gray-500">
                    {formatDate(client.lastContact)}
                  </div>
                  
                  <div className="col-span-2 flex flex-wrap items-center">
                    {client.interests.slice(0, 2).map((interest, index) => (
                      <span key={index} className="mr-1 mb-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        <FaTag className="mr-1 text-gray-400" size={10} />
                        {interest}
                      </span>
                    ))}
                    {client.interests.length > 2 && (
                      <span className="text-xs text-gray-500">+{client.interests.length - 2} more</span>
                    )}
                  </div>
                  
                  <div className="col-span-1 flex items-center justify-center space-x-2">
                    <button className="text-gray-400 hover:text-blue-600 p-1" title="View Client">
                      <FaEye />
                    </button>
                    <button className="text-gray-400 hover:text-green-600 p-1" title="Edit Client">
                      <FaEdit />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {filteredClients.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredClients.length}</span> of{' '}
              <span className="font-medium">{clients.length}</span> clients
            </div>
            <div className="flex-1 flex justify-end">
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Export List
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManagement; 