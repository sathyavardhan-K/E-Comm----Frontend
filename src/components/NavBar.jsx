
// import React, { useState, useEffect, useRef } from 'react';
// import { useAuth } from '../AuthContext';
// import { Link, useNavigate } from 'react-router-dom';
// import Cart from '../images/cart.png';
// import axios from 'axios';
// import { FaUserCircle } from 'react-icons/fa';
// import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons for opening/closing the side nav
// import HistoryIcon from '@mui/icons-material/History';
// import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
// import { Box, Avatar } from '@mui/material';
// import { deepPurple } from '@mui/material/colors';

// const Navbar = () => {
//   const { isAuthenticated, logout, userId } = useAuth();
//   const [username, setUsername] = useState('');
//   const [userType, setUserType] = useState('');
//   const [cartCount, setCartCount] = useState(0);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isSideNavOpen, setIsSideNavOpen] = useState(false); // State to handle side navigation visibility
//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);
//   const [emoji, setEmoji] = useState('👋');

//   useEffect(() => {
//     const fetchUsername = async () => {
//       if (userId) {
//         try {
//           const response = await axios.get(`http://localhost:3000/api/user/${userId}`);
//           setUsername(response.data.username);
          
//           setUserType(response.data.userType);
//           console.log(response.data.userType);
          
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         }
//       }
//     };

//     const fetchCartCount = async () => {
//       if (userId) {
//         try {
//           const response = await axios.get('http://localhost:3000/api/carts');
//           const carts = response.data;
//           const userCart = carts.find(cart => cart.created_by === userId);
//           if (userCart && userCart.products) {
//             // const totalCount = userCart.products.reduce((acc, item) => acc + item.orderQuantity, 0);
//             // setCartCount(totalCount);
//             const distinctProductCount = userCart.products.length; // Count distinct products only
//             setCartCount(distinctProductCount);
//           }
//         } catch (error) {
//           console.error('Error fetching cart data:', error);
//         }
//       }
//     };

//     fetchUsername();
//     fetchCartCount();
//   }, [userId]);

//   useEffect(() => {
//     const getEmoji = () => {
//       const hour = new Date().getHours();
//       if (hour < 12) {
//         return '🌞'; // Morning
//       } else if (hour < 18) {
//         return '☀️'; // Afternoon
//       } else {
//         return '🌜'; // Evening
//       }
//     };

//     setEmoji(getEmoji());
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen(prev => !prev);
//   };

//   const toggleSideNav = () => {
//     setIsSideNavOpen(prev => !prev);
//   };

//   const closeSideNav = () => {
//     setIsSideNavOpen(false);
//   };

//   const capitalizeFirstLetter = (str) => {
//     if (!str) return '';
//     return str.charAt(0).toUpperCase() + str.slice(1);
//   };

//   const handleUserIconClick = () => {
//     if (isAuthenticated) {
//       handleLogout(); // Directly handle logout on mobile view
//     } else {
//       toggleDropdown(); // Toggle dropdown if not logged in
//     }
//   };

//   return (
//     <nav className="bg-purple-950 p-4 relative">
//       <div className="container mx-auto flex justify-between items-center">
//         <Box display="flex" alignItems="center">
//           <Avatar sx={{ bgcolor: deepPurple[500], width: 36, height: 36 }}>
//             <ShoppingBagIcon fontSize="large" />
//           </Avatar>
//           <Link to="/" className="text-white text-xl font-bold ml-3">Sathya's Shopping</Link>
//         </Box>

//         <button onClick={toggleSideNav} className="text-white md:hidden">
//           <FaBars size={24} />
//         </button>

//         {/* Desktop View */}
//         <div className="hidden md:flex items-center space-x-4">
//           {isAuthenticated ? (
//             <>
//               <span className="text-white flex items-center relative font-bold">
//                 <span className="text-xl">{username ? `Hello, ${capitalizeFirstLetter(username)} ${emoji}` : 'Loading...'}</span>
//                 <FaUserCircle 
//                   onClick={toggleDropdown} 
//                   className="text-white cursor-pointer" 
//                   size={24} 
//                 />
//                 {isDropdownOpen && (
//                   <div
//                     ref={dropdownRef}
//                     className="absolute left-10 top-12 bg-white text-black shadow-lg rounded-lg w-48 z-50 mt-3 mr-10"
//                   >
//                     <button 
//                       onClick={handleLogout} 
//                       className="block px-4 py-2 w-full text-left hover:bg-gray-200 transition-colors duration-200 rounded-lg"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </span>
              
//               <Link to="/carts" className="text-white mr-7">
//                 <img src={Cart} alt="Cart" style={{ width: "25px", height: "25px" }} />
//                 {cartCount > 0 && (
//                   <span className="absolute top-3 right-12 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
//                     {cartCount}
//                   </span>
//                 )}
//               </Link>

//               <Link to="/order-details" className="text-white mr-5">
//                 <HistoryIcon style={{ fontSize: 30, color: 'white' }} />
//               </Link>
//             </>
//           ) : (
//             <>
//               <Link to="/signup" className="text-white mr-10 font-bold">Sign Up</Link>
//               <Link to="/login" className="text-white mr-10 font-bold">Login</Link>
//               <Link to="/carts" className="text-white mr-5">
//                 <img src={Cart} alt="Cart" style={{ width: "25px", height: "25px" }} />
//               </Link>
//             </>
//           )}
//         </div>

//         {/* Side Navigation for Mobile View */}
//         <div className={`fixed top-0 left-0 w-64 bg-purple-950 text-white h-full z-50 transform ${isSideNavOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
//           <button onClick={closeSideNav} className="text-white absolute top-4 right-4">
//             <FaTimes size={24} />
//           </button>

//           <div className="mt-16 flex flex-col space-y-4 px-6">
//             {isAuthenticated ? (
//               <>
//                 <span className="text-white flex items-center relative font-bold">
//                   <span className="text-xl mr-2">{username ? `Hello, ${capitalizeFirstLetter(username)} ${emoji}` : 'Loading...'}</span>
//                   <FaUserCircle 
//                     onClick={handleUserIconClick} 
//                     className="text-white cursor-pointer" 
//                     size={24} 
//                   />
//                 </span>
//                 <Link to="/carts" className="text-white mr-7" onClick={closeSideNav}>
//                   <div className='flex flex-row gap-1 mt-8'>
//                     <img src={Cart} alt="Cart" style={{ width: "25px", height: "25px" }} />
//                     {cartCount > 0 && (
//                       <span className="absolute top-32 left-10 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
//                         {cartCount}
//                       </span>
//                     )}
//                     <p className='ml-2'>Shopping Cart</p>
//                   </div>
//                 </Link>

//                 <Link to="/order-details" className="text-white mr-5" onClick={closeSideNav}>
//                   <div className='flex flex-row gap-1'>
//                     <HistoryIcon style={{ fontSize: 30, color: 'white' }} />
//                     <p>Order History</p>
//                   </div>
//                 </Link>
//               </>
//             ) : (
//               <>
//                 <Link to="/signup" className="text-white font-bold" onClick={closeSideNav}>Sign Up</Link>
//                 <Link to="/login" className="text-white font-bold" onClick={closeSideNav}>Login</Link>
//                 <Link to="/carts" className="text-white mr-5" onClick={closeSideNav}>
//                   <div className='flex flex-row gap-1'>
//                     <img src={Cart} alt="Cart" style={{ width: "25px", height: "25px" }} />
//                     <p>Shopping Cart</p>
//                   </div>
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Cart from '../images/cart.png';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons for opening/closing the side nav
import HistoryIcon from '@mui/icons-material/History';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Box, Avatar } from '@mui/material';
import { deepPurple } from '@mui/material/colors';

const Navbar = () => {
  const { isAuthenticated, logout, userId } = useAuth();
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false); // State to handle side navigation visibility
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [emoji, setEmoji] = useState('👋');

  useEffect(() => {
    const fetchUsername = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:3000/api/user/${userId}`);
          setUsername(response.data.username);
          setUserType(response.data.userType);
          console.log(response.data.userType);
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
            const distinctProductCount = userCart.products.length; // Count distinct products only
            setCartCount(distinctProductCount);
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
    logout();
    navigate('/');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const toggleSideNav = () => {
    setIsSideNavOpen(prev => !prev);
  };

  const closeSideNav = () => {
    setIsSideNavOpen(false);
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      handleLogout(); // Directly handle logout on mobile view
    } else {
      toggleDropdown(); // Toggle dropdown if not logged in
    }
  };

  return (
    <nav className="bg-purple-950 p-4 relative">
      <div className="container mx-auto flex justify-between items-center">
        <Box display="flex" alignItems="center">
          <Avatar sx={{ bgcolor: deepPurple[500], width: 36, height: 36 }}>
            <ShoppingBagIcon fontSize="large" />
          </Avatar>
          {/* <Link to="/" className="text-white text-xl font-bold ml-3">Sathya's Shopping</Link> */}

          <Link to={userType === 'admin' ? "/admin" : "/"} className="text-white text-xl font-bold ml-3">
            Sathya's Shopping
          </Link>
        </Box>

        <button onClick={toggleSideNav} className="text-white md:hidden">
          <FaBars size={24} />
        </button>

        {/* Desktop View */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-white flex items-center relative font-bold">
                <span className="text-xl">{username ? `Hello, ${capitalizeFirstLetter(username)} ${emoji}` : 'Loading...'}</span>
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

              {userType !== 'admin' && ( // Corrected condition
                <>
                  <Link to="/carts" className="text-white mr-7">
                    <img src={Cart} alt="Cart" style={{ width: "25px", height: "25px" }} />
                    {cartCount > 0 && (
                      <span className="absolute top-3 right-12 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  <Link to="/order-details" className="text-white mr-5">
                    <HistoryIcon style={{ fontSize: 30, color: 'white' }} />
                  </Link>
                </>
              )}
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

        {/* Side Navigation for Mobile View */}
        <div className={`fixed top-0 left-0 w-64 bg-purple-950 text-white h-full z-50 transform ${isSideNavOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
          <button onClick={closeSideNav} className="text-white absolute top-4 right-4">
            <FaTimes size={24} />
          </button>

          <div className="mt-16 flex flex-col space-y-4 px-6">
            {isAuthenticated ? (
              <>
                <span className="text-white flex items-center relative font-bold">
                  <span className="text-xl mr-2">{username ? `Hello, ${capitalizeFirstLetter(username)} ${emoji}` : 'Loading...'}</span>
                  <FaUserCircle 
                    onClick={handleUserIconClick} 
                    className="text-white cursor-pointer" 
                    size={24} 
                  />
                </span>

                {userType !== 'admin' && ( // Corrected condition
                  <>
                    <Link to="/carts" className="text-white mr-7" onClick={closeSideNav}>
                      <div className='flex flex-row gap-1 mt-8'>
                        <img src={Cart} alt="Cart" style={{ width: "25px", height: "25px" }} />
                        {cartCount > 0 && (
                          <span className="absolute top-32 left-10 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                            {cartCount}
                          </span>
                        )}
                        <p className='ml-2'>Shopping Cart</p>
                      </div>
                    </Link>

                    <Link to="/order-details" className="text-white mr-5" onClick={closeSideNav}>
                      <div className='flex flex-row gap-1'>
                        <HistoryIcon style={{ fontSize: 30, color: 'white' }} />
                        <p>Order History</p>
                      </div>
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/signup" className="text-white font-bold" onClick={closeSideNav}>Sign Up</Link>
                <Link to="/login" className="text-white font-bold" onClick={closeSideNav}>Login</Link>
                <Link to="/carts" className="text-white mr-5" onClick={closeSideNav}>
                  <img src={Cart} alt="Cart" style={{ width: "25px", height: "25px" }} />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

