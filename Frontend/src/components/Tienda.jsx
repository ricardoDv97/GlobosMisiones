import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Tienda = ({ productos = [], categorias = [], agregarAlCarrito }) => {
    const [filtro, setFiltro] = useState('todas');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (productos.length > 0 || categorias.length > 0) {
            setCargando(false);
        }
    }, [productos, categorias]);

    const productosFiltrados = filtro === 'todas' 
        ? productos 
        : productos.filter(p => Number(p.categoria_id) === Number(filtro));

    if (cargando) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
            </div>
        );
    }

    return (
        <div className="pb-20 animate-fade-in">
            {/* 1. ELIMINAMOS EL CARRUSEL DE AQUÍ (Ya está en App.jsx) */}

            {/* Categorías Destacadas */}
            <section className="py-16 max-w-7xl mx-auto px-6">
                <h2 className="text-2xl font-extrabold text-center text-slate-800 mb-12 uppercase tracking-[0.2em]">
                    Categorías Destacadas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {categorias.slice(0, 3).map((cat, idx) => (
                        <motion.div 
                            key={cat.id}
                            whileHover={{ y: -10 }}
                            className="group cursor-pointer text-center"
                            onClick={() => setFiltro(cat.id.toString())}
                        >
                            <div className="h-72 rounded-[3.5rem] overflow-hidden mb-6 border-4 border-white shadow-sm group-hover:shadow-2xl transition-all duration-500">
                                <img 
                                    src={`/assets/cat-${idx+1}.jpg`} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    alt={cat.nombre}
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/300x400?text=Globo'} 
                                />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 tracking-tight">{cat.nombre}</h3>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Catálogo */}
            <main className="max-w-7xl mx-auto px-6 pt-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-gray-100 pb-6">
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight uppercase">Catálogo</h2>
                    <select 
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="bg-white border-2 border-gray-100 rounded-2xl px-6 py-3 font-bold text-gray-500 focus:border-pink-400 outline-none transition-all shadow-sm cursor-pointer"
                    >
                        <option value="todas">Todos los globos</option>
                        {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                    </select>
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    <AnimatePresence mode='popLayout'>
                        {productosFiltrados.map((item) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={item.id} 
                                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl border border-gray-50 transition-all group"
                            >
                                <Link to={`/producto/${item.id}`} className="block h-72 overflow-hidden relative bg-gray-50">
                                    <img 
                                        src={item.imagen_url} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                        alt={item.titulo} 
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/400x400?text=Globo+Misiones'}
                                    />
                                </Link>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 line-clamp-1 uppercase tracking-tight">{item.titulo}</h3>
                                    <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                                        <span className="text-xl font-extrabold text-pink-600">${parseFloat(item.precio).toLocaleString('es-AR')}</span>
                                        <button 
                                            onClick={() => agregarAlCarrito(item)}
                                            className="bg-slate-800 hover:bg-pink-600 text-white px-5 py-2.5 rounded-full font-bold text-xs transition-colors shadow-md active:scale-90"
                                        >
                                            Añadir
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
};

export default Tienda;