import React, { useState } from 'react';
import { HiArrowCircleRight, HiArrowCircleLeft } from 'react-icons/hi';
import cardData from '../data/cardData';

const Card = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerPage = 6;

  const prevCard = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? cardData.length - cardsPerPage
        : prevIndex - cardsPerPage,
    );
  };

  const nextCard = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= cardData.length - cardsPerPage
        ? 0
        : prevIndex + cardsPerPage,
    );
  };

  const totalWidth = cardData.length * 176; // 44 w-44 * 4px (spacing included)

  return (
    <div className="card-carousel-container mx-auto w-full h-[500px] p-4 overflow-hidden relative">
      {/* Cards track */}
      <div className="relative w-full h-[300px]">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (176 + 24)}px)`, // 176px width + 24px spacing
            width: `${totalWidth}px`,
          }}
        >
          {cardData.map((card) => (
            <div
              key={card.id}
              className="flex-none w-44 h-[300px] bg-white shadow-lg rounded-lg overflow-hidden relative mr-6"
            >
              <img
                src={card.imageSrc}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevCard}
          className="nav-button prev-button absolute top-1/2 -left-4 transform -translate-y-1/2 text-4xl text-white hover:text-gray-300 transition z-10"
          aria-label="Previous cards"
        >
          <HiArrowCircleLeft />
        </button>

        <button
          onClick={nextCard}
          className="nav-button next-button absolute top-1/2 -right-4 transform -translate-y-1/2 text-4xl text-white hover:text-gray-300 transition z-10"
          aria-label="Next cards"
        >
          <HiArrowCircleRight />
        </button>
      </div>
    </div>
  );
};

export default Card;
