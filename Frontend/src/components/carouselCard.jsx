const CarouselCard = ({ img, title }) => {
  return (
    <div className="w-full h-full bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
      <img 
        src={img} 
        alt={title} 
        className="w-full h-full object-cover" // Esto evita que la foto se estire
      />
      {title && (
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 p-4">
          <p className="text-white font-bold text-center">{title}</p>
        </div>
      )}
    </div>
  );
};

export default CarouselCard;