import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { setSubscription } from '../redux/user/sellerSlice';
import Preloader from '../components/Preloader';
import { toast } from 'react-hot-toast';

export default function MySubscription() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentSeller, subscription: reduxSubscription } = useSelector((state) => state.seller);

  // Function to get subscription from cookie
  const getSubscriptionFromCookie = () => {
    try {
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('seller_subscription='));
      
      if (cookieValue) {
        const subscriptionData = JSON.parse(decodeURIComponent(cookieValue.split('=')[1]));
        //console.log('Subscription data from cookie:', subscriptionData);
        return subscriptionData;
      }
    } catch (err) {
      //console.error('Error parsing subscription cookie:', err);
    }
    return null;
  };

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!currentSeller) {
        setError('Please sign in to view subscription details');
        setLoading(false);
        toast.error('Please sign in to continue');
        setTimeout(() => navigate('/seller/signin'), 2000);
        return;
      }

      // First check if we have subscription in Redux
      if (reduxSubscription) {
        //console.log('Using subscription from Redux store:', reduxSubscription);
      } else {
        // Then try to get subscription from cookie
        const cookieSubscription = getSubscriptionFromCookie();
        if (cookieSubscription) {
          //console.log('Using subscription from cookie:', cookieSubscription);
          // Store in Redux for future use
          dispatch(setSubscription(cookieSubscription));
        }
      }

      try {
        // Fetch subscription status from API
        const subRes = await fetch('/api/demo-payment/subscription-status', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!subRes.ok) {
          if (subRes.status === 401) {
            throw new Error('Please sign in to continue');
          }
          throw new Error('Failed to fetch subscription details');
        }
        
        const subData = await subRes.json();
        //console.log('Subscription data from API:', subData);

        if (subData.success && subData.subscription) {
          // Update Redux with the latest subscription data
          dispatch(setSubscription(subData.subscription));
        }

        // Fetch transaction history
        const transRes = await fetch('/api/demo-payment/history', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!transRes.ok) {
          throw new Error('Failed to fetch transaction history');
        }
        
        const transData = await transRes.json();
        //console.log('Transaction data:', transData);

        if (transData.success) {
          setTransactions(transData.transactions);
        }
      } catch (err) {
        //console.error('Error fetching subscription data:', err);
        
        // If we have subscription data in Redux or cookie, don't show an error
        if (!reduxSubscription && !getSubscriptionFromCookie()) {
          setError(err.message);
          toast.error(err.message);
          
          if (err.message.includes('sign in')) {
            setTimeout(() => navigate('/seller/signin'), 2000);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [currentSeller, navigate, dispatch, reduxSubscription]);

  if (loading) return <Preloader />;

  // Use subscription from Redux or cookie
  const subscription = reduxSubscription || getSubscriptionFromCookie();

  if (error && !subscription) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            to="/seller/signin"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">My Subscription</h1>
        <div className="bg-white rounded-xl shadow-lg p-6">
          {subscription ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 capitalize">{subscription.planType} Plan</h2>
                  <p className="text-gray-600 mt-1">
                    Valid until {format(new Date(subscription.endDate), 'PPP')}
                  </p>
                </div>
                <Link
                  to="/seller/subscription"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Extend Subscription
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-lg font-semibold text-blue-600 capitalize">{subscription.status}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {format(new Date(subscription.startDate), 'PP')}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="text-lg font-semibold text-blue-600">₹{subscription.amount}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No active subscription found</p>
              <Link
                to="/seller/subscription"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Subscription
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h2>
        {transactions.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Card</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {format(new Date(transaction.transactionDate), 'PPp')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                      {transaction.planType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      ₹{transaction.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.status === 'success'
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      ****{transaction.last4Digits}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-gray-600">No transaction history available</p>
          </div>
        )}
      </div>
    </div>
  );
} 