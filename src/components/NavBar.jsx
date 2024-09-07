import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Cart from '../images/cart.png';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa'; // Import profile icon
import HistoryIcon from '@mui/icons-material/History';

import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Box, Avatar } from '@mui/material';
import { deepPurple } from '@mui/material/colors';

const Navbar = () => {
  const { isAuthenticated, logout, userId } = useAuth();
  const [username, setUsername] = useState('');
  const [cartCount, setCartCount] = useState(0); // State to track the cart item count
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to handle dropdown menu visibility
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Reference for the dropdown menu
  const [emoji, setEmoji] = useState('👋');

  useEffect(() => {
    const fetchUsername = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:3000/api/user/${userId}`);
          setUsername(response.data.username); // Assuming the API returns { username }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };



    const fetchCartCount = async () => {
      if (userId) {
        try {
          const response = await axios.get('http://localhost:3000/api/carts');
          const carts = response.data;
          const userCart = carts.find(cart => cart.created_by === userId);
          if (userCart && userCart.products) {
            const totalCount = userCart.products.reduce((acc, item) => acc + item.orderQuantity, 0);
            setCartCount(totalCount);
          }
        } catch (error) {
          console.error('Error fetching cart data:', error);
        }
      }
    };

    fetchUsername();
    fetchCartCount();
  }, [userId]);


  useEffect(() => {
    const getEmoji = () => {
      const hour = new Date().getHours();
      console.log(hour);
      
      if (hour < 12) {
        return '🌞'; // Morning
      } else if (hour < 18) {
        return '☀️'; // Afternoon
      } else {
        return '🌜'; // Evening
      }
    };

    setEmoji(getEmoji());
  }, []);
  
  // Handle click outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout(); // Call logout function from context
    navigate('/'); // Redirect to home page
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

   // Function to capitalize the first letter of the username
   const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <nav className="bg-purple-950 p-4 relative"> {/* Add relative positioning to the nav */}
      <div className="container mx-auto flex justify-between items-center ml-3">
      <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: deepPurple[500], width: 36, height: 36 }}>
                <ShoppingBagIcon fontSize="large" />
            </Avatar>
            <Link to="/" className="text-white text-xl font-bold ml-3">Sathya's Shopping</Link>
            
        </Box>
    
        
        <div className="flex items-center"> {/* Ensure the links are in the same row */}
          {isAuthenticated ? (
            <>
              <span className="text-white mr-7 flex items-center relative font-bold">
                <span className="text-xl mr-7">{username ? `Hello, ${capitalizeFirstLetter(username)} ${emoji}` : 'Loading...'}</span>
                <FaUserCircle 
                  onClick={toggleDropdown} 
                  className="text-white cursor-pointer" 
                  size={24} 
                />
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-10 top-12 bg-white text-black shadow-lg rounded-lg w-48 z-50 mt-3 mr-10"
                  >
                    <button 
                      onClick={handleLogout} 
                      className="block px-4 py-2 w-full text-left hover:bg-gray-200 transition-colors duration-200 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </span>
              <Link to="/carts" className="text-white mr-7">
                <img src={Cart} alt="Cart" style={{ width: "25px", height: "25px" }} />
                {cartCount > 0 && (
                  <span className="absolute top-3 right-20 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link to="/order-details" className="text-white mr-5">
                  <div className="flex items-center space-x-1">
                    <HistoryIcon style={{ fontSize: 30, color: 'white' }} />
                  </div>
              </Link>
              
            </>
          ) : (
            <>
              <Link to="/signup" className="text-white mr-10 font-bold">Sign Up</Link>
              <Link to="/login" className="text-white mr-10 font-bold">Login</Link>
              <Link to="/carts" className="text-white mr-5">
                <img src={Cart} alt="Cart" style={{ width: "25px", height: "25px" }} />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
