import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Tienda from './components/Tienda';
import AdminPanel from './components/AdminPanel'; 
import ProductoDetalle from './components/ProductoDetalle';
import Auth from './components/Auth';
import Cart from './components/Cart';

function App() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    
    // ESTADOS DEL CARRITO
    const [carrito, setCarrito] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);

    const fetchProductos = () => {
        fetch('http://localhost/GlobosMisiones/Backend/models/Producto.php')
            .then(res => res.json())
            .then(data => setProductos(data))
            .catch(err => console.error(err));
    };

    const fetchCategorias = () => {
        fetch('http://localhost/GlobosMisiones/Backend/models/ObtenerCategorias.php')
            .then(res => res.json())
            .then(data => setCategorias(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchProductos();
        fetchCategorias();
    }, []);

    const agregarAlCarrito = (producto) => {
        setCarrito((prev) => {
            const existe = prev.find(item => item.id === producto.id);
            if (existe) {
                return prev.map(item => 
                    item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            }
            return [...prev, { ...producto, cantidad: 1 }];
        });
        setCartOpen(true); // Abre el carrito automáticamente al añadir
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = "/";
    };

    return (
        <Router>
            <div className="min-h-screen bg-pink-50 flex flex-col">
                <header className="bg-pink-600 p-6 text-white shadow-lg relative">
                    <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
                        <Link to="/" className="flex items-center gap-4 group">
                            <img src="/logo.png" alt="Logo" className="h-20 w-auto transition-transform group-hover:scale-105" />
                            <div className="flex flex-col">
                                <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">GLOBOS MISIONES</h1>
                                <p className="font-bold text-pink-100 uppercase tracking-widest text-[10px]">Tienda Oficial - Posadas, Misiones</p>
                            </div>
                        </Link>
                    </div>

                    <div className="absolute top-4 right-4 flex gap-3 items-center">
                        {/* ICONO DEL CARRITO */}
                        <button 
                            onClick={() => setCartOpen(true)}
                            className="relative bg-white text-pink-600 p-2 rounded-full shadow-md hover:scale-110 transition-transform text-xl"
                        >
                            🛒
                            {carrito.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-pink-800 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                                    {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
                                </span>
                            )}
                        </button>

                        {user ? (
                            <div className="flex flex-col items-end">
                                <span className="bg-white text-pink-600 px-3 py-1 rounded-full text-[10px] font-black italic shadow-sm">
                                    HOLA, {user.nombre.toUpperCase()}
                                </span>
                                <div className="flex gap-2 mt-1">
                                    {user.rol === 'admin' && (
                                        <Link to="/admin" className="text-[9px] bg-yellow-400 px-2 py-1 rounded-lg text-black font-black uppercase shadow-sm">Admin</Link>
                                    )}
                                    <button onClick={handleLogout} className="text-[9px] bg-red-500 hover:bg-red-600 px-2 py-1 rounded-lg font-bold uppercase transition-colors">Salir</button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="text-[10px] bg-pink-700 px-4 py-2 rounded-full border border-pink-400 font-bold uppercase hover:bg-pink-800 transition-all">Iniciar Sesión</Link>
                        )}
                    </div>
                </header>

                <div className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Tienda productos={productos} categorias={categorias} agregarAlCarrito={agregarAlCarrito} />} />
                        <Route path="/admin" element={<AdminPanel onProductAdded={fetchProductos} />} />
                        <Route path="/producto/:id" element={<ProductoDetalle productos={productos} agregarAlCarrito={agregarAlCarrito} />} />
                        <Route path="/login" element={<Auth setUser={setUser} />} />
                    </Routes>
                </div>

                {/* --- FOOTER RESTAURADO CON TUS DATOS --- */}
                <footer className="bg-gray-900 text-white p-12 mt-10">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
                        <div>
                            <h4 className="text-pink-500 font-black mb-4 uppercase italic tracking-wider">Globos Misiones</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">Expertos en decoración con globos para todo tipo de eventos. Llevamos color y alegría a tus momentos más especiales en toda la provincia.</p>
                        </div>
                        <div>
                            <h4 className="text-pink-500 font-black mb-4 uppercase italic tracking-wider">Contacto Directo</h4>
                            <p className="text-gray-400 text-sm mb-1">📍 Posadas, Misiones, Argentina</p>
                            <p className="text-gray-400 text-sm mb-1">📞 WhatsApp: +54 376-4900821</p>
                            <p className="text-gray-400 text-sm">✉️ ventas@globosmisiones.com</p>
                        </div>
                        <div>
                            <h4 className="text-pink-500 font-black mb-4 uppercase italic tracking-wider">Horarios</h4>
                            <p className="text-gray-400 text-sm">Lunes a Sábados: 08:30 a 12:30 y 16:30 a 20:30</p>
                            <p className="text-gray-400 text-sm mt-2 font-bold italic text-pink-200">¡Pedidos por WhatsApp las 24hs!</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-10 pt-8 text-center">
                        <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em]">© 2026 Globos Misiones - Hecho con ❤️ en la Tierra Colorada.</p>
                    </div>
                </footer>

                {/* COMPONENTE CARRITO LATERAL */}
                <Cart 
                    carrito={carrito} 
                    setCarrito={setCarrito} 
                    isOpen={cartOpen} 
                    setIsOpen={setCartOpen} 
                />
            </div>
        </Router>
    );
}

export default App;