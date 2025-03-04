
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
    }, 2000); // Show preloader for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <BrowserRouter>
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