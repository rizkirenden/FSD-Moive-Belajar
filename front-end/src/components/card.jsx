import React, { useState, useEffect, useRef } from 'react';
import cardData from '../data/cardData';

const Card = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(5);
  const [cardWidth, setCardWidth] = useState(180);
  const [cardSpacing, setCardSpacing] = useState(20);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const [displayedCards, setDisplayedCards] = useState(10); // Start with 10 cards
  const carouselRef = useRef(null);
  const animationRef = useRef(null);

  // Filter the card data to only show the currently displayed cards
  const visibleCards = cardData.slice(0, displayedCards);

  // Handle responsive adjustments
  useEffect(() => {
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const screenWidth = window.innerWidth;

        if (screenWidth < 768) {
          // Mobile - show 3 cards
          setCardsPerPage(3);
          setCardWidth((screenWidth - 40) / 3);
          setCardSpacing(10);
        } else {
          // Desktop - show 5 cards
          setCardsPerPage(5);
          setCardWidth(180);
          setCardSpacing(20);
        }

        // Reset position on resize
        setCurrentIndex(0);
        setCurrentTranslate(0);
        setPrevTranslate(0);
      }, 100); // Debounce delay
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Animation for smooth sliding
  const animation = () => {
    setCarouselPosition(currentTranslate);
    if (isDragging) {
      animationRef.current = requestAnimationFrame(animation);
    }
  };

  // Set carousel position
  const setCarouselPosition = (position) => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(${position}px)`;
    }
  };

  // Touch/pointer start
  const touchStart = (clientX) => {
    setIsDragging(true);
    setStartPos(clientX);
    animationRef.current = requestAnimationFrame(animation);
  };

  // Touch/pointer move
  const touchMove = (clientX) => {
    if (isDragging) {
      const diff = clientX - startPos;
      let newTranslate = prevTranslate + diff;

      // Prevent going beyond the first or last card
      const maxTranslate =
        -(visibleCards.length - cardsPerPage) * (cardWidth + cardSpacing);
      newTranslate = Math.max(newTranslate, maxTranslate);
      newTranslate = Math.min(newTranslate, 0);

      setCurrentTranslate(newTranslate);
    }
  };

  // Touch/pointer end
  const touchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    cancelAnimationFrame(animationRef.current);

    const totalCardWidth = cardWidth + cardSpacing;
    const movedBy = currentTranslate - prevTranslate;

    let newIndex = currentIndex;

    if (Math.abs(movedBy) > cardWidth / 4) {
      if (movedBy < 0) {
        newIndex = Math.min(
          currentIndex + 1,
          visibleCards.length - cardsPerPage,
        );
      } else {
        newIndex = Math.max(currentIndex - 1, 0);
      }
    }

    const newTranslate = -newIndex * totalCardWidth;
    setCurrentIndex(newIndex);
    setCurrentTranslate(newTranslate);
    setPrevTranslate(newTranslate);
  };

  // Mouse/touch event handlers
  const handlePointerDown = (e) => {
    e.preventDefault();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    touchStart(clientX);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.type.includes('touch')
      ? e.touches[0]
        ? e.touches[0].clientX
        : e.changedTouches[0].clientX
      : e.clientX;
    touchMove(clientX);
  };

  const handlePointerUp = () => {
    touchEnd();
  };

  // Load more cards when reaching the end
  const checkAndLoadMoreCards = () => {
    const isAtEnd = currentIndex >= visibleCards.length - cardsPerPage - 1;
    if (isAtEnd && displayedCards < cardData.length) {
      // Load 10 more cards if available
      setDisplayedCards((prev) => Math.min(prev + 10, cardData.length));
    }
  };

  // Update translate position when index changes
  useEffect(() => {
    setCurrentTranslate(-currentIndex * (cardWidth + cardSpacing));
    setPrevTranslate(-currentIndex * (cardWidth + cardSpacing));

    // Check if we need to load more cards
    checkAndLoadMoreCards();
  }, [currentIndex, cardWidth, cardSpacing]);

  return (
    <div className="mx-auto w-full max-w-screen-2xl p-4 h-auto min-h-[300px]">
      <div
        className="relative overflow-hidden select-none"
        ref={carouselRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(${currentTranslate}px)`,
            gap: `${cardSpacing}px`,
            willChange: 'transform',
          }}
        >
          {visibleCards.map((card) => (
            <div
              key={card.id}
              className="flex-none bg-white shadow-lg rounded-lg overflow-hidden relative"
              style={{
                width: `${cardWidth}px`,
                height: `${cardWidth * 1.5}px`,
                minWidth: `${cardWidth}px`,
                userSelect: 'none',
              }}
            >
              <img
                src={card.imageSrc}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                loading="lazy"
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
