import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Home from '../pages/Home';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import About from '../pages/About';
import Profile from '../pages/Profile';
import Listing from '../pages/Listing';
import ContactSupport from '../pages/ContactSupport';
import SavedProperties from '../pages/SavedProperties';
import Search from '../pages/Search';
import ListingItem from '../components/ListingItem';
import GuideBuyer from '../pages/GuideBuyer';

import PrivateRoute from '../components/privateRoute';

const BuyerLayout = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/saved-properties" element={<SavedProperties />} />
        </Route>
        <Route path="/listing/:id" element={<Listing />} />
        <Route path="/contact-support" element={<ContactSupport />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing-item" element={<ListingItem />} />
        <Route path="/guide-buyer" element={<GuideBuyer />} />
      </Routes>
    </>
  );
};

export default BuyerLayout;