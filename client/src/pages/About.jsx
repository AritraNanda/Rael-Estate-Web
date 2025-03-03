import React from 'react';
import { FaBuilding, FaHandshake, FaUsers, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function About(){
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          About <span className="text-blue-600">EstateBro</span>
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Your trusted partner in finding the perfect property.
        </p>
      </div>

      {/* Mission Section */}
      <div className="mt-16 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 sm:p-12 lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900">
              Our Mission
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              At EstateBro, we are committed to helping you find the perfect home or investment property. Our mission is to make the real estate process simple, transparent, and enjoyable for everyone.
            </p>
          </div>
          <div className="mt-8 lg:mt-0 lg:w-1/2 lg:pl-12">
            <img
              src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Mission"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mt-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Our Core Values
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Value 1: Integrity */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="flex justify-center">
              <FaHandshake className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">Integrity</h3>
            <p className="mt-2 text-gray-600">
              We believe in honesty and transparency in every transaction.
            </p>
          </div>

          {/* Value 2: Expertise */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="flex justify-center">
              <FaBuilding className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">Expertise</h3>
            <p className="mt-2 text-gray-600">
              Our team brings years of experience and knowledge to the table.
            </p>
          </div>

          {/* Value 3: Community */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="flex justify-center">
              <FaUsers className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">Community</h3>
            <p className="mt-2 text-gray-600">
              We are dedicated to building strong relationships with our clients.
            </p>
          </div>

          {/* Value 4: Innovation */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="flex justify-center">
              <FaChartLine className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">Innovation</h3>
            <p className="mt-2 text-gray-600">
              We leverage the latest technology to simplify your real estate journey.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mt-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Meet Our Team
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Team Member 1 */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <img
              src="https://iili.io/32zGHVS.jpg"
              alt="Team Member"
              className="w-32 h-32 mx-auto rounded-full object-cover"
            />
            <h3 className="mt-4 text-xl font-bold text-gray-900">Aritra Nanda</h3>
            <p className="mt-2 text-gray-600">CEO & Founder</p>
          </div>

          {/* Team Member 2 */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <img
              src="https://iili.io/326na6b.jpg"
              alt="Team Member"
              className="w-32 h-32 mx-auto rounded-full object-cover"
            />
            <h3 className="mt-4 text-xl font-bold text-gray-900">Nviz Yadav</h3>
            <p className="mt-2 text-gray-600">Marketing Head</p>
          </div>

          {/* Team Member 3 */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Team Member"
              className="w-32 h-32 mx-auto rounded-full object-cover"
            />
            <h3 className="mt-4 text-xl font-bold text-gray-900">John Smith</h3>
            <p className="mt-2 text-gray-600">Real Estate Agent</p>
          </div>

        </div>


      </div>

      {/* Call to Action */}
      <div className="mt-16 bg-blue-600 rounded-lg shadow-xl p-8 sm:p-12 text-center">
        <h2 className="text-3xl font-bold text-white">
          Ready to Find Your Dream Home?
        </h2>
        <p className="mt-4 text-lg text-blue-100">
          Let us help you make your real estate dreams a reality.
        </p>
        <Link to='/buyer/'>
        <button className="mt-8 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
          Get Started
        </button>
        </Link>
        
      </div>
    </div>
  );
};
