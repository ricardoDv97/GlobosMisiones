import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti'; // Si no lo tienes, instala con: npm install canvas-confetti

const SuccessPage = ({ setCarrito }) => {
    useEffect(() => {
        // 1. Limpiamos el estado de React (esto vacía el carrito visualmente)
        if (setCarrito) {
            setCarrito([]);
        }
        // 2. Limpiamos el almacenamiento persistente
        localStorage.removeItem('cart');

        // 3. ¡Efecto de Confeti Profesional!
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    }, [setCarrito]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 bg-pink-50">
            <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center border-4 border-pink-100 animate-fade-up">
                <div className="text-7xl mb-6">🎉</div>
                
                <h1 className="text-4xl md:text-5xl font-black italic uppercase text-pink-600 tracking-tighter mb-4">
                    ¡Pedido Exitoso!
                </h1>
                
                <p className="text-gray-600 font-medium text-lg mb-8 leading-relaxed">
                    ¡Gracias por elegir <span className="text-pink-500 font-bold italic">Globos Misiones</span>! 
                    Tu pedido ha sido recibido y ya estamos preparando todo para llenar tu evento de color.
                </p>

                <div className="bg-pink-50 rounded-2xl p-6 mb-10 border border-pink-100">
                    <p className="text-sm text-pink-700 font-bold uppercase tracking-widest mb-2">¿Qué sigue ahora?</p>
                    <p className="text-gray-500 text-sm italic">
                        Nos comunicaremos contigo por WhatsApp para coordinar los detalles finales de la entrega en Posadas o el envío al interior.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        to="/" 
                        className="bg-pink-600 hover:bg-pink-700 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-lg hover:-translate-y-1 uppercase text-xs tracking-widest"
                    >
                        Volver a la Tienda
                    </Link>
                    <a 
                        href="https://wa.me/543764900821" 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-lg hover:-translate-y-1 uppercase text-xs tracking-widest flex items-center justify-center gap-2"
                    >
                        Consultar por WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
