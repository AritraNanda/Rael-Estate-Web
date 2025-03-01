// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
// import SignIn from './pages/SignIn';
// import SignUp from './pages/SignUp';
// import About from './pages/About';
// import Profile from './pages/Profile';
// import Header from './components/Header';
// import PrivateRoute from './components/privateRoute';

// import Landing from './components/landing';

// export default function App(){
//   return(
//     <BrowserRouter>
//       <Header />
//       <Routes>
//         <Route path="/" element={<Home/>}/>
//         <Route path="/signin" element={<SignIn/>}/>
//         <Route path="/signup" element={<SignUp/>}/>
//         <Route path="/about" element={<About/>}/>
//         <Route element={<PrivateRoute/>}>
//           <Route path="/profile" element={<Profile/>}/>
//         </Route>

//         <Route path="/landing" element={<Landing/>}/>

//       </Routes>
//     </BrowserRouter>
//   )
// }


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './components/landing';
import BuyerLayout from './layouts/BuyerLayout';
import SellerLayout from './layouts/SellerLayout';

export default function App() {
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