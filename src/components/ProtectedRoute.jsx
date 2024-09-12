// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Adjust the path according to your project structure

const ProtectedRoute = () => {
  const { authToken, userId, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data to determine if the user is an admin
    const checkAdminStatus = async () => {
      try {
        const response = await axios.get(`https://e-comm-backend-dc49.onrender.com/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the auth token in the request headers
          },
        });

        const userType = response.data.userType; // Assuming the user type is returned in response.data.userType
        console.log(userType);
        

        if (userType === 'admin') {
            console.log("Admin Page");
            
          setIsAdmin(true);
        } else {
          navigate('/'); // Not an admin, redirect to home page
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        logout(); // Log out on error
        navigate('/'); // Redirect to home page on error
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    if (authToken && userId) {
      checkAdminStatus();
    } else {
      navigate('/'); // Redirect to home if not authenticated
      setIsLoading(false);
    }
  }, [authToken, userId, logout, navigate]);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading state while checking admin status
  }

  return isAdmin ? <Outlet /> : <Navigate to="/" />; // Render child routes if the user is admin
};

export default ProtectedRoute;
