import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const ProductoDetalle = ({ productos, agregarAlCarrito }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const producto = productos.find(p => p.id == id);

    if (!producto) {
        return (
            <div className="text-center py-40 animate-pulse">
                <h2 className="text-4xl font-black text-pink-200 uppercase italic">Buscando tu globo...</h2>
                <Link to="/" className="text-pink-500 font-black uppercase tracking-widest mt-8 inline-block hover:scale-110 transition-transform">← Volver a la tienda</Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-20 animate-fade-in">
            <button 
                onClick={() => navigate(-1)} 
                className="mb-8 flex items-center gap-3 text-pink-600 font-black uppercase text-xs tracking-widest hover:translate-x-[-8px] transition-all bg-pink-50 px-6 py-3 rounded-full shadow-sm"
            >
                ← Volver al catálogo
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white rounded-[4rem] overflow-hidden shadow-[0_30px_60px_rgba(255,182,193,0.3)] border-8 border-pink-50">
                {/* Imagen con zoom sutil */}
                <div className="h-[450px] md:h-[700px] overflow-hidden group">
                    <img 
                        src={producto.imagen_url} 
                        alt={producto.titulo} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=Globo+Misiones'; }}
                    />
                </div>

                {/* Info con estilo Premium */}
                <div className="p-10 md:p-16 flex flex-col justify-center bg-white relative">
                    <div className="absolute top-10 right-10 text-6xl opacity-10 pointer-events-none">🎈</div>
                    
                    <span className="text-pink-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 bg-pink-50 w-fit px-4 py-1 rounded-full">
                        Edición Especial
                    </span>
                    
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 uppercase italic leading-[0.9] mb-6 tracking-tighter">
                        {producto.titulo}
                    </h1>
                    
                    <p className="text-gray-500 text-lg mb-10 leading-relaxed font-medium">
                        {producto.descripcion || "Hermoso set de globos ideal para decorar tus eventos más especiales en Posadas. Calidad premium garantizada para momentos inolvidables."}
                    </p>

                    <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-[2.5rem] mb-10 flex items-center justify-between border-2 border-pink-100 shadow-inner">
                        <div>
                            <span className="block text-pink-400 text-[10px] font-black uppercase tracking-widest mb-1">Precio Online</span>
                            <span className="text-5xl font-black text-pink-600 tracking-tighter italic">
                                ${parseFloat(producto.precio).toLocaleString('es-AR')}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Estado</span>
                            <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full font-black text-[10px] uppercase">¡Disponible!</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => agregarAlCarrito(producto)}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-black py-6 rounded-3xl text-xl shadow-[0_15px_30px_rgba(219,39,119,0.3)] hover:shadow-pink-300 transition-all active:scale-95 uppercase italic tracking-widest flex items-center justify-center gap-4"
                    >
                        Añadir al Carrito <span>🛒</span>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-4 mt-10">
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase text-gray-400 tracking-tighter">
                            <span className="text-lg">🚚</span> Envíos a todo Misiones
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase text-gray-400 tracking-tighter">
                            <span className="text-lg">💳</span> Todos los medios de pago
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductoDetalle;