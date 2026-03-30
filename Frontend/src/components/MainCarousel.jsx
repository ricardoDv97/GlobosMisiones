import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import CarouselCard from './carouselCard'; // Importamos tu tarjeta
import 'swiper/css';
import 'swiper/css/pagination';

// Importamos las imágenes (Vite requiere esto si están en assets)
import banner1 from '../assets/carousel/banner-01.jpg';
import banner2 from '../assets/carousel/banner-02.jpg';
import banner3 from '../assets/carousel/banner-03.jpg';

const MainCarousel = () => {
  const slides = [
    { id: 1, bg: 'bg-[#FFF5E6]', title: 'GLOBOS PARA CELEBRAR', subtitle: 'MOMENTOS ESPECIALES', img: banner1 },
    { id: 2, bg: 'bg-[#D6EAF8]', title: 'DECORACIÓN ÚNICA', subtitle: 'PARA TUS EVENTOS', img: banner2 },
    { id: 3, bg: 'bg-[#FADBD8]', title: 'REGALOS MÁGICOS', subtitle: 'SORPRENDE HOY', img: banner3 },
  ];

  return (
    <div className="py-10 bg-white overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        breakpoints={{
          1024: { slidesPerView: 1.2, spaceBetween: 50 }
        }}
        className="max-w-7xl mx-auto !overflow-visible"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className={`${slide.bg} rounded-[4rem] min-h-[500px] flex flex-col md:flex-row items-center px-10 md:px-16 relative overflow-hidden shadow-inner`}>
              
              {/* Lado Izquierdo: Texto */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="md:w-1/2 text-center md:text-left z-10 py-12"
              >
                <h2 className="text-4xl md:text-6xl font-black text-slate-800 leading-none mb-4 tracking-tighter uppercase italic">
                  {slide.title} <br/> 
                  <span className="text-globo-pink">{slide.subtitle}</span>
                </h2>
                <p className="text-slate-500 text-lg mb-8 font-bold italic opacity-80">
                  Diseños exclusivos que transforman tus festejos en recuerdos inolvidables.
                </p>
                <button className="bg-slate-800 hover:bg-globo-pink text-white px-10 py-4 rounded-full font-black italic text-sm tracking-widest shadow-xl transition-all transform hover:-translate-y-1">
                  VER CATÁLOGO
                </button>
              </motion.div>

              {/* Lado Derecho: La Tarjeta que creamos */}
              <div className="md:w-1/2 w-full pb-12 md:pb-0 flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  className="w-full max-w-[400px]"
                >
                  <CarouselCard img={slide.img} title="" />
                </motion.div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MainCarousel;