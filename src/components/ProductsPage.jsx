import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useAuth } from '../AuthContext';

const ProductsPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [userCartId, setUserCartId] = useState(null);
  const [message, setMessage] = useState('');
  const { addOrder, authToken, isAuthenticated, userId } = useAuth();
  const [expandedDesc, setExpandedDesc] = useState({}); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/products?category=${categoryId}`);
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setMessage('Unexpected data format received for products.');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setMessage('Error fetching products.');
      }
    };

    fetchProducts();
  }, [categoryId]);

  useEffect(() => {
    const fetchUserCartId = async () => {
      if (!isAuthenticated) return;

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

  const handleBuyNow = async (product) => {
    if (!isAuthenticated) {
      setMessage('Please log in to purchase.');
      navigate('/login');
      return;
    }

    if (!userCartId) {
      setMessage('Cart not found.');
      return;
    }

    try {
      const cartResponse = await axios.get(`http://localhost:3000/api/carts/${userCartId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      const cart = cartResponse.data;

      if (!Array.isArray(cart.products)) {
        setMessage('Error with cart data.');
        return;
      }

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
      console.error('Error updating cart:', error);
      setMessage('Error adding product to cart.');
    }
  };

  // Toggle description view
  const toggleDescription = (productId) => {
    setExpandedDesc((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // Navigate to ProductDetail page
  const handleProductClick = (productId) => {
    navigate(`/productpage/${productId}`);
  };

  return (
    <div className="p-6 mt-10 max-w-7xl mx-auto">
      {/* Message Display */}
      {message && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-md">
          {message}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {products.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No products available.</p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 flex flex-col"
            >
              {/* Product Image */}
              <img
                src={product.productImg}
                alt={product.productName}
                className="w-full h-56 object-cover cursor-pointer"
                onClick={() => handleProductClick(product._id)}
              />

              {/* Product Details */}
              <div className="p-4 flex flex-col justify-between flex-grow">
                {/* Product Name */}
                <h2 className="text-lg font-bold text-gray-800 mb-2 truncate">
                  {product.productName}
                </h2>

                {/* Product Description */}
                <div className="relative">
                  <p
                    className={`text-sm text-gray-600 mb-2 w-48 ${
                      expandedDesc[product._id]
                        ? 'max-h-full'
                        : 'max-h-12 overflow-hidden line-clamp-2'
                    }`}
                  >
                    {product.description}
                  </p>
                  <button
                    onClick={() => toggleDescription(product._id)}
                    className="absolute top-0 right-0 mt-1 mr-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {expandedDesc[product._id] ? (
                      <AiOutlineEyeInvisible size={20} />
                    ) : (
                      <AiOutlineEye size={20} />
                    )}
                  </button>
                </div>

                {/* Product Price and Stock Status */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{product.price.toFixed(2)}
                  </p>
                  <span
                    className={`text-sm font-medium ${
                      product.availableStockQuantity > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {product.availableStockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <div className="flex justify-center mt-auto">
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  
  );
};

export default ProductsPage;
