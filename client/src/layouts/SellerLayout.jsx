import { Routes, Route } from 'react-router-dom';
import SellerHeader from '../components/SellerHeader'
import Home from '../pagesSeller/Home';
import SignIn from '../pagesSeller/SignIn';
import SignUp from '../pagesSeller/SignUp';
import About from '../pagesSeller/About';
import Profile from '../pagesSeller/Profile';
import CreateListing from '../pagesSeller/CreateListing';
import SubscriptionPage from '../pagesSeller/SubscriptionPage';

import PrivateRouteSeller from '../components/privateRouteSeller';

const SellerLayout = () => {
  return (
    <>
      <SellerHeader/>
      <Routes>
        
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRouteSeller />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing/>} />
          <Route path='/subscription' element={<SubscriptionPage/>} />
        </Route>
      </Routes>
    </>
  );
};

export default SellerLayout;