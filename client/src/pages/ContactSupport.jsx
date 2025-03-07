import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaEnvelope, FaPhone, FaComments, FaQuestionCircle, FaSearch, FaHome, FaUserAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Preloader from '../components/Preloader';

export default function ContactSupport() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'general',
  });
  const [loading, setLoading] = useState(false);

  const faqs = [
    {
      question: "How do I search for properties?",
      answer: "Use the search bar at the top of the page to find properties by location, price range, or property features. You can also use filters to refine your search results."
    },
    {
      question: "How can I contact a property owner?",
      answer: "When viewing a property listing, click the 'Contact Agent' button to send a message directly to the property owner or agent."
    },
    {
      question: "Can I save my favorite properties?",
      answer: "Yes! Click the heart icon on any property listing to save it to your favorites. You can view all saved properties in your profile."
    },
    {
      question: "What should I know before scheduling a viewing?",
      answer: "Before scheduling a viewing, verify the property details, location, and availability. Have your questions ready and be prepared to provide identification when meeting the agent."
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      // Here you would typically make an API call to submit the support request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Support request submitted successfully! We will contact you soon.');
      setFormData({
        subject: '',
        message: '',
        category: 'general'
      });
    } catch (error) {
      toast.error('Failed to submit support request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          How Can We Help?
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our support team is here to help you find your perfect home and answer any questions along the way.
        </p>
      </div>

      {/* Quick Help Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-start space-x-4">
          <div className="bg-blue-100 rounded-full p-3">
            <FaSearch className="text-blue-600 text-xl" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Search Help</h3>
            <p className="text-sm text-gray-600">Tips for finding the perfect property</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-start space-x-4">
          <div className="bg-blue-100 rounded-full p-3">
            <FaHome className="text-blue-600 text-xl" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Property Guide</h3>
            <p className="text-sm text-gray-600">Understanding property listings</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-start space-x-4">
          <div className="bg-blue-100 rounded-full p-3">
            <FaUserAlt className="text-blue-600 text-xl" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Account Support</h3>
            <p className="text-sm text-gray-600">Managing your buyer account</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-3">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="general">General Inquiry</option>
                  <option value="property">Property Questions</option>
                  <option value="account">Account Help</option>
                  <option value="viewing">Schedule Viewing</option>
                  <option value="urgent">Urgent Matter</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Other Ways to Reach Us</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaEnvelope className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-gray-600">support@estatebro.com</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-gray-600">1-800-ESTATE-BRO</span>
              </div>
              <div className="flex items-center">
                <FaComments className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-gray-600">Live Chat (9 AM - 6 PM)</span>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              <FaQuestionCircle className="inline-block mr-2 mb-1" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{faq.question}</h4>
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
