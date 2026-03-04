import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainCarousel from './MainCarousel';
import QuienesSomos from './QuienesSomos';

const Tienda = ({ productos, categorias, agregarAlCarrito }) => {
    const [filtro, setFiltro] = useState('todas');

    const productosFiltrados = filtro === 'todas' 
        ? productos 
        : productos.filter(p => p.categoria_id == filtro);

    return (
        <>
            <section className="mt-6">
                <MainCarousel />
            </section>

            <QuienesSomos />
            
            <main className="p-10 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-3xl font-black text-gray-800 border-l-8 border-pink-500 pl-4 uppercase italic">
                        Nuestro Catálogo
                    </h2>
                    
                    <select 
                        onChange={(e) => setFiltro(e.target.value)}
                        className="p-3 rounded-xl border-2 border-pink-200 outline-none focus:border-pink-500 text-gray-600 font-bold bg-white shadow-sm cursor-pointer"
                    >
                        <option value="todas">🎈 Todas las categorías</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {productosFiltrados.map((item) => (
                        <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-pink-100 flex flex-col h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <Link to={`/producto/${item.id}`} className="h-64 overflow-hidden bg-gray-100 relative block group">
                                <img 
                                    src={item.imagen_url} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    alt={item.titulo}
                                />
                            </Link>
                            <div className="p-6 flex-grow flex flex-col">
                                <h3 className="text-2xl font-black text-gray-800 leading-tight uppercase italic">{item.titulo}</h3>
                                <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-100">
                                    <span className="text-2xl font-black text-pink-600">${parseFloat(item.precio).toLocaleString('es-AR')}</span>
                                    <button 
                                        onClick={() => agregarAlCarrito(item)}
                                        className="bg-pink-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-pink-700 shadow-md active:scale-95 transition-all"
                                    >
                                        Añadir
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
};

export default Tienda;