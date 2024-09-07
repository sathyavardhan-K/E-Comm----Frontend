import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';

const OrderPage = () => {
  const { userId } = useAuth();
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState({});
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [userCartId, setUserCartId] = useState(null);
  const [finalPrice, setFinalPrice] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      console.error('User ID is not available');
      return;
    }

    const fetchUserAddressAndCart = async () => {
      try {
        const addressResponse = await axios.get(`http://localhost:3000/api/user/${userId}`);
        setAddress(addressResponse.data);

        const cartId = await getCartIdByUserId(userId);
        if (cartId) {
          const cartDetailsResponse = await axios.get(`http://localhost:3000/api/carts/${cartId}`);
          setCart(cartDetailsResponse.data.products || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err.response ? err.response.data : err.message);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchUserAddressAndCart();
  }, [userId]);

  const getCartIdByUserId = async (userId) => {
    try {
      const response = await axios.get('http://localhost:3000/api/carts');
      const carts = response.data;
      const userCart = carts.find(cart => cart.created_by === userId);

      if (userCart) {
        const cartId = userCart._id;
        setUserCartId(cartId);
        return cartId;
      } else {
        throw new Error('No cart found for the given user ID.');
      }
    } catch (error) {
      console.error('Error fetching or filtering carts:', error);
      throw error;
    }
  };

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveAddress = async () => {
    try {
      await axios.put(`http://localhost:3000/api/user/${userId}`, address);
      setIsEditingAddress(false);
      setError(null);
    } catch (err) {
      console.error('Error updating address:', err);
      setError('Failed to update address. Please try again later.');
    }
  };

  const calculateTotalPrice = () => {
    const total = cart.reduce((acc, item) => {
      const itemPrice = parseFloat(item.itemPrice?.$numberDecimal || 0);
      const orderQuantity = parseFloat(item.orderQuantity || 0);
      return acc + itemPrice * orderQuantity;
    }, 0);
    setFinalPrice(total.toFixed(2));
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [cart]);

  const handleProceedToBuy = () => {
    console.log(`Total price to pay: ₹${finalPrice}`);
    navigate('/payment', { state: { cart, finalPrice, address } });
  };

  const handleQuantityChange = async (productId, change) => {
    const updatedCart = cart.map(item => {
      if (item.product_id === productId) {
        const newQuantity = item.orderQuantity + change;
        if (newQuantity < 1) return item; // Prevent quantity less than 1
        return { ...item, orderQuantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);

    try {
      if (!userCartId) {
        console.error("User cart ID is not defined.");
        return;
      }
      await axios.put(`http://localhost:3000/api/carts/${userCartId}`, { products: updatedCart });
    } catch (error) {
      console.error("Failed to update quantity:", error);
      setCart(cart); // Revert back to old cart in case of error
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const payload = {
        products: [{ product_id: productId, remove: true }]
      };

      const response = await axios.put(`http://localhost:3000/api/carts/${userCartId}`, payload);
      if (response.data && response.data.products) {
        setCart(response.data.products);
      } else {
        setCart(cart.filter(item => item.product_id !== productId));
      }
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item. Please try again later.');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto mb-5">
      <h1 className="text-3xl font-bold mb-6 text-center">My Cart</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Address Information */}
      <div className="mb-6 p-4 bg-gray-100 rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Address Information</h2>
        {isEditingAddress ? (
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={address.phno || ''}
              onChange={(e) => handleAddressChange('phno', e.target.value)}
              placeholder="Phone Number"
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              value={address.shippingAddress || ''}
              onChange={(e) => handleAddressChange('shippingAddress', e.target.value)}
              placeholder="Shipping Address"
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              value={address.billingAddress || ''}
              onChange={(e) => handleAddressChange('billingAddress', e.target.value)}
              placeholder="Billing Address"
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              value={address.city || ''}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              placeholder="City"
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              value={address.state || ''}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              placeholder="State"
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              value={address.pincode || ''}
              onChange={(e) => handleAddressChange('pincode', e.target.value)}
              placeholder="Pincode"
              className="border p-2 rounded w-full mb-2"
            />
            <div className="flex justify-end col-span-2">
              <button onClick={saveAddress} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                Save Address
              </button>
              <button onClick={() => setIsEditingAddress(false)} className="bg-red-500 text-white py-2 px-4 ml-2 rounded hover:bg-red-600">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h1 className='text-2xl'><strong>{address.username}</strong></h1>
            <p><strong>Phone:</strong> {address.phno || 'N/A'}</p>
            <p><strong>Shipping Address:</strong> {address.shippingAddress || 'N/A'}</p>
            <p><strong>Billing Address:</strong> {address.billingAddress || 'N/A'}</p>
            <p><strong>City:</strong> {address.city || 'N/A'}</p>
            <p><strong>State:</strong> {address.state || 'N/A'}</p>
            <p><strong>Pincode:</strong> {address.pincode || 'N/A'}</p>
            <button onClick={() => setIsEditingAddress(true)} className="bg-blue-500 text-white py-2 px-4 mt-2 rounded hover:bg-blue-600">
              Edit Address
            </button>
          </div>
        )}
      </div>

      {/* Cart Items Table */}
      {cart.length > 0 ? (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full bg-gray-200">
                <th className="py-3 px-4 text-left">Item Name</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Quantity</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.product_id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{item.productName}</td>
                  <td className="py-3 px-4">₹{item.itemPrice?.$numberDecimal || '0.00'}</td>
                  <td className="py-3 px-4 flex items-center">
                    <button
                      onClick={() => handleQuantityChange(item.product_id, -1)}
                      className="text-gray-600 hover:text-gray-800 px-2"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.orderQuantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.product_id, 1)}
                      className="text-gray-600 hover:text-gray-800 px-2"
                    >
                      +
                    </button>
                  </td>
                  <td className="py-3 px-4">₹{(parseFloat(item.itemPrice?.$numberDecimal || 0) * item.orderQuantity).toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleRemoveItem(item.product_id)} className="text-red-600 hover:text-red-800">
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-xl font-semibold">No items in the cart</p>
        </div>
      )}

      {/* Final Price and Checkout */}
      {cart.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Final Price: ₹{finalPrice}</h2>
          <button
            onClick={handleProceedToBuy}
            className="bg-green-500 text-white py-2 px-4 rounded shadow-lg hover:bg-green-700 transition duration-200"
          >
            Proceed to Buy
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderPage;