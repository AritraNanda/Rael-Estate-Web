import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Landing from './components/landing';
import BuyerLayout from './layouts/BuyerLayout';
import SellerLayout from './layouts/SellerLayout';
import { useEffect, useState } from 'react';
import Preloader from './components/Preloader';
import StaffLayout from './layouts/StaffLayout';
import StaffEmployeeLayout from './layouts/StaffEmployeeLayout';

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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        {/* Landing Page (No Header) */}
        <Route path="/" element={<Landing />} />

        {/* Buyer Routes */}
        <Route path="/buyer/*" element={<BuyerLayout />} />

        {/* Seller Routes */}
        <Route path="/seller/*" element={<SellerLayout />} />

        {/* Staff Routes (Admin) */}
        <Route path="/staff/*" element={<StaffLayout />} />
        
        {/* Staff Employee Routes */}
        <Route path="/staff-employee/*" element={<StaffEmployeeLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
