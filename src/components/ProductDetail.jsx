import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useAuth } from '../AuthContext';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');
  const [userCartId, setUserCartId] = useState(null);
  const [expandedDesc, setExpandedDesc] = useState(false);
  const { addOrder, authToken, isAuthenticated, userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error.response?.data || error.message);
        setMessage('Error fetching product details.');
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchUserCartId = async () => {
      if (!isAuthenticated || !userId) return;

      try {
        const response = await axios.get('http://localhost:3000/api/carts', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const carts = response.data;
        const userCart = carts.find(cart => cart.created_by === userId);

        if (userCart) {
          setUserCartId(userCart._id);
        } else {
          setMessage('Cart not found.');
        }
      } catch (error) {
        console.error('Error fetching carts:', error);
        setMessage('Error fetching user cart.');
      }
    };

    fetchUserCartId();
  }, [authToken, isAuthenticated, userId]);

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      setMessage('Please log in to purchase.');
      navigate('/login');
      return;
    }

    if (!product || !userCartId) return;

    try {
      const cartResponse = await axios.get(`http://localhost:3000/api/carts/${userCartId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      const cart = cartResponse.data;
      const existingProduct = cart.products.find(p => p.product_id === product._id);

      if (existingProduct) {
        setMessage('Product already in the cart.');
        return;
      }

      const newProductData = {
        product_id: product._id,
        productName: product.productName,
        orderQuantity: 1,
        itemPrice: product.price
      };

      const updatedCartData = {
        products: [newProductData]
      };

      const updateResponse = await axios.put(
        `http://localhost:3000/api/carts/${userCartId}`,
        updatedCartData,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (updateResponse.status === 200 || updateResponse.status === 204) {
        setMessage('Product added to cart successfully!');
        addOrder(authToken, product);
        navigate('/carts');
      } else {
        setMessage('Failed to add product to cart.');
      }
    } catch (error) {
      console.error('Error updating cart:', error.response?.data || error.message);
      setMessage('Error adding product to cart.');
    }
  };

  
  return (
    <div className="p-6 mt-10 max-w-6xl mx-auto mb-10">
      {message && (
        <div className="bg-red-100 text-red-800 p-4 mb-6 rounded-lg shadow-sm border border-red-200">
          {message}
        </div>
      )}

      {product ? (
        <div className="flex bg-gray-100 shadow-sm rounded-lg overflow-hidden">
          <img
            src={product.productImg}
            alt={product.productName}
            className="w-1/3 h-full object-cover"
          />
          <div className="p-6 flex-1">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              {product.productName}
            </h2>
            <div className="relative">
              <p
                className={`text-base text-gray-700 mb-4 ${
                  expandedDesc ? 'max-h-full' : 'max-h-24 overflow-hidden'
                }`}
              >
                {product.description}
              </p>
              
            </div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-2xl font-bold text-gray-900">
                ₹{product.price.toFixed(2)}
              </p>
              <span
                className={`text-lg font-medium ${
                  product.availableStockQuantity > 0 ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {product.availableStockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleBuyNow}
                className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">Loading product details...</p>
      )}
    </div>
  );
};

export default ProductDetail;
