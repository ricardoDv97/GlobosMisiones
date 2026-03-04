import React, { useState, useEffect } from 'react';

const AdminPanel = ({ onProductAdded }) => {
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]); // Estado para la lista de productos
    const [nuevaCat, setNuevaCat] = useState(''); 
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        precio: '',
        imagen_url: '',
        stock: 0,
        categoria_id: ''
    });
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    const [cargando, setCargando] = useState(false);

    // 1. Cargar Categorías
    const fetchCategorias = () => {
        fetch('http://localhost/GlobosMisiones/Backend/models/ObtenerCategorias.php')
            .then(res => res.json())
            .then(data => setCategorias(data))
            .catch(err => console.error("Error cargando categorías:", err));
    };

    // 2. Cargar Productos para la tabla de gestión
    const cargarProductos = async () => {
        try {
            const res = await fetch('http://localhost/GlobosMisiones/Backend/models/Producto.php');
            const data = await res.json();
            setProductos(data);
        } catch (err) {
            console.error("Error cargando productos:", err);
        }
    };

    useEffect(() => {
        fetchCategorias();
        cargarProductos();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // FUNCIÓN PARA INSERTAR CATEGORÍA NUEVA
    const handleAddCategoria = async (e) => {
        e.preventDefault();
        if (!nuevaCat.trim()) return;

        try {
            const response = await fetch('http://localhost/GlobosMisiones/Backend/models/GuardarCategoria.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: nuevaCat })
            });
            const result = await response.json();
            if (result.success) {
                setNuevaCat('');
                fetchCategorias(); 
                setMensaje({ texto: 'Categoría añadida con éxito', tipo: 'success' });
            }
        } catch (error) {
            setMensaje({ texto: 'Error al añadir categoría', tipo: 'error' });
        }
    };

    // FUNCIÓN PARA INSERTAR PRODUCTO NUEVO
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ texto: 'Procesando envío...', tipo: 'info' });
        setCargando(true);

        try {
            const response = await fetch('http://localhost/GlobosMisiones/Backend/models/GuardarProducto.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (result.success) {
                setMensaje({ texto: '¡Globo publicado con éxito! 🎈', tipo: 'success' });
                setFormData({ titulo: '', descripcion: '', precio: '', imagen_url: '', stock: 0, categoria_id: '' });
                cargarProductos(); // Refresca la tabla local
                if (onProductAdded) onProductAdded(); // Refresca la tienda global
            } else {
                setMensaje({ texto: 'Error: ' + result.message, tipo: 'error' });
            }
        } catch (error) {
            setMensaje({ texto: 'Error de red', tipo: 'error' });
        } finally {
            setCargando(false);
        }
    };

    // FUNCIÓN PARA ELIMINAR PRODUCTO
    const eliminarProducto = async (id) => {
        if (window.confirm("¿Estás seguro de que quieres borrar este producto?")) {
            try {
                const res = await fetch('http://localhost/GlobosMisiones/Backend/models/EliminarProducto.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                });
                const data = await res.json();
                if (data.success) {
                    cargarProductos(); 
                    if (onProductAdded) onProductAdded();
                    setMensaje({ texto: 'Producto eliminado', tipo: 'success' });
                }
            } catch (error) {
                setMensaje({ texto: 'Error al eliminar', tipo: 'error' });
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-2xl border-4 border-pink-100">
            <h2 className="text-3xl font-black text-pink-600 text-center mb-8 uppercase italic">Panel Admin - Globos Misiones</h2>

            {/* SECCIÓN: AGREGAR CATEGORÍA */}
            <div className="mb-10 p-4 bg-pink-50 rounded-2xl border border-pink-200">
                <label className="block text-xs font-bold text-pink-400 mb-2 uppercase ml-2">Nueva Categoría</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={nuevaCat} 
                        onChange={(e) => setNuevaCat(e.target.value)}
                        placeholder="Ej: Globos de Helio"
                        className="flex-grow p-3 rounded-xl border-2 border-transparent focus:border-pink-300 outline-none"
                    />
                    <button 
                        onClick={handleAddCategoria}
                        className="bg-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-600 transition-all text-sm"
                    >
                        Añadir
                    </button>
                </div>
            </div>

            <hr className="mb-8 border-pink-100" />
            
            {/* ALERTAS DE MENSAJE */}
            {mensaje.texto && (
                <div className={`mb-6 p-4 rounded-xl text-center font-bold ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-700' : mensaje.tipo === 'info' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                    {mensaje.texto}
                </div>
            )}

            {/* FORMULARIO DE PRODUCTO */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Título del Producto" className="md:col-span-2 p-4 bg-pink-50 rounded-2xl outline-none focus:ring-2 ring-pink-200" required />
                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción" className="md:col-span-2 p-4 bg-pink-50 rounded-2xl h-24 outline-none focus:ring-2 ring-pink-200" />
                <input name="precio" type="number" value={formData.precio} onChange={handleChange} placeholder="Precio" className="p-4 bg-pink-50 rounded-2xl outline-none focus:ring-2 ring-pink-200" required />

                <select 
                    name="categoria_id" 
                    value={formData.categoria_id} 
                    onChange={handleChange} 
                    className="p-4 bg-pink-50 rounded-2xl border-2 border-transparent focus:border-pink-400 outline-none"
                    required
                >
                    <option value="">Seleccionar Categoría</option>
                    {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                </select>

                <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Stock" className="p-4 bg-pink-50 rounded-2xl outline-none focus:ring-2 ring-pink-200" />
                <input name="imagen_url" value={formData.imagen_url} onChange={handleChange} placeholder="URL Imagen (/productos/...)" className="p-4 bg-pink-50 rounded-2xl outline-none focus:ring-2 ring-pink-200" />

                <button type="submit" disabled={cargando} className="md:col-span-2 bg-pink-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest hover:bg-pink-700 shadow-lg active:scale-95 transition-all">
                    {cargando ? 'Guardando...' : 'Confirmar y Publicar'}
                </button>
            </form>

            {/* TABLA DE GESTIÓN DE PRODUCTOS */}
            <div className="mt-16">
                <h3 className="text-xl font-bold mb-4 text-gray-700 uppercase italic border-b-2 border-pink-500 inline-block">Gestionar Productos Existentes</h3>
                <div className="bg-white rounded-2xl shadow-inner border border-gray-100 overflow-hidden mt-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-800 text-white text-xs uppercase">
                                    <th className="p-4">Imagen</th>
                                    <th className="p-4">Título</th>
                                    <th className="p-4">Precio</th>
                                    <th className="p-4 text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map(prod => (
                                    <tr key={prod.id} className="border-b border-gray-50 hover:bg-pink-50 transition-colors">
                                        <td className="p-4">
                                            <img src={prod.imagen_url} className="w-12 h-12 object-cover rounded-lg shadow-sm" alt="" onError={(e) => e.target.src='https://via.placeholder.com/50'} />
                                        </td>
                                        <td className="p-4 font-bold text-gray-700 text-sm">{prod.titulo}</td>
                                        <td className="p-4 text-pink-600 font-black text-sm">${parseFloat(prod.precio).toLocaleString('es-AR')}</td>
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => eliminarProducto(prod.id)}
                                                className="bg-red-500 text-white px-4 py-1 rounded-full text-[10px] font-bold hover:bg-red-700 transition-all shadow-md uppercase"
                                            >
                                                Borrar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {productos.length === 0 && (
                                    <tr><td colSpan="4" className="p-10 text-center text-gray-400 italic">No hay productos cargados aún.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;