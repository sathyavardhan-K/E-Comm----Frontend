import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userOrders, setUserOrders] = useState({});

  useEffect(() => {
    // Retrieve token, userId, and userOrders from local storage
    const token = localStorage.getItem('authToken');
    const storedUserId = localStorage.getItem('userId');
    const storedOrders = JSON.parse(localStorage.getItem('userOrders')) || {};

    console.log('Retrieved authToken from localStorage:', token);
    console.log('Retrieved userId from localStorage:', storedUserId);
    console.log('Retrieved userOrders from localStorage:', storedOrders);

    if (token && storedUserId) {
      setIsAuthenticated(true);
      setAuthToken(token);
      setUserId(storedUserId);
      setUserOrders(storedOrders);
    } else {
      console.warn('Token or userId not found in local storage.');
      logout(); // Clear any invalid session
    }
  }, []);

   // Login function to save token and userId to localStorage
  const login = (token, id) => {
    if (typeof token !== 'string' || !token.trim()) {
      console.error('Invalid token');
      return;
    }

    console.log('Saving authToken and userId to localStorage:', token, id);

    // Store token and userId in localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', id);

    setAuthToken(token);
    setUserId(id);
    setIsAuthenticated(true);
  };

   // Logout function to clear storage and reset state
  const logout = () => {
    console.log('Clearing authToken, userId, and userOrders from localStorage');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userOrders'); // Clear cart from local storage

    setIsAuthenticated(false);
    setAuthToken(null);
    setUserId(null);
    setUserOrders({});
  };

  const addOrder = (userId, newProduct) => {
    setUserOrders((prevOrders) => {
      const userOrders = prevOrders[userId] || [];
      const productIndex = userOrders.findIndex((product) => product._id === newProduct._id);

      let updatedOrders;
      if (productIndex > -1) {
        // Update the quantity if the product already exists
        updatedOrders = [...userOrders];
        updatedOrders[productIndex] = {
          ...updatedOrders[productIndex],
          orderQuantity: updatedOrders[productIndex].orderQuantity + newProduct.orderQuantity,
        };
      } else {
        // Add the new product if it doesn't exist
        updatedOrders = [...userOrders, newProduct];
      }

      const newOrders = {
        ...prevOrders,
        [userId]: updatedOrders,
      };

      // Store updated orders in local storage
      localStorage.setItem('userOrders', JSON.stringify(newOrders));
      
      return newOrders;
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authToken, userId, login, logout, userOrders, addOrder }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
