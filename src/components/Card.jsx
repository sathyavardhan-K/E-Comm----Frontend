import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Card = ({ title, description, imageUrl, categoryId }) => {
  // const { authToken } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = async () => {
    // if (!authToken) {
    //   console.error('No auth token available');
    //   return;
    // }

    try {
      // Navigate to the ProductsPage with the categoryId
      navigate(`/products/${categoryId}`);
    } catch (error) {
      console.error('Error navigating to products:', error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden p-5 transform transition-transform duration-300 hover:scale-105">
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-64 object-cover cursor-pointer"
          onClick={handleCardClick}
        />
        <button
          onClick={handleCardClick}
          className="absolute bottom-2 left-2 bg-black text-white px-4 py-1 rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          View Products
        </button>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p
          className="text-gray-700 text-sm mb-4"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </div>
  );
};

export default Card;
