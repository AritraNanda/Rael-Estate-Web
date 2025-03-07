import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaHeart, FaHome, FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt, FaShieldAlt, FaUserCheck } from 'react-icons/fa';
import { MdVerified, MdHelp, MdLocationOn, MdPhotoLibrary } from 'react-icons/md';

export default function GuideBuyer() {
  const guideCards = [
    {
      title: "Finding Properties",
      icon: <FaSearch className="w-6 h-6" />,
      description: "Learn how to effectively search and filter properties to find your perfect match.",
      steps: [
        "Use the search bar to find properties by location",
        "Apply filters for price range, bedrooms, etc.",
        "Save favorite properties for later",
        "Compare multiple properties",
        "View property details and images",
      ],
    },
    {
      title: "Property Viewing",
      icon: <FaHome className="w-6 h-6" />,
      description: "Tips for scheduling and making the most of property viewings.",
      steps: [
        "Contact property owners through the platform",
        "Schedule convenient viewing times",
        "Prepare questions for the viewing",
        "Check the neighborhood and amenities",
        "Take notes and photos during viewing",
      ],
    },
    {
      title: "Managing Favorites",
      icon: <FaHeart className="w-6 h-6" />,
      description: "Keep track of properties you're interested in and organize your search.",
      steps: [
        "Save properties to your favorites list",
        "Compare saved properties side by side",
        "Get notifications for price changes",
        "Remove properties no longer of interest",
        "Share favorites with family members",
      ],
    }
  ];

  const actionButtons = [
    {
      title: "Start Searching",
      icon: <FaSearch className="w-5 h-5" />,
      link: "/buyer/search",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "View Saved Properties",
      icon: <FaHeart className="w-5 h-5" />,
      link: "/buyer/saved-properties",
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Edit Profile",
      icon: <FaUserCheck className="w-5 h-5" />,
      link: "/buyer/profile",
      color: "bg-purple-600 hover:bg-purple-700"
    }
  ];

  const tips = [
    {
      icon: <MdPhotoLibrary className="w-5 h-5" />,
      title: "Check All Photos",
      text: "Review all property images carefully to get a complete view."
    },
    {
      icon: <MdLocationOn className="w-5 h-5" />,
      title: "Location Research",
      text: "Research the neighborhood, nearby amenities, and commute times."
    },
    {
      icon: <FaCalendarAlt className="w-5 h-5" />,
      title: "Schedule Wisely",
      text: "Plan viewings during daylight hours to see properties clearly."
    },
    {
      icon: <FaShieldAlt className="w-5 h-5" />,
      title: "Stay Safe",
      text: "Only deal through our platform for secure transactions."
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Buyer's Guide to Success
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your comprehensive guide to finding and securing your dream property. Follow these steps to make your property search journey smooth and successful.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actionButtons.map((button, index) => (
            <Link
              key={index}
              to={button.link}
              className={`${button.color} text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="p-6 flex items-center justify-center space-x-3">
                {button.icon}
                <span className="text-lg font-semibold">{button.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Guide Cards */}
      <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
        {guideCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600 mb-4">{card.description}</p>
              
              <ul className="space-y-2 mb-6">
                {card.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm mr-2 mt-0.5">
                      {stepIndex + 1}
                    </span>
                    <span className="text-gray-600">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Tips Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Smart Buyer Tips</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tips.map((tip, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-4 mx-auto">
                {tip.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{tip.title}</h3>
              <p className="text-gray-600 text-center">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="max-w-3xl mx-auto text-center bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 mx-auto">
          <MdHelp className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Need More Help?</h2>
        <p className="text-gray-600 mb-6">
          Our support team is always here to assist you in your property search journey. If you have any questions or need guidance, don't hesitate to reach out.
        </p>
        <Link
          to="/buyer/contact-support"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
} 