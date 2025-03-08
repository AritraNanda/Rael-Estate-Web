import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';

const DemoPayment = ({ amount, duration, planType, onSuccess, onFailure }) => {
  const navigate = useNavigate();
  const { currentSeller } = useSelector((state) => state.seller);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Demo card numbers for testing
  const demoCards = {
    success: '4111 1111 1111 1111', // Visa format
    failure: '4242 4242 4242 4242', // Will trigger failure
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '')
        .match(/.{1,4}/g)?.join(' ') || '';
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const validateForm = () => {
    if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      setError('Invalid card number');
      return false;
    }
    if (!formData.cardHolder) {
      setError('Please enter card holder name');
      return false;
    }
    if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      setError('Invalid expiry date (MM/YY)');
      return false;
    }
    if (!formData.cvv.match(/^\d{3}$/)) {
      setError('Invalid CVV');
      return false;
    }
    return true;
  };

  const processPayment = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!currentSeller) {
      setError('Please sign in to continue');
      toast.error('Please sign in to continue');
      navigate('/seller/signin');
      return;
    }
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
      
      const response = await fetch('/api/demo-payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount,
          duration,
          planType,
          last4Digits: cleanCardNumber.slice(-4),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please sign in to continue');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment failed');
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('Payment successful! Redirecting to dashboard...');
        onSuccess?.();
        setTimeout(() => {
          navigate('/seller');
        }, 2000);
      } else {
        throw new Error(data.message || 'Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = err.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      onFailure?.();
      
      if (err.message.includes('sign in')) {
        setTimeout(() => {
          navigate('/seller/signin');
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Details</h2>
        <p className="text-gray-600">Amount: ₹{amount.toLocaleString('en-IN')}</p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">Demo Card Numbers:</p>
          <p className="text-sm text-blue-600">Success: {demoCards.success}</p>
          <p className="text-sm text-blue-600">Failure: {demoCards.failure}</p>
        </div>
      </div>

      <form onSubmit={processPayment}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              maxLength="19"
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Holder Name
            </label>
            <input
              type="text"
              name="cardHolder"
              value={formData.cardHolder}
              onChange={handleInputChange}
              placeholder="John Doe"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                maxLength="5"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="password"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength="3"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 py-3 px-4 rounded-lg text-white font-medium ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Pay Now'
          )}
        </button>
      </form>
    </div>
  );
};

export default DemoPayment; 