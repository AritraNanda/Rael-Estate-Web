import { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell
} from 'recharts';
import { FaChartLine, FaChartBar, FaChartPie, FaCalendarAlt, FaMapMarkerAlt, FaHome, FaBuilding, FaUsers } from 'react-icons/fa';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');

  // Demo data for charts - Real estate specific
  const salesData = [
    { name: 'Jan', propertyViews: 2400, inquiries: 400, sales: 24 },
    { name: 'Feb', propertyViews: 1398, inquiries: 350, sales: 18 },
    { name: 'Mar', propertyViews: 9800, inquiries: 500, sales: 29 },
    { name: 'Apr', propertyViews: 3908, inquiries: 390, sales: 26 },
    { name: 'May', propertyViews: 4800, inquiries: 480, sales: 32 },
    { name: 'Jun', propertyViews: 3800, inquiries: 380, sales: 27 },
    { name: 'Jul', propertyViews: 4300, inquiries: 430, sales: 31 },
    { name: 'Aug', propertyViews: 2400, inquiries: 320, sales: 22 },
    { name: 'Sep', propertyViews: 1398, inquiries: 280, sales: 17 },
    { name: 'Oct', propertyViews: 9800, inquiries: 580, sales: 35 },
    { name: 'Nov', propertyViews: 3908, inquiries: 390, sales: 24 },
    { name: 'Dec', propertyViews: 4800, inquiries: 600, sales: 40 }
  ];

  const propertyTypeData = [
    { name: 'Apartments', value: 45 },
    { name: 'Houses', value: 30 },
    { name: 'Villas', value: 15 },
    { name: 'Commercial', value: 8 },
    { name: 'Land', value: 2 }
  ];

  const locationData = [
    { name: 'Downtown', listings: 240, sales: 120, avgPrice: 850000 },
    { name: 'Suburbs', listings: 380, sales: 170, avgPrice: 450000 },
    { name: 'Beachfront', listings: 120, sales: 80, avgPrice: 1200000 },
    { name: 'Rural', listings: 90, sales: 40, avgPrice: 300000 },
    { name: 'Urban', listings: 210, sales: 95, avgPrice: 550000 }
  ];

  const userActivityData = [
    { name: '00:00', users: 30 },
    { name: '03:00', users: 20 },
    { name: '06:00', users: 35 },
    { name: '09:00', users: 150 },
    { name: '12:00', users: 200 },
    { name: '15:00', users: 220 },
    { name: '18:00', users: 180 },
    { name: '21:00', users: 100 }
  ];

  const priceRangeData = [
    { name: 'Under ₹25L', value: 15 },
    { name: '₹25L-₹50L', value: 35 },
    { name: '₹50L-₹75L', value: 25 },
    { name: '₹75L-₹1Cr', value: 15 },
    { name: 'Over ₹1Cr', value: 10 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Summary stats
  const summaryStats = [
    { 
      title: 'Total Property Sales', 
      value: formatCurrency(235670000), 
      change: '+8.5%', 
      isPositive: true, 
      icon: <FaHome className="h-6 w-6 text-blue-500" />
    },
    { 
      title: 'Active Listings', 
      value: '1,248', 
      change: '+3.3%', 
      isPositive: true, 
      icon: <FaBuilding className="h-6 w-6 text-green-500" />
    },
    { 
      title: 'Conversion Rate', 
      value: '5.2%', 
      change: '+1.4%', 
      isPositive: true, 
      icon: <FaChartPie className="h-6 w-6 text-orange-500" />
    },
    { 
      title: 'Avg. Days on Market', 
      value: '32 days', 
      change: '-4.2%', 
      isPositive: true, 
      icon: <FaCalendarAlt className="h-6 w-6 text-purple-500" />
    }
  ];

  // Function to filter data based on selected time range
  const getFilteredData = () => {
    switch(timeRange) {
      case 'week':
        return salesData.slice(-4); // Last 4 weeks
      case 'month':
        return salesData;
      case 'quarter':
        return salesData.slice(-3); // Last 3 months
      case 'year':
        return salesData;
      default:
        return salesData;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Real Estate Analytics</h2>
          
          {/* Time range selector */}
          <div className="flex bg-white rounded-md shadow">
            <button 
              className={`px-4 py-2 text-sm rounded-l-md ${timeRange === 'week' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setTimeRange('week')}
            >
              Week
            </button>
            <button 
              className={`px-4 py-2 text-sm ${timeRange === 'month' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
            <button 
              className={`px-4 py-2 text-sm ${timeRange === 'quarter' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setTimeRange('quarter')}
            >
              Quarter
            </button>
            <button 
              className={`px-4 py-2 text-sm rounded-r-md ${timeRange === 'year' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setTimeRange('year')}
            >
              Year
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 flex items-center ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                    <span className="ml-1">from last period</span>
                  </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-full">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Property Views & Inquiries Trend */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Property Views & Inquiries</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getFilteredData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="propertyViews" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Property Views"
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="inquiries" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="Inquiries"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Property Type Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Property Type Distribution</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Location Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Location Performance</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={locationData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="listings" fill="#8884d8" name="Active Listings" />
                  <Bar yAxisId="right" dataKey="sales" fill="#82ca9d" name="Sales (Closed)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Price Range Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Range Distribution</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priceRangeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {priceRangeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Properties</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inquiries</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Modern Waterfront Condo</td>
                  <td className="px-6 py-4 whitespace-nowrap">Downtown</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(850000)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">3,245</td>
                  <td className="px-6 py-4 whitespace-nowrap">42</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Luxury Beachfront Villa</td>
                  <td className="px-6 py-4 whitespace-nowrap">Beachfront</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(1450000)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">2,879</td>
                  <td className="px-6 py-4 whitespace-nowrap">36</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Family-Friendly Suburban Home</td>
                  <td className="px-6 py-4 whitespace-nowrap">Suburbs</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(475000)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">2,654</td>
                  <td className="px-6 py-4 whitespace-nowrap">31</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Cozy Starter Home</td>
                  <td className="px-6 py-4 whitespace-nowrap">Suburbs</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(295000)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">2,145</td>
                  <td className="px-6 py-4 whitespace-nowrap">28</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Sold</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Urban Loft Apartment</td>
                  <td className="px-6 py-4 whitespace-nowrap">Urban</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(520000)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">1,987</td>
                  <td className="px-6 py-4 whitespace-nowrap">24</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 