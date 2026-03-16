import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Tienda from './components/Tienda';
import AdminPanel from './components/AdminPanel'; 
import ProductoDetalle from './components/ProductoDetalle';
import Auth from './components/Auth';
import Cart from './components/Cart';
import SuccessPage from './components/SuccessPage';
import FailurePage from './components/FailurePage';

const WhatsAppButton = () => (
    <a 
        href="https://wa.me/543764900821" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-all z-50 flex items-center justify-center"
        title="Consultanos por WhatsApp"
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
    </a>
);

function App() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    // Inicializamos el carrito desde localStorage si existe
    const [carrito, setCarrito] = useState(JSON.parse(localStorage.getItem('cart')) || []);
    const [cartOpen, setCartOpen] = useState(false);

    // Guardar en localStorage cada vez que el carrito cambie
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(carrito));
    }, [carrito]);

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
        setCartOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = "/";
    };

    return (
        <Router>
            <div className="min-h-screen bg-pink-50 flex flex-col relative">
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
                        <Route path="/pago-exitoso" element={<SuccessPage setCarrito={setCarrito} />} />
                        <Route path="/pago-fallido" element={<FailurePage />} />
                    </Routes>
                </div>

                <footer className="bg-gray-900 text-white p-12 mt-10">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
                        <div>
                            <h4 className="text-pink-500 font-black mb-4 uppercase italic tracking-wider">Globos Misiones</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">Expertos en decoración con globos para todo tipo de eventos.</p>
                        </div>
                        <div>
                            <h4 className="text-pink-500 font-black mb-4 uppercase italic tracking-wider">Contacto Directo</h4>
                            <p className="text-gray-400 text-sm mb-1">📍 Posadas, Misiones, Argentina</p>
                            <p className="text-gray-400 text-sm mb-1">📞 WhatsApp: +54 376-4900821</p>
                        </div>
                        <div>
                            <h4 className="text-pink-500 font-black mb-4 uppercase italic tracking-wider">Horarios</h4>
                            <p className="text-gray-400 text-sm">Lunes a Sábados: 08:30 a 12:30 y 16:30 a 20:30</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-10 pt-8 text-center">
                        <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em]">© 2026 Globos Misiones</p>
                    </div>
                </footer>

                <Cart 
                    carrito={carrito} 
                    setCarrito={setCarrito} 
                    isOpen={cartOpen} 
                    setIsOpen={setCartOpen} 
                    user={user}
                />

                <WhatsAppButton />
            </div>
        </Router>
    );
}

export default App;