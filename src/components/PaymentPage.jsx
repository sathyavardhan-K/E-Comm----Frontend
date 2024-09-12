import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { FaCashRegister, FaGooglePay } from 'react-icons/fa';

// Modal component with payment handling inside the modal
const PaymentMethodModal = ({ isOpen, onClose, onPlaceOrder }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isPaid, setIsPaid] = useState(false);

  const handlePaymentMethodSelection = (method) => {
    setSelectedPaymentMethod(method);
    setIsPaid(true); // Simulate successful payment
  };

  const handlePlaceOrder = () => {
    if (isPaid) {
      onPlaceOrder(selectedPaymentMethod);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 md:p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">Select Payment Method</h2>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handlePaymentMethodSelection('Cash on Delivery')}
            className="flex items-center justify-center bg-orange-500 text-white py-2 px-3 md:py-3 md:px-4 rounded hover:bg-orange-600 transition duration-300 text-sm md:text-base"
          >
            <FaCashRegister className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
            Cash on Delivery
          </button>
          <button
            onClick={() => handlePaymentMethodSelection('Gpay')}
            className="flex items-center justify-center bg-indigo-500 text-white py-2 px-3 md:py-3 md:px-4 rounded hover:bg-indigo-600 transition duration-300 text-sm md:text-base"
          >
            <FaGooglePay className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
            Gpay
          </button>
        </div>

        {isPaid && (
          <p className="mt-4 text-green-600 font-semibold">Paid Successfully</p>
        )}

        {isPaid && (
          <button
            onClick={handlePlaceOrder}
            className="mt-4 bg-blue-500 text-white py-2 px-4 md:py-3 md:px-6 rounded hover:bg-blue-600 transition duration-300 mr-5"
          >
            Place Order
          </button>
        )}

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white py-2 px-4 md:py-3 md:px-6 rounded hover:bg-red-600 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState('');
  const [error, setError] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Extract cart and final price passed from OrderPage
  const { cart, finalPrice } = location.state || { cart: [], finalPrice: 0 };

  const deliveryChargePerProduct = 30;

  const calculateTotalDeliveryCharge = () => {
    const uniqueProductCount = cart.length;
    return uniqueProductCount * deliveryChargePerProduct;
  };

  const formatCurrency = (amount) => {
    const numAmount = Number(amount);
    if (isNaN(numAmount)) {
      console.warn('Invalid amount:', amount);
      return '₹0.00';
    }
    return `₹${numAmount.toFixed(2)}`;
  };

  const getCartIdByUserId = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/carts');
      const carts = response.data;
      const userCart = carts.find((cart) => cart.created_by === userId);

      if (userCart) {
        setCartId(userCart._id);
        console.log('Cart ID:', userCart._id);
      } else {
        console.error('No cart found for the given user ID.');
      }
    } catch (error) {
      console.error('Error fetching or filtering carts:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      getCartIdByUserId();
    }
  }, [userId]);

  const handlePayment = async (paymentMethod) => {
    if (!cartId) {
      setError('Cart ID is missing.');
      return;
    }

    try {
      const totalDeliveryCharge = calculateTotalDeliveryCharge();
      const totalAmount = Number(finalPrice) + totalDeliveryCharge;

      const cartUpdateDetails = {
        payment: {
          deliveryCharges: totalDeliveryCharge,
          totalPrice: totalAmount,
          method: paymentMethod,
        },
      };

      const updateResponse = await axios.put(
        `http://localhost:3000/api/carts/${cartId}`,
        cartUpdateDetails
      );
      console.log('Cart updated response:', updateResponse.data);

      //Get Product Details

      const productDetails = await axios.get(`http://localhost:3000/api/carts/${cartId}`);
      console.log("Details",productDetails.data.payment);
      

       // Prepare order details
      const orderDetails = {
        user_id: userId,
        cart_id: cartId,
        products: productDetails.data.products,
        payment: productDetails.data.payment,
        paymentStatus: 'paid',
        status: 'pending',
      };
      console.log('Order details:', orderDetails);

      // Send POST request to create the order
      const response = await axios.post('http://localhost:3000/api/orders', orderDetails);
      console.log("Order Resp", response.data);
      
      const { _id } = response.data; // Extract the order ID from the response

      // Navigate to OrderTrackPage with the order ID
      navigate('/order-success', { state: { _id } });

      setPaymentStatus('Payment Successful');

    } catch (err) {
      console.error('Error processing payment:', err);
      setError('Failed to process payment. Please try again.');
      setPaymentStatus('Payment Failed');
    }
  };

  const totalDeliveryCharge = calculateTotalDeliveryCharge();
  const totalAmount = Number(finalPrice) + totalDeliveryCharge;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Payment Details</h1>

      <div className="bg-white shadow-lg rounded-lg mb-6 p-4">
        <h2 className="text-2xl font-semibold mb-4">Cart Items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-100 divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">S.No</th>
                <th className="px-4 py-2 text-left">Product Name</th>
                <th className="px-4 py-2 text-right">Price</th>
                <th className="px-4 py-2 text-right">Quantity</th>
                <th className="px-4 py-2 text-right">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => {
                const itemPrice = parseFloat(item.itemPrice.$numberDecimal) || 0;
                const orderQuantity = parseFloat(item.orderQuantity) || 0;
                const totalPrice = (itemPrice * orderQuantity).toFixed(2);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{item.productName || 'N/A'}</td>
                    <td className="px-4 py-2 text-right">₹{itemPrice.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">{orderQuantity}</td>
                    <td className="px-4 py-2 text-right">₹{totalPrice}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Payment Summary</h2>
        <p className="text-lg mb-2">Total Price: {formatCurrency(finalPrice)}</p>
        <p className="text-lg mb-2">Delivery Charge: {formatCurrency(totalDeliveryCharge)}</p>
        <p className="text-lg font-bold">Total Amount: {formatCurrency(totalAmount)}</p>
      </div>

      <div className="text-center">
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transition duration-300"
        >
          Pay {formatCurrency(totalAmount)}
        </button>
      </div>

      {paymentStatus && (
        <p
          className={`mt-4 text-lg font-semibold ${
            paymentStatus === 'Payment Successful' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {paymentStatus}
        </p>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <PaymentMethodModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onPlaceOrder={handlePayment}
      />
    </div>
  );
};

export default PaymentPage;
