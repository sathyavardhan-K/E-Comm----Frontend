import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';


const CardList = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/category');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Function to handle the search input
  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-10 w-full flex flex-col justify-center items-center">
      {/* Search Input */}
      <div className="mb-5 w-4/5">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInput}
          placeholder="Search by category name..."
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Cards */}
      <div className="w-full p-6 bg-opacity-70 bg-white rounded-lg shadow-lg ml-5 mr-5 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <Card
              key={category._id}
              title={category.categoryName}
              imageUrl={category.categoryImage}
              categoryId={category._id} // Pass the categoryId to the Card component
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardList;
