import React from 'react';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Box, Avatar } from '@mui/material';
import { deepPurple } from '@mui/material/colors';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-8">
          {/* Logo and Quote Section */}
          <div className="flex flex-col items-center md:items-start mb-5 md:mb-0">
            <Box display="flex" alignItems="center" className="mb-3">
              <Avatar sx={{ bgcolor: deepPurple[500], width: 40, height: 40 }}>
                <ShoppingBagIcon fontSize="medium" />
              </Avatar>
              <h2 className="ml-3 font-bold text-2xl">Sathya's Shopping</h2>
            </Box>
            <p className="text-center md:text-left text-gray-300 text-sm md:text-base italic">
              "Discover More, Spend Less – Experience the Joy of Shopping with Sathya's Shopping!"
            </p>
          </div>

          {/* About Us Section */}
          <div className="w-full md:w-1/3 mb-4 md:mb-0 px-4">
            <h2 className="text-xl font-bold mb-2">About Us</h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              We are a leading e-commerce platform providing a wide range of products
              to meet all your needs. Our goal is to offer exceptional service and 
              a seamless shopping experience.
            </p>
          </div>

          {/* Contact Us Section */}
          <div className="w-full md:w-1/3 px-4">
            <h2 className="text-xl font-bold mb-2">Contact Us</h2>
            <p className="text-gray-400 text-sm md:text-base">Email: <a href="mailto:support@sathyashopping.com" className="text-blue-400">support@sathyashopping.com</a></p>
            <p className="text-gray-400 text-sm md:text-base">Phone: <a href="tel:123-456-7890" className="text-blue-400">123-456-7890</a></p>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="bg-gray-700 py-4">
          <p className="text-center text-gray-400 text-sm md:text-base">
            &copy; 2024 Sathya's Shopping Site. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
