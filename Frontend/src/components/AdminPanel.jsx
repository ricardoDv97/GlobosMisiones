import React, { useState, useEffect } from 'react';

const AdminPanel = ({ onProductAdded }) => {
    const [tab, setTab] = useState('productos'); // 'productos' o 'ventas'
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [ventas, setVentas] = useState([]); // Nuevo estado para ventas
    const [nuevaCat, setNuevaCat] = useState(''); 
    const [formData, setFormData] = useState({
        titulo: '', descripcion: '', precio: '', imagen_url: '', stock: 0, categoria_id: ''
    });
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    const [cargando, setCargando] = useState(false);

    // Cargar Datos
    const fetchCategorias = () => {
        fetch('http://localhost/GlobosMisiones/Backend/models/ObtenerCategorias.php')
            .then(res => res.json())
            .then(data => setCategorias(data))
            .catch(err => console.error("Error:", err));
    };

    const cargarProductos = async () => {
        try {
            const res = await fetch('http://localhost/GlobosMisiones/Backend/models/Producto.php');
            const data = await res.json();
            setProductos(data);
        } catch (err) { console.error("Error:", err); }
    };

    const fetchVentas = async () => {
        try {
            // Este es el archivo PHP que definimos anteriormente
            const res = await fetch('http://localhost/GlobosMisiones/Backend/models/ObtenerVentas.php');
            const data = await res.json();
            setVentas(data);
        } catch (err) { console.error("Error cargando ventas:", err); }
    };

    useEffect(() => {
        fetchCategorias();
        cargarProductos();
        fetchVentas();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
                setMensaje({ texto: 'Categoría añadida', tipo: 'success' });
            }
        } catch (error) { setMensaje({ texto: 'Error', tipo: 'error' }); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ texto: 'Procesando...', tipo: 'info' });
        setCargando(true);
        try {
            const response = await fetch('http://localhost/GlobosMisiones/Backend/models/GuardarProducto.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (result.success) {
                setMensaje({ texto: '¡Globo publicado! 🎈', tipo: 'success' });
                setFormData({ titulo: '', descripcion: '', precio: '', imagen_url: '', stock: 0, categoria_id: '' });
                cargarProductos();
                if (onProductAdded) onProductAdded();
            }
        } catch (error) { setMensaje({ texto: 'Error de red', tipo: 'error' }); }
        finally { setCargando(false); }
    };

    const eliminarProducto = async (id) => {
        if (window.confirm("¿Borrar este producto?")) {
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
                    setMensaje({ texto: 'Eliminado', tipo: 'success' });
                }
            } catch (error) { setMensaje({ texto: 'Error', tipo: 'error' }); }
        }
    };

    return (
        <div className="max-w-6xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-2xl border-4 border-pink-100">
            <h2 className="text-3xl font-black text-pink-600 text-center mb-8 uppercase italic">Panel Admin - Globos Misiones</h2>
            
            {/* SELECTOR DE PESTAÑAS */}
            <div className="flex justify-center gap-4 mb-10">
                <button 
                    onClick={() => setTab('productos')}
                    className={`px-6 py-2 rounded-full font-bold uppercase tracking-tighter transition-all ${tab === 'productos' ? 'bg-pink-600 text-white' : 'bg-pink-100 text-pink-600'}`}
                >
                    Inventario
                </button>
                <button 
                    onClick={() => setTab('ventas')}
                    className={`px-6 py-2 rounded-full font-bold uppercase tracking-tighter transition-all ${tab === 'ventas' ? 'bg-pink-600 text-white' : 'bg-pink-100 text-pink-600'}`}
                >
                    Pedidos Recibidos
                </button>
            </div>

            {tab === 'productos' ? (
                <>
                    {/* SECCIÓN: AGREGAR CATEGORÍA */}
                    <div className="mb-10 p-4 bg-pink-50 rounded-2xl border border-pink-200">
                        <label className="block text-xs font-bold text-pink-400 mb-2 uppercase ml-2">Nueva Categoría</label>
                        <div className="flex gap-2">
                            <input type="text" value={nuevaCat} onChange={(e) => setNuevaCat(e.target.value)} placeholder="Ej: Globos de Helio" className="flex-grow p-3 rounded-xl border-2 border-transparent focus:border-pink-300 outline-none" />
                            <button onClick={handleAddCategoria} className="bg-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-600 transition-all text-sm">Añadir</button>
                        </div>
                    </div>

                    <hr className="mb-8 border-pink-100" />
                    
                    {mensaje.texto && (
                        <div className={`mb-6 p-4 rounded-xl text-center font-bold ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {mensaje.texto}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Título" className="md:col-span-2 p-4 bg-pink-50 rounded-2xl outline-none" required />
                        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción" className="md:col-span-2 p-4 bg-pink-50 rounded-2xl h-24 outline-none" />
                        <input name="precio" type="number" value={formData.precio} onChange={handleChange} placeholder="Precio" className="p-4 bg-pink-50 rounded-2xl outline-none" required />
                        <select name="categoria_id" value={formData.categoria_id} onChange={handleChange} className="p-4 bg-pink-50 rounded-2xl outline-none" required>
                            <option value="">Categoría</option>
                            {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                        </select>
                        <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Stock" className="p-4 bg-pink-50 rounded-2xl outline-none" />
                        <input name="imagen_url" value={formData.imagen_url} onChange={handleChange} placeholder="URL Imagen" className="p-4 bg-pink-50 rounded-2xl outline-none" />
                        <button type="submit" disabled={cargando} className="md:col-span-2 bg-pink-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest hover:bg-pink-700 shadow-lg transition-all">
                            {cargando ? 'Guardando...' : 'Confirmar y Publicar'}
                        </button>
                    </form>

                    {/* TABLA DE PRODUCTOS */}
                    <div className="mt-16 overflow-x-auto">
                        <table className="w-full text-left border-collapse bg-white rounded-2xl overflow-hidden shadow-sm">
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
                                        <td className="p-4"><img src={prod.imagen_url} className="w-12 h-12 object-cover rounded-lg" alt="" /></td>
                                        <td className="p-4 font-bold text-gray-700 text-sm">{prod.titulo}</td>
                                        <td className="p-4 text-pink-600 font-black text-sm">${parseFloat(prod.precio).toLocaleString('es-AR')}</td>
                                        <td className="p-4 text-center">
                                            <button onClick={() => eliminarProducto(prod.id)} className="bg-red-500 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase">Borrar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                /* SECCIÓN: GESTIÓN DE VENTAS */
                <div className="mt-4 overflow-x-auto">
                    <h3 className="text-xl font-bold mb-6 text-gray-700 uppercase italic">Historial de Ventas</h3>
                    <table className="w-full text-left border-collapse bg-white rounded-2xl overflow-hidden shadow-md">
                        <thead>
                            <tr className="bg-pink-600 text-white text-xs uppercase">
                                <th className="p-4">Fecha</th>
                                <th className="p-4">Cliente</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Estado</th>
                                <th className="p-4">Referencia MP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.map(venta => (
                                <tr key={venta.id} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="p-4 text-sm text-gray-500">{new Date(venta.fecha).toLocaleDateString()}</td>
                                    <td className="p-4 font-bold text-gray-700">{venta.cliente_nombre}</td>
                                    <td className="p-4 font-black text-pink-600">${parseFloat(venta.total).toLocaleString('es-AR')}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${venta.estado_pago === 'aprobado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {venta.estado_pago}
                                        </span>
                                    </td>
                                    <td className="p-4 text-[10px] text-gray-400 font-mono">{venta.mp_preference_id}</td>
                                </tr>
                            ))}
                            {ventas.length === 0 && (
                                <tr><td colSpan="5" className="p-10 text-center text-gray-400 italic">No se han registrado ventas todavía.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;