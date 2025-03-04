import React from 'react';

export default function Preloader() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white z-50">
      {/* Logo */}
      <div className="mb-8 text-4xl font-bold">
        <span className="text-blue-600">Estate</span>
        <span className="text-gray-900">Bro</span>
      </div>
      
      {/* Loading Animation */}
      <div className="relative">
        {/* Outer circle */}
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
        {/* Spinning inner circle */}
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      
      {/* Loading Text */}
      <div className="mt-4 text-gray-600">
        <span className="inline-block animate-pulse">Loading</span>
        <span className="inline-block animate-bounce delay-100">.</span>
        <span className="inline-block animate-bounce delay-200">.</span>
        <span className="inline-block animate-bounce delay-300">.</span>
      </div>
    </div>
  );
} 