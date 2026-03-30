import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AdminPanel = ({ productos, categorias, setProductos, setCategorias }) => {
    const [tab, setTab] = useState('productos');
    const [nuevoProducto, setNuevoProducto] = useState({
        titulo: '', descripcion: '', precio: '', stock: '', categoria_id: '', imagen_url: ''
    });
    const [nuevaCategoria, setNuevaCategoria] = useState('');
    const [cargando, setCargando] = useState(false);

    // Manejo de subida de imagen al servidor
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            setCargando(true);
            const res = await fetch('http://localhost/Backend/models/UploadImage.php', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setNuevoProducto({ ...nuevoProducto, imagen_url: data.url });
            } else {
                alert("Error al subir imagen: " + data.message);
            }
        } catch (error) {
            console.error("Error upload:", error);
        } finally {
            setCargando(false);
        }
    };

    const guardarProducto = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost/Backend/models/GuardarProducto.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoProducto)
            });
            const data = await res.json();
            if (data.success) {
                alert("¡Producto creado! 🎈");
                window.location.reload(); // Recarga simple para ver cambios
            }
        } catch (error) {
            alert("Error al conectar con el servidor");
        }
    };

    const guardarCategoria = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost/Backend/models/GuardarCategoria.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: nuevaCategoria })
            });
            const data = await res.json();
            if (data.success) {
                setNuevaCategoria('');
                alert("Categoría guardada");
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-pink-50/30 pb-20 pt-10 px-6">
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-black text-slate-800 italic uppercase tracking-tighter">
                        Panel <span className="text-pink-600">Admin</span>
                    </h1>
                    <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-pink-100">
                        <button onClick={() => setTab('productos')} className={`px-6 py-2 rounded-xl font-bold transition-all ${tab === 'productos' ? 'bg-pink-600 text-white' : 'text-slate-400'}`}>Productos</button>
                        <button onClick={() => setTab('categorias')} className={`px-6 py-2 rounded-xl font-bold transition-all ${tab === 'categorias' ? 'bg-pink-600 text-white' : 'text-slate-400'}`}>Categorías</button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Formulario Lateral */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-[3rem] shadow-xl border-8 border-white">
                            <h2 className="text-xl font-black uppercase mb-6 text-slate-700">Añadir {tab === 'productos' ? 'Producto' : 'Categoría'}</h2>
                            
                            {tab === 'productos' ? (
                                <form onSubmit={guardarProducto} className="space-y-4">
                                    <input type="text" placeholder="Título del producto" required className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-400 outline-none font-medium" onChange={e => setNuevoProducto({...nuevoProducto, titulo: e.target.value})} />
                                    
                                    <textarea placeholder="Descripción" className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-400 outline-none font-medium" onChange={e => setNuevoProducto({...nuevoProducto, descripcion: e.target.value})}></textarea>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" placeholder="Precio" required className="p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-400 outline-none font-medium" onChange={e => setNuevoProducto({...nuevoProducto, precio: e.target.value})} />
                                        <input type="number" placeholder="Stock" required className="p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-400 outline-none font-medium" onChange={e => setNuevoProducto({...nuevoProducto, stock: e.target.value})} />
                                    </div>

                                    <select required className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-400 outline-none font-medium" onChange={e => setNuevoProducto({...nuevoProducto, categoria_id: e.target.value})}>
                                        <option value="">Seleccionar Categoría</option>
                                        {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                    </select>

                                    <div className="relative group">
                                        <div className={`w-full h-32 border-2 border-dashed ${nuevoProducto.imagen_url ? 'border-green-400' : 'border-pink-200'} rounded-2xl flex flex-col items-center justify-center bg-pink-50/50 overflow-hidden`}>
                                            {nuevoProducto.imagen_url ? (
                                                <img src={nuevoProducto.imagen_url} className="w-full h-full object-cover" alt="Preview" />
                                            ) : (
                                                <span className="text-pink-400 text-xs font-bold uppercase tracking-widest text-center px-4">
                                                    {cargando ? "Subiendo..." : "Click para subir imagen"}
                                                </span>
                                            )}
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full bg-slate-800 hover:bg-pink-600 text-white font-black py-4 rounded-2xl shadow-lg transition-all transform active:scale-95 uppercase tracking-widest text-xs">Guardar Globo</button>
                                </form>
                            ) : (
                                <form onSubmit={guardarCategoria} className="space-y-4">
                                    <input type="text" placeholder="Nombre de categoría" required className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-400 outline-none font-medium" value={nuevaCategoria} onChange={e => setNuevaCategoria(e.target.value)} />
                                    <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all uppercase tracking-widest text-xs">Crear Categoría</button>
                                </form>
                            )}
                        </div>
                    </motion.div>

                    {/* Listado Principal */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 min-h-[500px]">
                            <h2 className="text-xl font-black uppercase mb-8 text-slate-700">Listado Activo</h2>
                            <div className="space-y-4">
                                {tab === 'productos' ? (
                                    productos.map(p => (
                                        <div key={p.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl border border-white shadow-sm">
                                            <img src={p.imagen_url} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                                            <div className="flex-1">
                                                <p className="font-black text-slate-800 uppercase text-sm tracking-tight">{p.titulo}</p>
                                                <p className="text-pink-600 font-bold text-xs">${parseFloat(p.precio).toLocaleString()}</p>
                                            </div>
                                            <button className="p-3 text-red-400 hover:text-red-600 transition-colors">🗑️</button>
                                        </div>
                                    ))
                                ) : (
                                    categorias.map(c => (
                                        <div key={c.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-white shadow-sm">
                                            <p className="font-bold text-slate-700 uppercase text-sm">{c.nombre}</p>
                                            <button className="text-xs font-black text-red-400 uppercase tracking-widest">Eliminar</button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;