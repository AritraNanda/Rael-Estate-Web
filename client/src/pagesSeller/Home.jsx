import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center p-6 ">
            {/* Welcome Section */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-6xl w-full mb-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to EstateBro, Your Real Estate Partner!</h1>

            {/* <div className="bg-gray-100 mb-3 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <img
                    src="https://www.homejelly.com/wp-content/uploads/2014/03/10336-Dunleer-Dr.-exterior-copy-2.jpg"
                    alt="Modern House"
                    className=" object-cover w-full"
                />
            </div> */}

            <p className="text-gray-600 text-lg mb-6">
                As a seller, you can create and manage your property listings here. To explore properties available for buying or renting, you can create a buyer account.
            </p>

            {/* Button Container */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to='/seller/create-listing/'>
                <button
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                    onClick={() => {/* Add functionality to create listing */}}
                    >
                    Create New Listing
                </button>
                </Link>

                <Link to='/buyer/signin/'>
                <button
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                    onClick={() => {/* Add functionality to switch to buyer account */}}
                    >
                    Explore Properties as Buyer
                </button>
                </Link>
            </div>
        </div>

            {/* Action Buttons */}

            {/* Featured Listings Section */}
            <div className="bg-white p-8 rounded-lg shadow-md max-w-6xl w-full mb-8">
                <h2 className="text-2xl font-bold text-blue-600 mb-6">Featured Listings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Placeholder Listing Cards */}
                    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                        <img
                            src="https://www.homejelly.com/wp-content/uploads/2014/03/10336-Dunleer-Dr.-exterior-copy-2.jpg"
                            alt="Modern House"
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-blue-600 mb-2">Modern Family Home</h3>
                            <p className="text-gray-600 mb-2">3 Beds | 2 Baths | 1,500 sqft</p>
                            <p className="text-gray-600">₹45,00,000</p>
                        </div>
                    </div>
                    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                        <img
                            src="https://i.pinimg.com/originals/24/e8/f0/24e8f08ba83e34213572acbdb1061bf0.jpg"
                            alt="Luxury Apartment"
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-blue-600 mb-2">Luxury Apartment</h3>
                            <p className="text-gray-600 mb-2">2 Beds | 2 Baths | 1,200 sqft</p>
                            <p className="text-gray-600">₹30,00,000</p>
                        </div>
                    </div>
                    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                        <img
                            src="https://images.trvl-media.com/lodging/35000000/34850000/34850000/34849964/11fa0605.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill"
                            alt="Beachfront Villa"
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-blue-600 mb-2">Beachfront Villa</h3>
                            <p className="text-gray-600 mb-2">4 Beds | 3 Baths | 2,500 sqft</p>
                            <p className="text-gray-600">₹1,20,00,000</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose EstateBro Section */}
            <div className="bg-white p-8 rounded-lg shadow-md max-w-6xl w-full mb-8">
                <h2 className="text-2xl font-bold text-blue-600 mb-6">Why Choose EstateBro?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="text-center">
                        <img
                            src="https://gretor.com/wp-content/uploads/2015/08/sms_ease_to_use-api_slider.jpg"
                            alt="Easy to Use"
                            className="w-20 h-20 mx-auto mb-4 rounded-full"
                        />
                        <h3 className="text-xl font-semibold text-blue-600 mb-2">Easy to Use</h3>
                        <p className="text-gray-600">Our platform is designed to make listing and managing properties simple and intuitive.</p>
                    </div>
                    <div className="text-center">
                        <img
                            src="https://www.magrath.sg/wp-content/uploads/2018/07/Global-Mobility-Policies.jpg"
                            alt="Wide Reach"
                            className="w-20 h-20 mx-auto mb-4 rounded-full"
                        />
                        <h3 className="text-xl font-semibold text-blue-600 mb-2">Wide Reach</h3>
                        <p className="text-gray-600">Connect with thousands of potential buyers and renters across the globe.</p>
                    </div>
                    <div className="text-center">
                        <img
                            src="https://useme.com/en/blog/wp-content/uploads/2023/08/secure-transactions-file-transfer-and-escrow-service-4.jpg.webp"
                            alt="Secure Transactions"
                            className="w-20 h-20 mx-auto mb-4 rounded-full"
                        />
                        <h3 className="text-xl font-semibold text-blue-600 mb-2">Secure Transactions</h3>
                        <p className="text-gray-600">We ensure all transactions are safe, secure, and hassle-free.</p>
                    </div>
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="bg-blue-600 p-8 rounded-lg shadow-md max-w-6xl w-full text-center mb-5">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
                <p className="text-white text-lg mb-6">List your property in EstateBro today and take the first step toward selling or renting your property.</p>
                <Link to='/'>
                <button
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
                    onClick={() => {/* Add functionality to sign up */}}
                    >
                    How to List?
                </button>
                </Link>
            </div>
        </div>
    );
}