// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto flex flex-wrap justify-between px-4">
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <h2 className="text-xl font-bold mb-2">About Us</h2>
          <p className="text-gray-400">
            We are a leading e-commerce platform providing a wide range of products
            to meet all your needs. Our goal is to offer exceptional service and 
            a seamless shopping experience.
          </p>
        </div>
        
        <div className="w-full md:w-1/3">
          <h2 className="text-xl font-bold mb-2">Contact Us</h2>
          <p className="text-gray-400">Email: support@sathyashopping.com</p>
          <p className="text-gray-400">Phone: 123-456-7890</p>
        </div>
      </div>
      <div className="bg-gray-700 py-4 mt-5">
        <p className="text-center text-gray-400">&copy; 2024 Sathya's Shopping Site. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
