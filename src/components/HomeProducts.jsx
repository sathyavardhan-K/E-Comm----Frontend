import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeProducts = ({ products }) => {
  const [priceRange, setPriceRange] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Handle product click
  const handleProductClick = (productId) => {
    navigate(`/productpage/${productId}`);
  };

  // Filter products based on price range
  const filteredProducts = products.filter((product) => {
    if (priceRange === 'below500') return product.price < 500;
    if (priceRange === '500to2000') return product.price >= 500 && product.price <= 2000;
    if (priceRange === 'above2000') return product.price > 2000 && product.price < 3000;
    if (priceRange === 'above3000') return product.price >= 3000 && product.price < 10000;
    if (priceRange === 'above10000') return product.price >= 10000;
    return true; // Show all products if no filter is selected
  });

  // Get the display text for the selected price range
  const getFilterText = () => {
    switch (priceRange) {
      case 'below500':
        return 'Below ₹500';
      case '500to2000':
        return '₹500 - ₹2000';
      case 'above2000':
        return 'Above ₹2000';
      case 'above3000':
        return 'Above ₹3000';
      case 'above10000':
        return 'Above ₹10000';
      default:
        return 'All';
    }
  };

  return (
    <div className="relative p-6 bg-gray-50 rounded-lg shadow-md m-5">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Products</h3>
      
      {/* Filter Dropdown */}
      <div className="absolute top-5 right-5 z-10">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 hover:ring-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Filter by price: {getFilterText()}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M6.293 9.293a1 1 0 011.414 0L10 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="p-1">
              <button
                onClick={() => { setPriceRange('all'); setIsDropdownOpen(false); }}
                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                  priceRange === 'all' ? 'bg-gray-100' : ''
                }`}
              >
                All
              </button>
              <button
                onClick={() => { setPriceRange('below500'); setIsDropdownOpen(false); }}
                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                  priceRange === 'below500' ? 'bg-gray-100' : ''
                }`}
              >
                Below ₹500
              </button>
              <button
                onClick={() => { setPriceRange('500to2000'); setIsDropdownOpen(false); }}
                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                  priceRange === '500to2000' ? 'bg-gray-100' : ''
                }`}
              >
                ₹500 - ₹2000
              </button>
              <button
                onClick={() => { setPriceRange('above2000'); setIsDropdownOpen(false); }}
                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                  priceRange === 'above2000' ? 'bg-gray-100' : ''
                }`}
              >
                Above ₹2000
              </button>
              <button
                onClick={() => { setPriceRange('above3000'); setIsDropdownOpen(false); }}
                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                  priceRange === 'above3000' ? 'bg-gray-100' : ''
                }`}
              >
                Above ₹3000
              </button>
              <button
                onClick={() => { setPriceRange('above10000'); setIsDropdownOpen(false); }}
                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                  priceRange === 'above10000' ? 'bg-gray-100' : ''
                }`}
              >
                Above ₹10000
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Display Filtered Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl"
            >
              <img
                src={product.productImg}
                alt={product.productName}
                className="w-full h-56 object-cover cursor-pointer"
                onClick={() => handleProductClick(product._id)}
              />
              <div className="p-4 flex flex-col justify-between h-64">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 truncate">{product.productName}</h2>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <p className="text-xl font-bold text-gray-900">₹{product.price.toFixed(2)}</p>
                <button
                  onClick={() => handleProductClick(product._id)}
                  className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No products match the search criteria.</p>
        )}
      </div>
    </div>
  );
};

export default HomeProducts;
