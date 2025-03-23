import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaDatabase, 
  FaFireAlt, 
  FaBolt, 
  FaExchangeAlt, 
  FaTag, 
  FaList, 
  FaUsers, 
  FaChartBar, 
  FaBell 
} from 'react-icons/fa';
import { SiMongodb, SiFirebase, SiSupabase } from 'react-icons/si';

const Home = () => {
  return (
    <div className="flex min-h-screen">
      
      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>

        {/* Database Options */}
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Database Infrastructure</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* MongoDB Option */}
          <DatabaseCard 
            title="MongoDB"
            description="Project's main database. Stores all property listings, user profiles, transactions and subscription data."
            buttonText="Visit MongoDB Atlas"
            linkTo="https://cloud.mongodb.com"
            icon={<SiMongodb className="text-green-500 text-5xl" />}
            color="green"
          />

          {/* Firebase Option */}
          <DatabaseCard 
            title="Firebase"
            description="Handles all authentication services including user login, registration, password reset, and admin access control."
            buttonText="Visit Firebase Console"
            linkTo="https://console.firebase.google.com"
            icon={<SiFirebase className="text-yellow-500 text-5xl" />}
            color="yellow"
          />

          {/* Supabase Option */}
          <DatabaseCard 
            title="Supabase"
            description="Manages all media storage including property images, document uploads, and large file storage with CDN capabilities."
            buttonText="Visit Supabase Dashboard"
            linkTo="https://app.supabase.io"
            icon={<SiSupabase className="text-blue-500 text-5xl" />}
            color="blue"
          />
        </div>

        {/* Main Features */}
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Main Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Recent Transactions Card */}
          <DashboardCard 
            title="Recent Transactions"
            description="View and manage recent property transactions."
            buttonText="View Transactions"
            linkTo="/staff/transactions"
            icon={<FaExchangeAlt className="text-purple-500" />}
          />

          {/* Define Subscription Card */}
          <DashboardCard 
            title="Define Subscription"
            description="Create and manage subscription plans for users."
            buttonText="Manage Subscriptions"
            linkTo="/staff/subscriptions"
            icon={<FaTag className="text-green-500" />}
          />

          {/* Recent Listings Card */}
          <DashboardCard 
            title="Recent Listings"
            description="Check out the latest property listings."
            buttonText="View Listings"
            linkTo="/staff/listings"
            icon={<FaList className="text-blue-500" />}
          />

          {/* Assign Staff/Admin Card */}
          <DashboardCard 
            title="Assign Staff/Admin"
            description="Manage roles and permissions for staff and admins."
            buttonText="Manage Staff"
            linkTo="/staff/manage"
            icon={<FaUsers className="text-indigo-500" />}
          />

          {/* Analytics Card */}
          <DashboardCard 
            title="Analytics"
            description="View detailed analytics and reports."
            buttonText="View Analytics"
            linkTo="/staff/analytics"
            icon={<FaChartBar className="text-red-500" />}
          />

          {/* Notifications Card */}
          <DashboardCard 
            title="Notifications"
            description="Check and manage system notifications."
            buttonText="View Notifications"
            linkTo="/staff/notifications"
            icon={<FaBell className="text-yellow-500" />}
          />
        </div>
      </div>
    </div>
  );
};

// Database Option Card Component
const DatabaseCard = ({ title, description, buttonText, linkTo, icon, color }) => {
  // Define button color classes based on the color prop
  const getButtonClass = () => {
    switch(color) {
      case 'green':
        return 'bg-green-600 hover:bg-green-700';
      case 'yellow':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  // Define border color classes based on the color prop
  const getBorderClass = () => {
    switch(color) {
      case 'green':
        return 'border-green-500';
      case 'yellow':
        return 'border-yellow-500';
      case 'blue':
        return 'border-blue-500';
      default:
        return 'border-gray-500';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 flex flex-col h-full border-t-4 ${getBorderClass()}`}>
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-semibold text-gray-800 ml-4">{title}</h3>
      </div>
      <div className="flex-grow">
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100">
        <a href={linkTo} target="_blank" rel="noopener noreferrer" className="block w-full">
          <button className={`w-full py-2.5 px-4 text-white rounded-md transition duration-200 font-medium ${getButtonClass()}`}>
            {buttonText}
          </button>
        </a>
      </div>
    </div>
  );
};

// DashboardCard Component
const DashboardCard = ({ title, description, buttonText, linkTo, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 flex flex-col h-full">
      <div className="flex-grow">
        <div className="flex items-center mb-3">
          <span className="text-xl mr-3">{icon}</span>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100">
        <Link to={linkTo} className="block w-full">
          <button className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 font-medium">
            {buttonText}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;