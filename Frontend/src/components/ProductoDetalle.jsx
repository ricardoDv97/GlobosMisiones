import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const ProductoDetalle = ({ productos, agregarAlCarrito }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Buscamos el producto por ID
    const producto = productos.find(p => p.id == id);

    if (!producto) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-400">Cargando producto...</h2>
                <Link to="/" className="text-pink-500 underline mt-4 inline-block">Volver a la tienda</Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-20">
            <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-pink-600 font-bold hover:translate-x-[-5px] transition-transform">
                ⬅ Volver al catálogo
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-pink-50">
                {/* Imagen */}
                <div className="h-[400px] md:h-[600px] bg-gray-50">
                    <img 
                        src={producto.imagen_url} 
                        alt={producto.titulo} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=Globo+Misiones'; }}
                    />
                </div>

                {/* Info */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <span className="text-pink-500 font-black uppercase tracking-widest text-sm mb-2">Producto Exclusivo</span>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-800 uppercase italic leading-tight mb-4">
                        {producto.titulo}
                    </h1>
                    
                    <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                        {producto.descripcion || "Hermoso set de globos ideal para decorar tus eventos más especiales en Posadas. Calidad premium garantizada."}
                    </p>

                    <div className="bg-pink-50 p-6 rounded-3xl mb-8 flex items-center justify-between">
                        <div>
                            <span className="block text-gray-400 text-xs font-bold uppercase mb-1">Precio Unitario</span>
                            <span className="text-4xl font-black text-pink-600">
                                ${parseFloat(producto.precio).toLocaleString('es-AR')}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="block text-gray-400 text-xs font-bold uppercase mb-1">Disponibilidad</span>
                            <span className="text-green-500 font-bold">¡En Stock! ✅</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => agregarAlCarrito(producto)}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-black py-5 rounded-2xl text-xl shadow-xl hover:shadow-pink-200 transition-all active:scale-95 uppercase italic"
                    >
                        Añadir al Carrito 🛒
                    </button>
                    
                    <p className="text-center text-gray-400 text-xs mt-6 font-bold uppercase">
                        🚚 Envíos a todo Misiones
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductoDetalle;