import React, { useState } from 'react';
import CarouselCard from './CarouselCard';

// Importa tus fotos verticales
import banner1 from '../assets/carousel/banner-01.jpg';
import banner2 from '../assets/carousel/banner-02.jpg';
import banner3 from '../assets/carousel/banner-03.jpg';

const Carousel = () => {
  // Datos locales con tus imágenes
  const cards = [
    { img: banner1, title: "Pop Ballon" },
    { img: banner2, title: "Decoraciones" },
    { img: banner3, title: "Pop Ballon" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? cards.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === cards.length - 1 ? 0 : prevIndex + 1));
  };

  const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
  const nextIndex = (currentIndex + 1) % cards.length;

  return (
    <div className="relative w-full max-w-5xl mx-auto py-12 px-4">
      {/* Contenedor principal con altura suficiente para fotos verticales */}
      <div className="relative flex items-center justify-center h-[500px] md:h-[600px]">
        
        {/* Tarjeta Anterior (Izquierda) */}
        <div className="absolute left-[15%] md:left-[25%] w-[220px] md:w-[300px] h-[380px] md:h-[480px] z-10 transform -translate-x-1/2 scale-85 opacity-60 transition-all duration-500 blur-[1px]">
            <CarouselCard {...cards[prevIndex]} />
        </div>

        {/* Tarjeta Central (Frente) */}
        <div className="absolute z-30 w-[280px] md:w-[350px] h-[450px] md:h-[550px] transform scale-100 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 ease-in-out">
          <CarouselCard {...cards[currentIndex]} />
        </div>

        {/* Tarjeta Siguiente (Derecha) */}
        <div className="absolute right-[15%] md:right-[25%] w-[220px] md:w-[300px] h-[380px] md:h-[480px] z-10 transform translate-x-1/2 scale-85 opacity-60 transition-all duration-500 blur-[1px]">
            <CarouselCard {...cards[nextIndex]} />
        </div>

        {/* Botones de Navegación */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 md:left-10 z-40 bg-white/80 hover:bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-pink-600 text-2xl font-bold transition-all hover:scale-110"
        >
          &#10094;
        </button>

        <button
          onClick={goToNext}
          className="absolute right-2 md:right-10 z-40 bg-white/80 hover:bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-pink-600 text-2xl font-bold transition-all hover:scale-110"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default Carousel;