import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DemoPayment from '../components/DemoPayment';

const SubscriptionPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showPayment, setShowPayment] = useState(false);

  const baseMonthlyPrice = 999; // Base monthly price for reference

  const subscriptionOptions = {
    monthly: {
      perMonth: 999,
      duration: 1,
      label: "Monthly",
      get total() { return this.perMonth * this.duration },
      get discount() { return 0 }
    },
    quarterly: {
      perMonth: 899,
      duration: 3,
      label: "Quarterly",
      get total() { return this.perMonth * this.duration },
      get discount() { return Math.round(((baseMonthlyPrice - this.perMonth) / baseMonthlyPrice) * 100) }
    },
    annually: {
      perMonth: 749,
      duration: 12,
      label: "Annually",
      get total() { return this.perMonth * this.duration },
      get discount() { return Math.round(((baseMonthlyPrice - this.perMonth) / baseMonthlyPrice) * 100) }
    }
  };

  const features = [
    { text: "List up to any properties", highlight: "any" },
    { text: "Premium property analytics", highlight: "Premium" },
    { text: "Featured property listings", highlight: "Featured" },
    { text: "Priority seller inquiries", highlight: "Priority" },
    { text: "Upto 7 HD photos per listing", highlight: "7 HD" },
    { text: "24/7 IT & consultation support", highlight: "24/7" }
  ];

  const selectedOption = subscriptionOptions[billingCycle];

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    // Additional success handling if needed
  };

  const handlePaymentFailure = () => {
    // Handle payment failure
  };

  return (
    <div className="min-h-screen py-12 px-4 md:p-8">
      {!showPayment ? (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Billing Cycle</h1>
            <p className="text-lg text-gray-600">Get all premium features at the best price for you</p>
          </div>

          {/* Options Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {Object.keys(subscriptionOptions).map((option) => {
              const plan = subscriptionOptions[option];
              
              return (
                <div 
                  key={option} 
                  className={`rounded-2xl shadow-lg cursor-pointer transition-all transform hover:-translate-y-1 ${billingCycle === option ? 'ring-4 ring-blue-500 scale-105' : 'bg-white'}`}
                  onClick={() => setBillingCycle(option)}
                >
                  <div className="inner p-6 pt-10 bg-white rounded-xl relative overflow-hidden h-full flex flex-col">
                    {plan.discount > 0 && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white py-1 px-4 rounded-bl-lg font-semibold">
                        {plan.discount}% OFF
                      </div>
                    )}
                    
                    <div className="pricing mb-6 text-center">
                      <div className="text-3xl font-bold text-gray-800">
                        ₹{plan.perMonth} <small className="text-gray-500 text-sm font-normal">/ month</small>
                      </div>
                      {option !== 'monthly' && (
                        <div className="text-sm text-gray-500 mt-2">
                          Total: <span className="line-through">₹{subscriptionOptions.monthly.perMonth * plan.duration}</span> <span className="font-medium text-blue-700">₹{plan.total}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xl font-bold text-center text-gray-800 mb-2">{plan.label}</p>
                    <p className="text-gray-600 text-center mb-6">Billed {option === 'monthly' ? 'every month' : option === 'quarterly' ? 'every 3 months' : 'once a year'}</p>
                    
                    <div className="flex-grow"></div>
                    
                    <div className="action mt-6">
                      <button className={`button w-full py-3 px-6 rounded-lg font-medium transition-colors ${billingCycle === option ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>
                        {billingCycle === option ? 'Selected' : 'Select Plan'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Plan Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Premium Plan - {selectedOption.label}</h2>
              <div className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full font-medium">
                ₹{selectedOption.perMonth}/month
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <span className="icon mr-3 bg-blue-200 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg height="14" width="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 0h24v24H0z" fill="none"></path>
                      <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                    </svg>
                  </span>
                  <span>
                    {feature.highlight ? (
                      <>
                        <strong className="text-gray-800">{feature.highlight}</strong>{' '}
                        {feature.text.replace(feature.highlight, '')}
                      </>
                    ) : (
                      feature.text
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <p className="text-gray-600">
                    You'll be charged <span className="font-semibold text-gray-800">₹{selectedOption.total}</span> for {selectedOption.duration} months
                    {selectedOption.discount > 0 && ` (${selectedOption.discount}% savings)`}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">All prices are in Indian Rupees (₹)</p>
                </div>
                <button 
                  onClick={() => setShowPayment(true)}
                  className="button bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium py-3 px-8 rounded-lg mt-4 md:mt-0"
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500">
            <p>All subscriptions include a 14-day free trial. Cancel anytime.</p>
            <p className="mt-2">Need help? 
              <Link to="/seller/contact-support">
                <span className="text-blue-600 hover:underline">Contact our support team</span>
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <DemoPayment
          amount={selectedOption.total}
          duration={selectedOption.duration}
          planType={billingCycle}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
        />
      )}
    </div>
  );
};

export default SubscriptionPage;