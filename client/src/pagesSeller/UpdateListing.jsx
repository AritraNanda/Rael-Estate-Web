import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import supabase from '../supabase';
import { toast, ToastContainer } from 'react-toastify';
import Preloader from '../components/Preloader';

export default function UpdateListing() {
    const { currentSeller } = useSelector((state) => state.seller); 
    const navigate = useNavigate();
    const params = useParams();
    const [subscription, setSubscription] = useState(null);
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
      imageUrls: [],
      name: '',
      description: '',
      address: '',
      type: 'rent',
      bedrooms: 1,
      bathrooms: 1,
      regularPrice: 50,
      discountPrice: 0,
      offer: false,
      parking: false,
      furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkSubscriptionAndFetchListing = async () => {
        try {
          // Check subscription status first
          const subRes = await fetch('/api/demo-payment/subscription-status', {
            credentials: 'include'
          });
          const subData = await subRes.json();
          
          if (!subData.hasActiveSubscription) {
            toast.error('You need an active subscription to update listings');
            setTimeout(() => navigate('/seller/subscription'), 2000);
            return;
          }
          
          setSubscription(subData.subscription);

          // Then fetch listing details
          const listingId = params.listingId;
          const res = await fetch(`/api/listing/get/${listingId}`);
          const data = await res.json();
          
          if (data.success === false) {
            setError(data.message);
            return;
          }
          
          // Verify if the listing belongs to the current seller
          if (data.userRef !== currentSeller._id) {
            setError("You can only edit your own listings");
            return;
          }
          
          setFormData(data);
          setError(false);
        } catch (error) {
          setError('Failed to fetch listing details');
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
      };

      checkSubscriptionAndFetchListing();
    }, [params.listingId, currentSeller._id, navigate]);

    // Handle image upload
    const handleImageSubmit = async (e) => {
      e.preventDefault();
  
      if (files.length === 0) {
        setImageUploadError('Please select at least one image.');
        return;
      }
  
      if (files.length + formData.imageUrls.length > 6) {
        setImageUploadError('You can only upload up to 6 images per listing.');
        return;
      }
  
      setUploading(true);
      setImageUploadError('');
  
      try {
        const urls = await Promise.all(
          Array.from(files).map(async (file) => {
            // Validate file size (2MB limit)
            if (file.size > 2 * 1024 * 1024) {
              throw new Error('File size must be less than 2MB.');
            }
            return await storeImage(file);
          })
        );
  
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImageUploadError('');
      } catch (error) {
        setImageUploadError(error.message || 'Image upload failed. Please try again.');
      } finally {
        setUploading(false);
      }
    };
  
    // Upload image to Supabase Storage
    const storeImage = async (file) => {
      const fileName = `${new Date().getTime()}-${file.name}`;
  
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('listing-images')
        .upload(fileName, file);
  
      if (error) {
        throw new Error('Failed to upload image to Supabase.');
      }
  
      // Get public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('listing-images')
        .getPublicUrl(data.path);
  
      return publicUrlData.publicUrl;
    };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      
      setLoading(true);
      setError(false);
      
        const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentSeller._id,
        }),
      });
      const data = await res.json();
      
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      toast.success("Property updated successfully");
      setTimeout(() => navigate("/seller/my-listings"), 2000); 
    } catch (error) {
      setError('Failed to update listing');
      setLoading(false);
    }
  };
  
  if (loading) {
    return <Preloader />;
  }
  
  if (!subscription) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Subscription Required</h2>
          <p className="text-gray-600 mb-6">You need an active subscription to update property listings.</p>
          <Link
            to="/seller/subscription"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Subscription Plans
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen py-8 px-4">
        <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 py-6 px-8">
          <h1 className="text-3xl font-bold text-white text-center">
            Update Your Property Listing
          </h1>
          <p className="text-blue-100 text-center mt-2">Update the details below to modify your property listing</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column - Property Details */}
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">Property Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Modern Downtown Apartment"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      id="name"
                      maxLength="62"
                      minLength="10"
                      required
                      onChange={handleChange}
                      value={formData.name}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      placeholder="Describe your property..."
                      className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      id="description"
                      required
                      onChange={handleChange}
                      value={formData.description}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      placeholder="Full property address"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      id="address"
                      required
                      onChange={handleChange}
                      value={formData.address}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">Property Features</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                    <div className="flex gap-4">
                      <label className={`flex items-center p-3 rounded-lg cursor-pointer border-2 transition ${formData.type === 'rent' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-200'}`}>
                        <input
                          type="radio"
                          id="rent"
                          className="hidden"
                          onChange={handleChange}
                          checked={formData.type === 'rent'}
                        />
                        <span className={`ml-2 ${formData.type === 'rent' ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>For Rent</span>
                      </label>
                      
                      <label className={`flex items-center p-3 rounded-lg cursor-pointer border-2 transition ${formData.type === 'sale' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-200'}`}>
                        <input
                          type="radio"
                          id="sale"
                          className="hidden"
                          onChange={handleChange}
                          checked={formData.type === 'sale'}
                        />
                        <span className={`ml-2 ${formData.type === 'sale' ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>For Sale</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="parking"
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      onChange={handleChange}
                      checked={formData.parking}
                    />
                    <label htmlFor="parking" className="text-gray-700">Parking Available</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="furnished"
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      onChange={handleChange}
                      checked={formData.furnished}
                    />
                    <label htmlFor="furnished" className="text-gray-700">Furnished</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="offer"
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      onChange={handleChange}
                      checked={formData.offer}
                    />
                    <label htmlFor="offer" className="text-gray-700">Special Offer</label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  <div>
                    <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </span>
                      <input
                        type="number"
                        id="bedrooms"
                        min="1"
                        max="10"
                        required
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        onChange={handleChange}
                        value={formData.bedrooms}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14H5m14-4H5" />
                        </svg>
                      </span>
                      <input
                        type="number"
                        id="bathrooms"
                        min="1"
                        max="10"
                        required
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        onChange={handleChange}
                        value={formData.bathrooms}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">Pricing</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="regularPrice" className="block text-sm font-medium text-gray-700 mb-1">
                      Regular Price {formData.type === 'rent' && <span className="text-sm text-gray-500">(₹ / month)</span>}
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">₹</span>
                      <input
                        type="number"
                        id="regularPrice"
                        min="21"
                        required
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        onChange={handleChange}
                        value={formData.regularPrice}
                      />
                    </div>
                  </div>
                  
                  {formData.offer && (
                    <div>
                      <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Discounted Price {formData.type === 'rent' && <span className="text-sm text-gray-500">(₹ / month)</span>}
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">₹</span>
                        <input
                          type="number"
                          id="discountPrice"
                          min="11"
                          required
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          onChange={handleChange}
                          value={formData.discountPrice}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right column - Images */}
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 h-full">
                <h2 className="text-xl font-semibold text-blue-800 mb-2">Property Images</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Upload up to 6 images. The first image will be used as the cover.
                </p>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">Select Images</label>
                    <input
                      onChange={(e) => setFiles(e.target.files)}
                      className="file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100 cursor-pointer
                        text-gray-500 text-sm
                        border rounded-lg p-1"
                      type="file"
                      id="images"
                      accept="image/*"
                      multiple
                    />
                  </div>
                  
                  <div className="mt-4">
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={handleImageSubmit}
                      className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${uploading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition`}
                    >
                      {uploading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          Upload Images
                        </>
                      )}
                    </button>
                  </div>
                  
                  {imageUploadError && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {imageUploadError}
                    </div>
                  )}
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {formData.imageUrls.length > 0 ? (
                    formData.imageUrls.map((url, index) => (
                      <div key={url} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden border border-gray-200">
                            <img src={url} alt={`Property image ${index + 1}`} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {index === 0 ? 'Cover Image' : `Image ${index + 1}`}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">
                              {url.split('/').pop()}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="inline-flex items-center p-1.5 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">
                        No images uploaded yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Form Footer */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/seller/my-listings')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className={`inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${loading || uploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>Update Listing</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
