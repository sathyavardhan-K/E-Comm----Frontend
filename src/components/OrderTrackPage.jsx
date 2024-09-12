import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Step, StepLabel, Stepper, Button, Box, Skeleton, Alert } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Adjust the import path as needed

const OrderTrackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { _id } = location.state || {};
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authToken, userId } = useAuth();

  useEffect(() => {
    if (_id) {
      fetchOrderStatus();
    } else {
      setError('Order ID is missing');
      setLoading(false);
    }
  }, [_id]);

  const fetchOrderStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://e-comm-backend-dc49.onrender.com/api/orders/${_id}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      setOrderStatus(response.data.status);
      setError(null);

      // Clear the cart after fetching the order status
      if (response.data.status === 'pending') { // Example condition to clear the cart
        await clearCart();
      }

    } catch (error) {
      console.error('Error fetching order status:', error);
      setError('Error fetching status');
      setOrderStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      // Fetch the cart associated with the user
      const cartResponse = await axios.get('https://e-comm-backend-dc49.onrender.com/api/carts', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      const userCart = cartResponse.data.find(cart => cart.created_by === userId);
      console.log("Fetched Cart:", userCart);
      
      if (userCart) {
        // Verify the current structure of products
        console.log("Current products in cart:", userCart.products);
  
        const clearCartDetails = {
          products: [], // Attempting to clear products
          payment: {} // Attempting to clear payment details
        };
  
        console.log("Clearing Cart with ID:", userCart._id, "with details:", clearCartDetails);
        
        // Update the cart to clear products and payment
        const response = await axios.put(`https://e-comm-backend-dc49.onrender.com/api/carts/clearCart/${userCart._id}`, clearCartDetails, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
  
        // Log the response from the server
        console.log('Cart cleared successfully:', response.data);
  
        // Check if the products array is empty after clearing
        const updatedCartResponse = await axios.get(`https://e-comm-backend-dc49.onrender.com/api/carts/${userCart._id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
  
        console.log("Updated cart after clearing:", updatedCartResponse.data);
      } else {
        console.error('No cart found for the given user ID.');
      }
    } catch (error) {
      console.error('Error clearing cart:', error.response ? error.response.data : error.message);
    }
  };
  

  const steps = ['pending', 'shipped', 'delivered'];

  const getActiveStepIndex = () => {
    if (steps.includes(orderStatus)) {
      return steps.indexOf(orderStatus);
    }
    return 0; // Default to 'Pending'
  };

  const handleViewDetails = () => {
    navigate(`/order-details`);
  };

  return (
    <Container 
      component="main" 
      maxWidth="sm" 
      sx={{ 
        mt: 10,
        mb: { xs: 5, sm: 0 } // Add mb: 5 for mobile (xs) and 0 for larger screens
      }}
    >
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 2 }}>
          Order Tracking
        </Typography>
        {loading ? (
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="rectangular" width="100%" height={50} />
            <Skeleton variant="text" width="60%" sx={{ mt: 2 }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : (
          <>
            <Stepper 
              activeStep={getActiveStepIndex()} 
              alternativeLabel 
              sx={{ mt: 2 }}
            >
              {steps.map((step) => (
                <Step key={step}>
                  <StepLabel>{step}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Current Status: {orderStatus || 'No status available'}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 1 }}
                onClick={fetchOrderStatus}
              >
                Refresh Status
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 1, ml: 1 }}
                onClick={handleViewDetails}
              >
                View Order Details
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default OrderTrackPage;
