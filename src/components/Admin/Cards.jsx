// src/components/Cards.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Cards() {
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [shippedCount, setShippedCount] = useState(0);
  const [deliveredCount, setDeliveredCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user count and order status counts from APIs
    const fetchCounts = async () => {
      try {
        const [usersResponse, ordersResponse] = await Promise.all([
          axios.get('https://e-comm-backend-dc49.onrender.com/api/user'), // Replace with your actual user API endpoint
          axios.get('https://e-comm-backend-dc49.onrender.com/api/orders'), // Replace with your actual orders API endpoint
        ]);

        // Set the user count
        setUserCount(usersResponse.data.length); // Assuming response.data is an array of users

        // Set the order count
        setOrderCount(ordersResponse.data.length); // Assuming response.data is an array of orders

        // Calculate status counts
        const statusCounts = ordersResponse.data.reduce(
          (counts, order) => {
            if (order.status === 'pending') counts.pending += 1;
            if (order.status === 'Shipped') counts.shipped += 1;
            if (order.status === 'Delivered') counts.delivered += 1;
            return counts;
          },
          { pending: 0, shipped: 0, delivered: 0 }
        );

        // Set the counts for each status
        setPendingCount(statusCounts.pending);
        setShippedCount(statusCounts.shipped);
        setDeliveredCount(statusCounts.delivered);
      } catch (err) {
        setError('Failed to fetch counts');
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="flex flex-wrap gap-4">
      {/* User Count Card */}
      <div className="p-4 bg-white shadow-md rounded-md w-full sm:w-1/3 md:w-1/4 lg:w-1/5">
        {loading ? (
          <p>Loading user count...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div>
            <h3 className="text-lg font-bold text-gray-700">Total Users</h3>
            <p className="text-2xl text-gray-900">{userCount}</p>
          </div>
        )}
      </div>

      {/* Order Count Card */}
      <div className="p-4 bg-white shadow-md rounded-md w-full sm:w-1/3 md:w-1/4 lg:w-1/5">
        {loading ? (
          <p>Loading order count...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div>
            <h3 className="text-lg font-bold text-gray-700">Total Orders</h3>
            <p className="text-2xl text-gray-900">{orderCount}</p>
          </div>
        )}
      </div>

      {/* Pending Orders Count Card */}
      <div className="p-4 bg-yellow-100 shadow-md rounded-md w-full sm:w-1/3 md:w-1/4 lg:w-1/5">
        {loading ? (
          <p>Loading pending orders...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div>
            <h3 className="text-lg font-bold text-yellow-700">Pending Orders</h3>
            <p className="text-2xl text-yellow-900">{pendingCount}</p>
          </div>
        )}
      </div>

      {/* Shipped Orders Count Card */}
      <div className="p-4 bg-blue-100 shadow-md rounded-md w-full sm:w-1/3 md:w-1/4 lg:w-1/5">
        {loading ? (
          <p>Loading shipped orders...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div>
            <h3 className="text-lg font-bold text-blue-700">Shipped Orders</h3>
            <p className="text-2xl text-blue-900">{shippedCount}</p>
          </div>
        )}
      </div>

      {/* Delivered Orders Count Card */}
      <div className="p-4 bg-green-100 shadow-md rounded-md w-full sm:w-1/3 md:w-1/4 lg:w-1/5">
        {loading ? (
          <p>Loading delivered orders...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div>
            <h3 className="text-lg font-bold text-green-700">Delivered Orders</h3>
            <p className="text-2xl text-green-900">{deliveredCount}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cards;
