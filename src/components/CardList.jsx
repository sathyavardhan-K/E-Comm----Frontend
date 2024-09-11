import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';
import HomeProducts from './HomeProducts'; // Import the HomeProducts component

const CardList = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [slideIndex, setSlideIndex] = useState(0);

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responses = await Promise.all(
          categories.map((category) =>
            axios.get(`http://localhost:3000/api/products?category=${category._id}`)
          )
        );
        const allProducts = responses.flatMap(response => response.data);
        setProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [categories]);

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter categories based on the search query
  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter products based on the search query
  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cardsToShow = 3;

  const moveSlide = (step) => {
    const totalSlides = Math.ceil(filteredCategories.length / cardsToShow);
    setSlideIndex((prevIndex) => (prevIndex + step + totalSlides) % totalSlides);
  };

  return (
    <div className="mt-10 w-full flex flex-col justify-center items-center">
      {/* Search Input with SVG Icon */}
      <div className="relative mb-5 w-4/5">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInput}
          placeholder="Search products"
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      </div>
    
      {/* Slider with Cards */}
     
      <h3 className="text-2xl font-bold mb-3 mt-3 text-gray-800 flex flex-col items-start">Categories</h3>
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${slideIndex * 100}%)` }}
        >
          {/* Group cards into sets of 3 for sliding */}
          {Array.from({ length: Math.ceil(filteredCategories.length / cardsToShow) }, (_, slide) => (
            <div key={slide} className="flex min-w-full">
              {filteredCategories.slice(slide * cardsToShow, slide * cardsToShow + cardsToShow).map((category) => (
                <div className="w-1/3 px-4 py-6" key={category._id}>
                  <Card
                    title={category.categoryName}
                    imageUrl={category.categoryImage}
                    categoryId={category._id}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={() => moveSlide(-1)}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-indigo-500 text-white p-3 rounded-full shadow-lg hover:bg-indigo-600 transition duration-200 z-20"
          aria-label="Previous slide"
        >
          &#10094;
        </button>
        <button
          onClick={() => moveSlide(1)}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-indigo-500 text-white p-3 rounded-full shadow-lg hover:bg-indigo-600 transition duration-200 z-20"
          aria-label="Next slide"
        >
          &#10095;
        </button>
      </div>

      {/* Display Filtered Products */}
      <div className="mt-10 w-full">
        <HomeProducts products={filteredProducts} />
      </div>
    </div>
  );
};

export default CardList;
