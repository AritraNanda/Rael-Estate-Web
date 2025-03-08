import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Contact({ listing }) {
  const [seller, setSeller] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchSeller = async () => {
      if (!listing || !listing.userRef) {
        console.error('Missing listing or userRef in Contact component');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching seller with userRef:', listing.userRef);
        setLoading(true);
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        
        console.log('Seller data received:', data);
        
        if (data.success === false) {
          toast.error('Could not fetch seller information');
          return;
        }
        
        setSeller(data);
      } catch (error) {
        console.error('Error fetching seller:', error);
        toast.error('Error fetching seller information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSeller();
  }, [listing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    // Open email client with pre-filled message
    window.location.href = `mailto:${seller.email}?subject=Regarding ${listing.name}&body=${encodeURIComponent(message)}`;
  };

  if (!listing) {
    return <div>No listing data provided</div>;
  }

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : seller ? (
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {seller.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{seller.username}</p>
                <p className="text-sm text-gray-500">Property Owner</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Inquiring about <span className="font-medium">{listing.name}</span>
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Your Message
            </label>
            <textarea
              name="message"
              id="message"
              rows="4"
              value={message}
              onChange={onChange}
              placeholder="Hi, I am interested in this property. I would like to schedule a viewing..."
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-5 h-5"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" 
              />
            </svg>
            Send Message
          </button>
        </form>
      ) : (
        <div className="text-center p-4">
          <p className="text-gray-600">Could not load seller information</p>
        </div>
      )}
    </>
  );
}