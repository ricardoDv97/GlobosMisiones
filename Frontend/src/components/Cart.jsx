import React from 'react';

const Cart = ({ carrito, setCarrito, isOpen, setIsOpen }) => {
    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    // Función para eliminar un producto completamente del carrito
    const eliminarDelCarrito = (id) => {
        setCarrito(prev => prev.filter(item => item.id !== id));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
            
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6 animate-fade-left">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-black italic text-pink-600 uppercase">Mi Carrito</h2>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-pink-500 text-2xl">✕</button>
                </div>

                <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                    {carrito.length === 0 ? (
                        <div className="text-center mt-20">
                            <span className="text-6xl">🎈</span>
                            <p className="text-gray-400 mt-4 italic font-medium">El carrito está vacío...</p>
                        </div>
                    ) : (
                        carrito.map(item => (
                            <div key={item.id} className="flex gap-4 mb-4 bg-pink-50/50 p-3 rounded-2xl border border-pink-100 group relative">
                                <img src={item.imagen_url} className="w-20 h-20 object-cover rounded-xl shadow-sm" alt={item.titulo} />
                                <div className="flex-grow">
                                    <h4 className="font-bold text-gray-800 text-sm leading-tight pr-6">{item.titulo}</h4>
                                    <p className="text-pink-600 font-black mt-1">${parseFloat(item.precio).toLocaleString('es-AR')}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs bg-white px-2 py-1 rounded-lg border border-pink-200 font-bold text-gray-600">
                                            Cant: {item.cantidad}
                                        </span>
                                        <span className="text-sm font-bold text-gray-400">
                                            Subtotal: ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                                        </span>
                                    </div>
                                </div>
                                {/* Botón Eliminar */}
                                <button 
                                    onClick={() => eliminarDelCarrito(item.id)}
                                    className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors"
                                    title="Quitar producto"
                                >
                                    <span className="text-lg">🗑️</span>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="border-t pt-6 mt-4">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-500 font-black text-sm uppercase">Total Pedido:</span>
                        <span className="text-3xl font-black text-gray-900">${total.toLocaleString('es-AR')}</span>
                    </div>
                    
                    {/* El botón de pago lo configuraremos mañana según la ubicación */}
                    <button 
                        disabled={carrito.length === 0}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Continuar Compra
                    </button>
                    <p className="text-[10px] text-center text-gray-400 mt-4 uppercase font-bold tracking-tighter">
                        Mañana habilitaremos Mercado Pago y WhatsApp según tu zona
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Cart;