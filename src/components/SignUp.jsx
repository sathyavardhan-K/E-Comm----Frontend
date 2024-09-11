import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phno: '',
    shippingAddress: '',
    billingAddress: '',
    city: '',
    state: '',
    pincode: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Target", e.target);
    
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Create a new object excluding the confirmPassword field
    const { confirmPassword, ...userData } = formData;

    // Log the form data to inspect it
    console.log("Form Data to be sent:", userData);

    axios.post("http://localhost:3000/api/user", userData)
      .then(result => {
        console.log("Signup Success:", result);

        // After successful signup, create a cart for the user
        const userId = result.data._id; // Assuming the API response contains the user ID
        createCartForUser(userId);
        console.log(userId);
        

        navigate('/');
      })
      .catch(err => {
        console.error("Error during signup:", err.response ? err.response.data : err.message);
        alert("Failed to sign up. Please check the data and try again.");
      });
  };

  // Function to create a cart for the new user
  const createCartForUser = (userId) => {
    const cartData = {
      created_by: userId, // Associate the cart with the user
      products: [], // Initialize with no products
      payment: {
        deliveryCharges: 30, // Default delivery charge
        totalPrice: 0.00 // Default total price
      }
    };

    axios.post("http://localhost:3000/api/carts", cartData)
      .then(response => {
        console.log("Cart created successfully:", response.data);
      })
      .catch(error => {
        console.error("Error creating cart:", error.response ? error.response.data : error.message);
      });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg mt-10 mb-10">
      <h2 className="text-2xl font-bold mb-4 text-dark-violet">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Phone (+91)</label>
          <input
            type="text"
            name="phno"
            value={formData.phno}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Shipping Address</label>
          <textarea
            name="shippingAddress"
            value={formData.shippingAddress}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Billing Address</label>
          <textarea
            name="billingAddress"
            value={formData.billingAddress}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-dark-violet text-white py-2 rounded">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
