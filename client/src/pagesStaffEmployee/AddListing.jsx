import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaUpload, FaSpinner, FaTrash } from 'react-icons/fa';
import supabase from '../supabase';

const AddListing = () => {
  const [loading, setLoading] = useState(false);
  const [userLookupLoading, setUserLookupLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [userFound, setUserFound] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    regularPrice: 1000,
    discountPrice: 1000,
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    type: 'rent',
    offer: false,
    userEmail: '',
    userRef: '',
    imageUrls: []
  });

  const handleUserLookup = async () => {
    if (!formData.userEmail) {
      toast.error('Please enter a user email');
      return;
    }
    
    setUserLookupLoading(true);
    try {
      const res = await fetch(`/api/user/find-by-email?email=${formData.userEmail}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      const data = await res.json();
      
      if (data.success) {
        setUserFound({
          id: data.user._id,
          name: data.user.username || data.user.name,
          email: data.user.email
        });
        setFormData({
          ...formData,
          userRef: data.user._id
        });
        toast.success('User found successfully!');
      } else {
        setUserFound(null);
        toast.error(data.message || 'User not found');
      }
    } catch (error) {
      console.error('Error looking up user:', error);
      toast.error('Error looking up user. Please try again.');
    } finally {
      setUserLookupLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    
    if (id === 'userEmail') {
      setUserFound(null);
      setFormData({
        ...formData,
        userRef: '',
        [id]: value
      });
      return;
    }
    
    // Handle different input types
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [id]: checked
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [id]: value === '' ? '' : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [id]: value
      });
    }
  };

  const validateFiles = (files) => {
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    
    const validFiles = [];
    const invalidFiles = [];
    
    Array.from(files).forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push({ name: file.name, reason: 'File too large (max 2MB)' });
      } else if (!ALLOWED_TYPES.includes(file.type)) {
        invalidFiles.push({ name: file.name, reason: 'Invalid file type (only JPG, PNG, WEBP allowed)' });
      } else {
        validFiles.push(file);
      }
    });
    
    return { validFiles, invalidFiles };
  };

  const handleFileChange = (e) => {
    const fileList = e.target.files;
    if (!fileList.length) return;
    
    const { validFiles, invalidFiles } = validateFiles(fileList);
    
    if (invalidFiles.length > 0) {
      invalidFiles.forEach(file => {
        toast.error(`${file.name}: ${file.reason}`);
      });
    }
    
    if (validFiles.length > 0) {
      setImages(validFiles);
      toast.info(`${validFiles.length} file(s) selected and ready to upload`);
    }
  };

  const handleImageSubmit = (e) => {
    e.preventDefault();
    if (images.length === 0) {
      setImageUploadError('Please select at least one image');
      return;
    }
    if (images.length + formData.imageUrls.length > 6) {
      setImageUploadError('You can only upload up to 6 images per listing');
      return;
    }
    
    setImageUploadError(null);
    setUploading(true);
    setUploadProgress(0);
    
    console.log(`Starting to upload ${images.length} images to Supabase...`);
    
    const totalFiles = images.length;
    let processedFiles = 0;
    let successfulUploads = 0;
    let promises = [];
    
    // Display initial progress update
    if (totalFiles > 0) {
      document.getElementById('images').value = ''; // Clear file input
    }
    
    // Process each file
    for (let i = 0; i < images.length; i++) {
      promises.push(
        storeImage(images[i])
          .then(imageUrl => {
            processedFiles++;
            successfulUploads++;
            // Update progress bar
            const progress = Math.floor((processedFiles / totalFiles) * 100);
            setUploadProgress(progress);
            console.log(`Progress: ${processedFiles}/${totalFiles} (${progress}%)`);
            return imageUrl;
          })
          .catch(err => {
            processedFiles++;
            // Update progress bar even for failures
            setUploadProgress(Math.floor((processedFiles / totalFiles) * 100));
            setImageUploadError(prev => 
              (prev ? prev + '; ' : '') + `Error uploading image ${images[i].name}: ${err.message}`
            );
            console.error(`Failed to upload image ${images[i].name}:`, err);
            return null; // Return null for failed uploads
          })
      );
    }
    
    Promise.all(promises)
      .then(urlResults => {
        const validResults = urlResults.filter(result => result !== null);
        
        if (validResults.length === 0) {
          setImageUploadError('All image uploads failed. Please try again.');
          setUploading(false);
          return;
        }
        
        console.log(`Successfully uploaded ${validResults.length}/${images.length} images to Supabase.`);
        
        setFormData({
          ...formData,
          imageUrls: [...formData.imageUrls, ...validResults],
        });
        
        setImages([]);
        setUploading(false);
        if (successfulUploads > 0) {
          toast.success(`Successfully uploaded ${successfulUploads} image${successfulUploads > 1 ? 's' : ''}`);
        }
      })
      .catch((err) => {
        console.error('Error in image upload process:', err);
        setImageUploadError('An unexpected error occurred during image upload');
        setUploading(false);
      });
  };

  // Upload image to Supabase Storage
  const storeImage = async (file) => {
    console.log('Uploading file to Supabase:', file.name, 'Size:', (file.size / 1024).toFixed(2), 'KB');
    return new Promise(async (resolve, reject) => {
      try {
        // Check file size (2MB limit for Supabase)
        if (file.size > 2 * 1024 * 1024) {
          // If file is too large, compress it before uploading
          try {
            const compressedFile = await compressImageFile(file);
            return uploadToSupabase(compressedFile);
          } catch (compressionError) {
            console.error('Error compressing image:', compressionError);
            return uploadToSupabase(file); // Try with original file
          }
        } else {
          return uploadToSupabase(file);
        }
        
        async function uploadToSupabase(fileToUpload) {
          // Create a unique filename
          const fileName = `${new Date().getTime()}-${fileToUpload.name.replace(/\s+/g, '_')}`;
          
          // Upload the file to Supabase Storage
          const { data, error } = await supabase.storage
            .from('listing-images')
            .upload(fileName, fileToUpload);
            
          if (error) {
            console.error('Supabase upload error:', error);
            reject(new Error('Failed to upload image to storage service.'));
            return;
          }
          
          // Get public URL for the uploaded file
          const { data: publicUrlData } = supabase.storage
            .from('listing-images')
            .getPublicUrl(data.path);
            
          console.log('Image uploaded successfully:', publicUrlData.publicUrl);
          resolve(publicUrlData.publicUrl);
        }
      } catch (error) {
        console.error('Error in storeImage function:', error);
        reject(error);
      }
    });
  };
  
  // Helper function to compress images as files (not base64)
  const compressImageFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          
          // Impose stricter image size limits
          const maxWidth = 1200;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          
          // Limit height as well to prevent tall images
          const maxHeight = maxWidth;
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
          
          // Create canvas and resize image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.fillStyle = 'white'; // Set background to white
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to blob with lower quality
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Canvas to Blob conversion failed'));
                return;
              }
              
              // Create a new file from the blob
              const compressedFile = new File(
                [blob], 
                file.name, 
                { type: 'image/jpeg', lastModified: new Date().getTime() }
              );
              
              console.log(`Compressed ${file.name}: 
                Original: ${(file.size/1024).toFixed(1)}KB
                Compressed: ${(compressedFile.size/1024).toFixed(1)}KB
                Reduction: ${((1 - compressedFile.size/file.size) * 100).toFixed(1)}%`
              );
              
              resolve(compressedFile);
            }, 
            'image/jpeg', 
            0.7 // quality
          );
        };
        
        img.onerror = (error) => {
          reject(error);
        };
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index)
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.description || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!formData.userRef) {
      toast.error('Please select a user for this listing');
      return;
    }
    
    if (formData.imageUrls.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    
    try {
      setLoading(true);
      setSubmitError(null);
      
      console.log(`Submitting listing with ${formData.imageUrls.length} images.`);
      
      const res = await fetch('/api/staff-listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 413) {
          // Payload too large error - should not happen with URLs
          setSubmitError(`Error: The listing data is too large.`);
          toast.error('Error: Listing data is too large');
        } else {
          setSubmitError(data.message || 'Something went wrong');
          toast.error(data.message || 'Error creating listing');
        }
        setLoading(false);
        return;
      }
      
      setLoading(false);
      toast.success('Listing created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        address: '',
        type: 'rent',
        parking: false,
        furnished: false,
        offer: false,
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 1000,
        discountPrice: 0,
        userEmail: '',
        userRef: '',
        imageUrls: [],
      });
      
      setUserFound(null);
      
    } catch (error) {
      console.error('Error creating listing:', error);
      setSubmitError('An unexpected error occurred');
      setLoading(false);
      toast.error('Failed to create listing');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Property Listing</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Assign to User</h2>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Email
            </label>
            <input
              type="email"
              id="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter user's email address"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleUserLookup}
              disabled={userLookupLoading}
              className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 h-10"
            >
              {userLookupLoading ? <FaSpinner className="animate-spin" /> : 'Find User'}
            </button>
          </div>
        </div>
        
        {userFound && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-medium">User found:</span> {userFound.name} ({userFound.email})
            </p>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Property Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Name*
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Property name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address*
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Address"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description*
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="Property description"
            required
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Regular Price*
            </label>
            <div className="flex items-center">
              <input
                type="number"
                id="regularPrice"
                value={formData.regularPrice}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                min="1000"
                required
              />
              <span className="ml-2 text-gray-500">{formData.type === 'rent' ? '$ / month' : '$'}</span>
            </div>
          </div>
          
          {formData.offer && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discounted Price*
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  id="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max={formData.regularPrice}
                  required={formData.offer}
                />
                <span className="ml-2 text-gray-500">{formData.type === 'rent' ? '$ / month' : '$'}</span>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bedrooms*
            </label>
            <input
              type="number"
              id="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              min="1"
              max="10"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bathrooms*
            </label>
            <input
              type="number"
              id="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              min="1"
              max="10"
              required
            />
          </div>
          
          <div className="flex items-center space-x-2 mt-8">
            <input
              type="checkbox"
              id="furnished"
              checked={formData.furnished}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="furnished" className="text-sm font-medium text-gray-700">
              Furnished
            </label>
          </div>
          
          <div className="flex items-center space-x-2 mt-8">
            <input
              type="checkbox"
              id="parking"
              checked={formData.parking}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="parking" className="text-sm font-medium text-gray-700">
              Parking Spot
            </label>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mb-6">
          <input
            type="checkbox"
            id="offer"
            checked={formData.offer}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="offer" className="text-sm font-medium text-gray-700">
            Offer
          </label>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images*
          </label>
          <p className="text-xs text-gray-500 mb-2">
            The first image will be the cover (max 6 images, 2MB each)
          </p>
          
          <div className="flex gap-2 mb-2">
            <input
              type="file"
              id="images"
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              multiple
              className="hidden"
            />
            <label
              htmlFor="images"
              className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded flex items-center"
            >
              <FaUpload className="mr-2" />
              Choose Files
            </label>
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading || images.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 flex items-center"
            >
              {uploading ? <FaSpinner className="animate-spin mr-2" /> : null}
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          
          {/* Display selected file names before upload */}
          {images.length > 0 && (
            <div className="mt-2 mb-4">
              <p className="text-sm font-medium text-gray-700">Selected files ({images.length}):</p>
              <ul className="text-sm text-gray-600 mt-1">
                {Array.from(images).map((file, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-4 h-4 mr-2 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-600">
                      {index + 1}
                    </span>
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Display uploaded images */}
          {formData.imageUrls && formData.imageUrls.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Uploaded images ({formData.imageUrls.length}/6):</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className="relative h-32 rounded overflow-hidden">
                    <img
                      src={url}
                      alt={`Property ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <FaTrash size={12} />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-0 left-0 bg-blue-600 text-white text-xs py-1 px-2">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Display upload progress bar */}
          {uploading && (
            <div className="mt-3">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">Processing images: {uploadProgress}%</p>
            </div>
          )}
          
          {/* Display error messages */}
          {imageUploadError && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {imageUploadError}
            </div>
          )}
          
          {submitError && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <p className="font-medium">Error:</p>
              <p>{submitError}</p>
            </div>
          )}
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            disabled={loading || !formData.userRef}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Creating Listing...
              </>
            ) : (
              'Create Listing'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddListing; 