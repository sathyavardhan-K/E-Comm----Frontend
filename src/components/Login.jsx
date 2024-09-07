// src/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Adjust the path based on your project structure

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3000/api/user/login", formData);
      console.log("Login Success:", response);

      const { token, _id, userType } = response.data;
      console.log('Full response data:', response.data);

      // Check if userType is defined
      if (token && _id) {
        login(token, _id); // Pass the token and user ID to the login function

        // Determine destination path based on userType
        const destination = userType && userType === 'admin' ? '/admin' : '/';
        console.log('Navigating to:', destination); // Debugging line

        navigate(destination);
      } else {
        console.error('No token or user ID returned from login');
        setError("Failed to login. Please try again.");
      }
    } catch (err) {
      console.error("Error during login:", err.response ? err.response.data : err.message);
      setError("Failed to login. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg mt-20">
      <h2 className="text-2xl font-bold mb-4 text-dark-violet">Login</h2>
      <form onSubmit={handleSubmit}>
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
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button type="submit" className={`w-full py-2 rounded ${loading ? 'bg-gray-500' : 'bg-dark-violet text-white'}`} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
