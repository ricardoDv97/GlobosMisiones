import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, ChevronDown } from 'lucide-react';
import Tienda from './components/Tienda';
import AdminPanel from './components/AdminPanel'; 
import ProductoDetalle from './components/ProductoDetalle';
import Auth from './components/Auth';
import Cart from './components/Cart';
import SuccessPage from './components/SuccessPage';
import FailurePage from './components/FailurePage';
import Footer from './components/Footer';
import QuienesSomos from './components/QuienesSomos';
import SeccionInformativa from './components/SeccionInformativa';
import MainCarousel from './components/MainCarousel';

// Componente auxiliar para que la página siempre suba al inicio al cambiar de ruta
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [carrito, setCarrito] = useState(JSON.parse(localStorage.getItem('cart')) || []);
    const [cartOpen, setCartOpen] = useState(false);
    const [menuCategoriasOpen, setMenuCategoriasOpen] = useState(false);

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
            <ScrollToTop />
            <div className="min-h-screen bg-globo-light flex flex-col font-sans">
                <header className="bg-white sticky top-0 z-50 border-b border-gray-100 py-4 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
                        
                        <Link to="/" className="flex items-center gap-2 group">
                            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
                            <div className="flex flex-col leading-tight">
                                <h1 className="text-xl font-extrabold text-slate-800 tracking-tighter leading-none">Globos<br/>Misiones</h1>
                            </div>
                        </Link>

                        <nav className="hidden lg:flex gap-8 text-[12px] font-bold text-gray-400 uppercase tracking-widest items-center">
                            <Link to="/" className="hover:text-globo-blue transition">Inicio</Link>
                            
                            <div className="relative">
                                <button 
                                    onMouseEnter={() => setMenuCategoriasOpen(true)}
                                    className="flex items-center gap-1 hover:text-globo-blue transition uppercase"
                                >
                                    Categorías <ChevronDown size={14} />
                                </button>
                                {menuCategoriasOpen && (
                                    <div 
                                        className="absolute top-full left-0 bg-white shadow-xl rounded-2xl p-4 w-56 border border-gray-100"
                                        onMouseLeave={() => setMenuCategoriasOpen(false)}
                                    >
                                        {categorias.map(cat => (
                                            <Link 
                                                key={cat.id} 
                                                to={`/?categoria=${cat.id}`}
                                                className="block py-2 px-4 hover:bg-globo-light rounded-xl text-slate-700 normal-case font-bold transition"
                                                onClick={() => setMenuCategoriasOpen(false)}
                                            >
                                                {cat.nombre}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Link to="/talleres" className="hover:text-globo-blue transition">talleres</Link>
                            <Link to="/ofertas" className="hover:text-globo-blue transition">Ofertas</Link>
                            <Link to="/regalos" className="hover:text-globo-blue transition">Regalos</Link>
                            <Link to="/quienes-somos" className="hover:text-globo-blue transition">Nosotros</Link>
                        </nav>

                        <div className="hidden md:flex flex-grow max-w-sm relative mx-4">
                            <input 
                                type="text" 
                                placeholder="Buscar globos..." 
                                className="w-full bg-gray-100 rounded-full py-2 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-globo-blue/20 transition-all"
                            />
                            <div className="absolute right-2 top-1.5 bg-globo-blue p-1.5 rounded-full text-white cursor-pointer">
                                <Search size={16} strokeWidth={3} />
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-gray-500">
                            <Link to={user ? (user.rol === 'admin' ? '/admin' : '#') : '/login'} className="hover:text-globo-blue transition">
                                <User size={22} />
                            </Link>
                            <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 hover:text-globo-blue transition">
                                <ShoppingCart size={22} />
                                {carrito.length > 0 && (
                                    <span className="absolute -top-2 -left-2 bg-globo-blue text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                        {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
                                    </span>
                                )}
                            </button>
                            {user && (
                                <button onClick={handleLogout} className="text-[10px] bg-red-50 text-red-500 px-3 py-1 rounded-full font-bold uppercase">Salir</button>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={
                            <>
                                <MainCarousel /> 
                                <Tienda productos={productos} categorias={categorias} agregarAlCarrito={agregarAlCarrito} />
                            </>
                        } />
                        
                        <Route path="/admin" element={<AdminPanel onProductAdded={fetchProductos} />} />
                        <Route path="/producto/:id" element={<ProductoDetalle productos={productos} agregarAlCarrito={agregarAlCarrito} />} />
                        <Route path="/login" element={<Auth setUser={setUser} />} />
                        <Route path="/pago-exitoso" element={<SuccessPage setCarrito={setCarrito} />} />
                        <Route path="/pago-fallido" element={<FailurePage />} />
                        <Route path="/quienes-somos" element={<QuienesSomos />} />

                        {/* EL TRUCO: Usamos 'key' para forzar a React a limpiar el componente al cambiar de ruta */}
                        <Route path="/talleres" element={<SeccionInformativa key="talleres" titulo="Nuestros" subrayado="Talleres" texto="Realizamos talleres presenciales para que aprendas el arte de la decoración con globos. Próximamente más fechas." />} />
                        <Route path="/ofertas" element={<SeccionInformativa key="ofertas" titulo="Super" subrayado="Ofertas" texto="Aprovecha nuestros combos con descuentos exclusivos por tiempo limitado." />} />
                        <Route path="/regalos" element={<SeccionInformativa key="regalos" titulo="Sets de" subrayado="Regalos" texto="Sorprendé a esa persona especial con nuestros bouquets de regalo personalizados." />} />
                    </Routes>
                </main>

                <Footer />
                <Cart carrito={carrito} setCarrito={setCarrito} isOpen={cartOpen} setIsOpen={setCartOpen} user={user} />
            </div>
        </Router>
    );
}

export default App;