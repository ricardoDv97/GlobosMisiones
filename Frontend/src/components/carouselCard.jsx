import React from 'react';

const CarouselCard = ({ img, title }) => {
  return (
    <div className="w-full h-[350px] md:h-[450px] bg-white rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white relative group">
      <img 
        src={img} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
      {title && (
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/50 to-transparent p-6">
          <p className="text-white font-black italic uppercase tracking-tighter text-lg">{title}</p>
        </div>
      )}
    </div>
  );
};

export default CarouselCard;