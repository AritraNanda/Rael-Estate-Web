import { Routes, Route } from 'react-router-dom';
import SellerHeader from '../components/SellerHeader'
import Home from '../pagesSeller/Home';
import SignIn from '../pagesSeller/SignIn';
import SignUp from '../pagesSeller/SignUp';
import About from '../pagesSeller/About';
import Profile from '../pagesSeller/Profile';
import CreateListing from '../pagesSeller/CreateListing';
import SubscriptionPage from '../pagesSeller/SubscriptionPage';
import MyListings from '../pagesSeller/mylistings';
import UpdateListing from '../pagesSeller/UpdateListing';
import GuideSeller from '../pagesSeller/GuideSeller';
import ContactSupport from '../pagesSeller/ContactSupport';

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
          <Route path='/my-listings' element={<MyListings/>} />
          <Route path='/update-listing/:listingId' element={<UpdateListing/>} />
          <Route path='/guide' element={<GuideSeller/>} />
          <Route path='/contact-support' element={<ContactSupport/>} />
        </Route>
      </Routes>
    </>
  );
};

export default SellerLayout;