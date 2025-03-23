import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';

const SubscriptionManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch existing plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/subscription-plans');
        const data = await res.json();
        if (data.success) {
          setPlans(data.plans);
        }
      } catch (error) {
        toast.error('Failed to fetch subscription plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Handle input change
  const handleInputChange = (planType, field, value) => {
    setPlans(prevPlans => 
      prevPlans.map(plan => {
        if (plan.planType === planType) {
          const updates = { ...plan, [field]: value };
          // Auto-calculate total when perMonth or duration changes
          if (field === 'perMonth' || field === 'duration') {
            updates.total = Number(updates.perMonth) * Number(updates.duration);
          }
          return updates;
        }
        return plan;
      })
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setShowSuccess(false);
    try {
      const res = await fetch('/api/subscription-plans/update-all', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plans }),
      });
      const data = await res.json();
      if (data.success) {
        setShowSuccess(true);
        toast.success('Subscription plans updated successfully', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        toast.error(data.message || 'Failed to update plans');
      }
    } catch (error) {
      toast.error('Error updating subscription plans');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Subscription Plan Management</h2>
          {showSuccess && (
            <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-md">
              <FaCheckCircle className="mr-2" />
              <span>Changes saved successfully!</span>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {plans.map((plan) => (
                <div key={plan.planType} className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      {plan.label} Plan
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Per Month (₹)
                      </label>
                      <input
                        type="number"
                        value={plan.perMonth}
                        onChange={(e) => handleInputChange(plan.planType, 'perMonth', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (months)
                      </label>
                      <input
                        type="number"
                        value={plan.duration}
                        onChange={(e) => handleInputChange(plan.planType, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={plan.total}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        value={plan.discount}
                        onChange={(e) => handleInputChange(plan.planType, 'discount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        min="0"
                        max="100"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
              <button
                type="submit"
                disabled={saving}
                className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
              {showSuccess && (
                <span className="hidden md:flex items-center text-green-600">
                  <FaCheckCircle className="mr-2" />
                  Saved!
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionManagement; 