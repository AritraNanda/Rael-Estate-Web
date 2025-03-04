import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaEdit, FaUserCog, FaListAlt, FaImage, FaMoneyBillWave, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import { MdSecurity, MdHelp } from 'react-icons/md';

export default function GuideSeller() {
  const guideCards = [
    {
      title: "Creating a Listing",
      icon: <FaHome className="w-6 h-6" />,
      description: "Learn how to create an attractive property listing with detailed information and high-quality images.",
      steps: [
        "Click on '+ Create' in the navigation bar",
        "Fill in basic property details (name, description, address)",
        "Add property features and amenities",
        "Upload high-quality images (up to 6)",
        "Set competitive pricing",
      ],
    },
    {
      title: "Managing Listings",
      icon: <FaListAlt className="w-6 h-6" />,
      description: "Keep your property listings up-to-date and manage them effectively.",
      steps: [
        "View all listings in 'My Listings'",
        "Edit listing details as needed",
        "Update pricing and availability",
        "Remove outdated listings",
        "Monitor listing performance"
      ],
    },
    {
      title: "Profile Management",
      icon: <FaUserCog className="w-6 h-6" />,
      description: "Maintain your seller profile to build trust with potential buyers.",
      steps: [
        "Update profile picture",
        "Modify contact information",
        "Change password if needed",
        "Add professional credentials",
        "Customize notification settings"
      ],
    }
  ];

  const actionButtons = [
    {
      title: "Create New Listing",
      icon: <FaPlus className="w-5 h-5" />,
      link: "/seller/create-listing",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "View My Listings",
      icon: <FaListAlt className="w-5 h-5" />,
      link: "/seller/my-listings",
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Edit Profile",
      icon: <FaUserCog className="w-5 h-5" />,
      link: "/seller/profile",
      color: "bg-purple-600 hover:bg-purple-700"
    }
  ];

  const tips = [
    {
      icon: <FaImage className="w-5 h-5" />,
      title: "Quality Photos",
      text: "Use high-resolution images in good lighting to showcase your property."
    },
    {
      icon: <FaMoneyBillWave className="w-5 h-5" />,
      title: "Competitive Pricing",
      text: "Research market rates to set attractive yet profitable prices."
    },
    {
      icon: <FaMapMarkerAlt className="w-5 h-5" />,
      title: "Location Details",
      text: "Provide accurate location and highlight nearby amenities."
    },
    {
      icon: <MdSecurity className="w-5 h-5" />,
      title: "Safety First",
      text: "Always verify potential buyers and follow platform guidelines."
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Seller's Guide to Success
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Welcome to your comprehensive guide for managing property listings and maximizing your success on our platform.
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
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Pro Tips for Better Listings</h2>
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
          Our support team is always here to help you succeed. If you have any questions or need assistance, don't hesitate to reach out.
        </p>
        <Link
          to="/seller/contact-support"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
