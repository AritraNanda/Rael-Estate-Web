import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRouteSeller() {
  const { currentSeller } = useSelector((state) => state.seller); // Access currentSeller from seller slice
  return currentSeller ? <Outlet /> : <Navigate to="/seller/signin" />;
}