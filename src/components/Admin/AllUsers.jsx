import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

function AllUsers() {
  const { authToken } = useAuth(); // Get auth token from context
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user', {
          headers: {
            'Authorization': `Bearer ${authToken}` // Use token from context
          }
        });
        setUsers(response.data);
      } catch (err) {
        setError('Error fetching users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [authToken]); // Dependency array includes authToken

  const updateUserType = async (userId, newUserType) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/user/${userId}`,
        { userType: newUserType }, // Payload being sent
        {
          headers: {
            'Authorization': `Bearer ${authToken}`, // Ensure token is valid
            'Content-Type': 'application/json',    // Ensure content type is correct
          }
        }
      );

      // Update local state with the new user type
      const updatedUsers = users.map(user =>
        user._id === userId ? { ...user, userType: newUserType } : user
      );
      setUsers(updatedUsers);

      setUpdateMessage('User type updated successfully');
      console.log('User type updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating user type:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      setError('Failed to update user type');
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">All Users</h2>
      {updateMessage && <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded">{updateMessage}</div>}
      <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phno}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    aria-label={`Update type for user ${user.username}`}
                    value={user.userType}
                    onChange={(e) => updateUserType(user._id, e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-28 p-2.5"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllUsers;
