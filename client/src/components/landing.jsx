import { Brain, Sparkles, Zap, TreeDeciduous, Home, ArrowRight, LogIn, User, Users, Shield } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Landing = () => {
    

  return (
    <main className="relative min-h-screen flex items-center" aria-labelledby="hero-title">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 -z-10" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-10">
        <header className="mb-16">
          <h1 id="hero-title" className="flex flex-col items-center text-center gap-4 text-4xl sm:text-5xl md:text-6xl font-bold mb-8 animate-fadeIn">
            <span className="w-full">Welcome to <span className="text-[#0066FF]">Estate</span><span className="text-black">Bro</span></span>
            <span className="text-2xl sm:text-3xl md:text-4xl text-gray-600 w-full">Find Your Dream Home, Anytime, Anywhere</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-center animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          EstateBro is your go-to platform for buying, renting, selling, or leasing properties. Simplify your real estate journey with our user-friendly tools and seamless experience.
          </p>

          <nav className="flex flex-col sm:flex-row justify-center gap-4 mb-8 animate-fadeIn" style={{ animationDelay: "0.4s" }} aria-label="Primary navigation">
            <Link
              to='/buyer/'
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-white bg-[#0066FF] hover:bg-[#0066FF]/90 transition-all shadow-[0_4px_14px_0_rgba(0,102,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,102,255,0.23)] hover:transform hover:translate-y-[-1px]"
              aria-label="Get DeepSeek App"
            >
              Explore Properties
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              to='/seller/'
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-green-500 text-base font-medium rounded-full text-green-500 bg-white hover:bg-blue-50 transition-all shadow-[0_4px_14px_0_rgba(0,102,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,102,255,0.23)] hover:transform hover:translate-y-[-1px]"
              aria-label="Save the Planet"
            >
              List Properties
              <Home className="ml-2 h-5 w-5 text-green-500" aria-hidden="true" />
            </Link>
          </nav>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Advanced Searching</span>
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Added Facilities</span>
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">24/7 hrs Support</span>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-24 animate-fadeIn" aria-label="Key Features" style={{ animationDelay: "0.6s" }}>
  <article className="p-8 rounded-xl bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all" aria-labelledby="feature-1-title">
    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6 mx-auto">
      <Home className="h-8 w-8 text-[#0066FF]" /> {/* Replaced Brain with Home icon */}
    </div>
    <h2 id="feature-1-title" className="text-2xl font-semibold mb-4">Find Your Dream Home</h2>
    <p className="text-gray-600">Explore thousands of listings tailored to your preferences. Whether buying or renting, we make it easy to find the perfect property.</p>
  </article>
  <article className="p-8 rounded-xl bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all" aria-labelledby="feature-2-title">
    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6 mx-auto">
      <Sparkles className="h-8 w-8 text-[#0066FF]" /> {/* Kept Sparkles for a modern touch */}
    </div>
    <h2 id="feature-2-title" className="text-2xl font-semibold mb-4">Sell or Rent with Ease</h2>
    <p className="text-gray-600">List your property effortlessly and connect with verified buyers or tenants. Our platform ensures a smooth and secure transaction process.</p>
  </article>
  <article className="p-8 rounded-xl bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all" aria-labelledby="feature-3-title">
    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6 mx-auto">
      <Zap className="h-8 w-8 text-[#0066FF]" /> {/* Kept Zap for energy and speed */}
    </div>
    <h2 id="feature-3-title" className="text-2xl font-semibold mb-4">Smart Property Insights</h2>
    <p className="text-gray-600">Get data-driven insights and market trends to make informed decisions. Our tools help you stay ahead in the real estate market.</p>
  </article>
</section>

        <section className="mt-24 py-16 bg-white/80 rounded-3xl shadow-lg">
        <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Why Choose <span className="text-[#0066FF]">Estate</span>Bro?</h2>
            <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Home className="h-5 w-5 text-green-500" /> {/* Replaced TreeDeciduous with Home icon */}
                </div>
                </div>
                <div>
                <h3 className="font-semibold mb-2">Wide Range of Listings</h3>
                <p className="text-gray-600">From apartments to villas, we offer a diverse selection of properties to suit every need and budget.</p>
                </div>
            </div>
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-[#0066FF]" /> {/* Kept Zap for speed and efficiency */}
                </div>
                </div>
                <div>
                <h3 className="font-semibold mb-2">Fast and Secure Transactions</h3>
                <p className="text-gray-600">Our platform ensures quick, transparent, and secure property transactions for buyers, sellers, and renters.</p>
                </div>
            </div>
            </div>
        </div>
        </section>

        {/* Sign-In Options Section */}
        <section className="mt-24 py-16 bg-white/80 rounded-3xl shadow-lg border border-blue-100">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="w-24 h-1 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full mb-4"></div>
              <h2 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Sign In to Your Account</h2>
              <p className="text-gray-600 text-center mb-6 max-w-2xl mx-auto">Access your personalized dashboard and take advantage of all our features</p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Buyer Sign In */}
              <div className="bg-gradient-to-b from-white to-blue-50 rounded-xl shadow-md hover:shadow-xl transition-all p-6 text-center border border-blue-100 group hover:transform hover:scale-105">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:shadow-blue-200">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-blue-800">Buyer</h3>
                <p className="text-gray-600 mb-6">Find and purchase your dream property</p>
                <Link 
                  to="/buyer/signin" 
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md hover:from-blue-600 hover:to-blue-800 transition duration-200 shadow-md hover:shadow-lg"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In as Buyer
                </Link>
              </div>
              
              {/* Seller Sign In */}
              <div className="bg-gradient-to-b from-white to-blue-50 rounded-xl shadow-md hover:shadow-xl transition-all p-6 text-center border border-blue-100 group hover:transform hover:scale-105">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:shadow-blue-200">
                  <Home className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-blue-800">Seller</h3>
                <p className="text-gray-600 mb-6">List and manage your properties</p>
                <Link 
                  to="/seller/signin" 
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md hover:from-blue-600 hover:to-blue-800 transition duration-200 shadow-md hover:shadow-lg"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In as Seller
                </Link>
              </div>
              
              {/* Staff Sign In */}
              <div className="bg-gradient-to-b from-white to-blue-50 rounded-xl shadow-md hover:shadow-xl transition-all p-6 text-center border border-blue-100 group hover:transform hover:scale-105">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:shadow-blue-200">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-blue-800">Staff</h3>
                <p className="text-gray-600 mb-6">Access staff management tools</p>
                <Link 
                  to="/staff/signin" 
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md hover:from-blue-600 hover:to-blue-800 transition duration-200 shadow-md hover:shadow-lg"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In as Staff
                </Link>
              </div>
              
              {/* Admin Sign In */}
              <div className="bg-gradient-to-b from-white to-blue-50 rounded-xl shadow-md hover:shadow-xl transition-all p-6 text-center border border-blue-100 group hover:transform hover:scale-105">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:shadow-blue-200">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-blue-800">Admin</h3>
                <p className="text-gray-600 mb-6">Full platform administration</p>
                <Link 
                  to="/staff/signin" 
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md hover:from-blue-600 hover:to-blue-800 transition duration-200 shadow-md hover:shadow-lg"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In as Admin
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer with copyright */}
        <footer className="mt-24 text-center text-gray-500">
          <p>© {new Date().getFullYear()} EstateBro. All rights reserved.</p>
        </footer>
      </div>

    </main>
  );
};

export default Landing;