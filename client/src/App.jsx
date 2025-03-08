import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './components/landing';
import BuyerLayout from './layouts/BuyerLayout';
import SellerLayout from './layouts/SellerLayout';
import { useEffect, useState } from 'react';
import Preloader from './components/Preloader';


export default function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Show preloader for 1 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4aed88',
            },
          },
        }}
      />
      <Routes>
        {/* Landing Page (No Header) */}
        <Route path="/" element={<Landing />} />

        {/* Buyer Routes */}
        <Route path="/buyer/*" element={<BuyerLayout />} />

        {/* Seller Routes */}
        <Route path="/seller/*" element={<SellerLayout />} />
      </Routes>
    </BrowserRouter>
  );
}