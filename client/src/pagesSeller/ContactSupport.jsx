import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaEnvelope, FaPhone, FaComments, FaQuestionCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Preloader from '../components/Preloader';

export default function ContactSupport() {
  const { currentSeller } = useSelector((state) => state.seller);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'general',
  });
  const [loading, setLoading] = useState(false);

  const faqs = [
    {
      question: "How do I update my listing details?",
      answer: "You can update your listing by going to 'My Listings', clicking the edit icon on the listing you want to modify, and making your changes in the update form."
    },
    {
      question: "What types of photos are recommended?",
      answer: "Upload clear, high-resolution photos in landscape orientation. Include images of all rooms, exterior views, and any special features. Ensure good lighting and clean spaces."
    },
    {
      question: "How long does it take to get a response?",
      answer: "We typically respond to support inquiries within 24 hours during business days. For urgent matters, please mark your request as 'Urgent' in the category selection."
    },
    {
      question: "Can I delete my listing?",
      answer: "Yes, you can delete your listing from the 'My Listings' page. Click the delete icon and confirm your action. Note that this cannot be undone."
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
      // For now, we'll simulate a successful submission
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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Contact Support
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Need help? Our support team is here to assist you with any questions or concerns.
        </p>
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
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing Question</option>
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
