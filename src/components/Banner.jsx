import React from 'react';
import Book from '../images/book.jpg';
import Quest from '../images/quest.jpg';
import Toy from '../images/toy.jpg';

const Banner = () => {
  const [slideIndex, setSlideIndex] = React.useState(0);
  const slides = [Book, Quest, Toy];

  const moveSlide = (step) => {
    setSlideIndex((prevIndex) => (prevIndex + step + slides.length) % slides.length);
  };

  React.useEffect(() => {
    const interval = setInterval(() => moveSlide(1), 3000);
    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  return (
    <div className="relative w-full h-64 overflow-hidden z-0 md:h-52 lg:h-52 hidden md:block"> {/* Hide on mobile */}
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${slideIndex * 100}%)` }}
      >
        {slides.map((src, index) => (
          <div key={index} className="flex-shrink-0 w-full h-full">
            <img src={src} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <button
        onClick={() => moveSlide(-1)}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-20 md:p-4 md:left-6"
        aria-label="Previous slide"
      >
        &#10094;
      </button>
      <button
        onClick={() => moveSlide(1)}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-20 md:p-4 md:right-6"
        aria-label="Next slide"
      >
        &#10095;
      </button>
    </div>
  );
};

export default Banner;
