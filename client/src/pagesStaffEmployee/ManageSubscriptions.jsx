import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSearch, FaSpinner, FaCheckCircle, FaTimesCircle, FaMoneyBillWave, FaRegCreditCard } from 'react-icons/fa';

const ManageSubscriptions = () => {
  const [sellerEmail, setSellerEmail] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [sellerDetails, setSellerDetails] = useState(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [staffNote, setStaffNote] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [failureReason, setFailureReason] = useState('');
  const [failureLoading, setFailureLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  
  // Fetch subscription plans on load
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/staff-subscription/plans');
        const data = await res.json();
        if (data.success) {
          setSubscriptionPlans(data.plans);
          // Default to first plan
          if (data.plans.length > 0) {
            setSelectedPlan(data.plans[0].planType);
          }
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
        toast.error('Failed to load subscription plans');
      }
    };
    
    fetchPlans();
  }, []);
  
  // Handle seller lookup
  const handleSellerLookup = async (e) => {
    e.preventDefault();
    
    if (!sellerEmail) {
      toast.error('Please enter a seller email');
      return;
    }
    
    setSearchLoading(true);
    setSellerDetails(null);
    
    try {
      const res = await fetch(`/api/user/find-by-email?email=${sellerEmail}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Fetch subscription details
        const sellerId = data.user._id;
        const subscriptionRes = await fetch(`/api/staff-subscription/seller/${sellerId}`, {
          method: 'GET',
          credentials: 'include'
        });
        
        const subscriptionData = await subscriptionRes.json();
        
        if (subscriptionData.success) {
          setSellerDetails(subscriptionData);
          
          // Load transactions for this seller
          fetchSellerTransactions(sellerId);
        }
      } else {
        toast.error(data.message || 'Seller not found');
      }
    } catch (error) {
      console.error('Error looking up seller:', error);
      toast.error('Error looking up seller. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };
  
  // Fetch seller transactions
  const fetchSellerTransactions = async (sellerId) => {
    setTransactionsLoading(true);
    
    try {
      const res = await fetch(`/api/staff-subscription/transactions?sellerId=${sellerId}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      const data = await res.json();
      
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setTransactionsLoading(false);
    }
  };
  
  // Handle subscription assignment
  const handleAssignSubscription = async () => {
    if (!sellerDetails?.seller?.id || !selectedPlan || !paymentMethod) {
      toast.error('Please select all required fields');
      return;
    }
    
    setAssignLoading(true);
    
    try {
      const res = await fetch('/api/staff-subscription/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sellerId: sellerDetails.seller.id,
          planType: selectedPlan,
          paymentMethod: 'demo-card',
          staffNote
        }),
        credentials: 'include'
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success('Subscription assigned successfully');
        
        // Refresh seller details and transactions
        const subscriptionRes = await fetch(`/api/staff-subscription/seller/${sellerDetails.seller.id}`, {
          method: 'GET',
          credentials: 'include'
        });
        
        const subscriptionData = await subscriptionRes.json();
        
        if (subscriptionData.success) {
          setSellerDetails(subscriptionData);
          fetchSellerTransactions(sellerDetails.seller.id);
        }
        
        // Reset form
        setShowConfirmation(false);
        setStaffNote('');
      } else {
        toast.error(data.message || 'Failed to assign subscription');
      }
    } catch (error) {
      console.error('Error assigning subscription:', error);
      toast.error('Error assigning subscription. Please try again.');
    } finally {
      setAssignLoading(false);
    }
  };
  
  // Handle payment failure record
  const handleRecordFailure = async () => {
    if (!sellerDetails?.seller?.id || !failureReason) {
      toast.error('Please provide a reason for the payment failure');
      return;
    }
    
    setFailureLoading(true);
    
    try {
      const res = await fetch('/api/staff-subscription/payment-failure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sellerId: sellerDetails.seller.id,
          reason: failureReason
        }),
        credentials: 'include'
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success('Payment failure recorded successfully');
        
        // Refresh transactions
        fetchSellerTransactions(sellerDetails.seller.id);
        
        // Reset form
        setFailureReason('');
      } else {
        toast.error(data.message || 'Failed to record payment failure');
      }
    } catch (error) {
      console.error('Error recording payment failure:', error);
      toast.error('Error recording payment failure. Please try again.');
    } finally {
      setFailureLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Seller Subscriptions</h1>
      
      {/* Seller Search */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Find Seller</h2>
        <form onSubmit={handleSellerLookup} className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seller Email
            </label>
            <input
              type="email"
              value={sellerEmail}
              onChange={(e) => setSellerEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter seller's email address"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={searchLoading}
              className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 h-10 flex items-center"
            >
              {searchLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaSearch className="mr-2" />}
              {searchLoading ? 'Searching...' : 'Find Seller'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Seller Details */}
      {sellerDetails && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Seller Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Seller Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 text-sm">Name:</span>
                <p className="font-medium">{sellerDetails.seller.name}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Email:</span>
                <p className="font-medium">{sellerDetails.seller.email}</p>
              </div>
              <div className="pt-2">
                <span className="text-gray-600 text-sm">Subscription Status:</span>
                <div className="flex items-center mt-1">
                  {sellerDetails.hasActiveSubscription ? (
                    <>
                      <FaCheckCircle className="text-green-500 mr-2" />
                      <span className="font-medium text-green-600">Active</span>
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="text-red-500 mr-2" />
                      <span className="font-medium text-red-600">No Active Subscription</span>
                    </>
                  )}
                </div>
              </div>
              
              {sellerDetails.hasActiveSubscription && sellerDetails.subscription && (
                <div className="bg-gray-50 p-3 rounded-md mt-3">
                  <p className="text-sm font-medium text-gray-700">Current Subscription:</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <span className="text-gray-600">Plan:</span>{' '}
                      <span className="font-medium">{sellerDetails.subscription.planType.charAt(0).toUpperCase() + sellerDetails.subscription.planType.slice(1)}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Start Date:</span>{' '}
                      <span className="font-medium">{formatDate(sellerDetails.subscription.startDate)}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">End Date:</span>{' '}
                      <span className="font-medium">{formatDate(sellerDetails.subscription.endDate)}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Assign Subscription */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Assign Subscription</h2>
            
            {!showConfirmation ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subscription Plan
                  </label>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {subscriptionPlans.map((plan) => (
                      <option key={plan.planType} value={plan.planType}>
                        {plan.label} - ₹{plan.total} ({plan.duration} months)
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      className={`border rounded-md p-3 flex items-center cursor-pointer ${
                        paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setPaymentMethod('cash')}
                    >
                      <FaMoneyBillWave className={`${paymentMethod === 'cash' ? 'text-blue-500' : 'text-gray-400'} mr-2`} />
                      <span className={paymentMethod === 'cash' ? 'font-medium' : ''}>Cash</span>
                    </div>
                    <div
                      className={`border rounded-md p-3 flex items-center cursor-pointer ${
                        paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <FaRegCreditCard className={`${paymentMethod === 'card' ? 'text-blue-500' : 'text-gray-400'} mr-2`} />
                      <span className={paymentMethod === 'card' ? 'font-medium' : ''}>Card</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Staff Note (Optional)
                  </label>
                  <textarea
                    value={staffNote}
                    onChange={(e) => setStaffNote(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add notes about this transaction"
                    rows="3"
                  ></textarea>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowConfirmation(true)}
                  className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Continue to Confirm
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <h3 className="font-medium text-yellow-800 mb-2">Confirm Subscription Assignment</h3>
                  <p className="text-sm text-yellow-700 mb-2">
                    You are about to assign a{' '}
                    <span className="font-medium">
                      {subscriptionPlans.find(p => p.planType === selectedPlan)?.label}
                    </span>{' '}
                    subscription to{' '}
                    <span className="font-medium">{sellerDetails.seller.name}</span>.
                  </p>
                  <p className="text-sm text-yellow-700">
                    Payment method: <span className="font-medium">{paymentMethod === 'cash' ? 'Cash' : 'Card'}</span>
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Go Back
                  </button>
                  <button
                    type="button"
                    onClick={handleAssignSubscription}
                    disabled={assignLoading}
                    className="flex-1 py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400 flex items-center justify-center"
                  >
                    {assignLoading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Confirm & Assign'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Payment Failure */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Record Payment Failure</h2>
            
            {sellerDetails.hasActiveSubscription ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Use this form to record payment failures when a seller fails to pay for subscription.
                </p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Payment Failure
                  </label>
                  <textarea
                    value={failureReason}
                    onChange={(e) => setFailureReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Explain why the payment failed"
                    rows="3"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="button"
                  onClick={handleRecordFailure}
                  disabled={failureLoading}
                  className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400 flex items-center justify-center"
                >
                  {failureLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Recording...
                    </>
                  ) : (
                    'Record Payment Failure'
                  )}
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  This seller doesn't have an active subscription.
                  Payment failures can only be recorded for sellers with active subscriptions.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Transaction History */}
      {sellerDetails && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          
          {transactionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="animate-spin text-blue-600 text-2xl" />
            </div>
          ) : transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{transaction.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {transaction.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {transaction.staffNote}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No transaction records found for this seller.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageSubscriptions; 