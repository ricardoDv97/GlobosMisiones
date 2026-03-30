import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

const SuccessPage = ({ setCarrito }) => {
    useEffect(() => {
        if (setCarrito) setCarrito([]);
        localStorage.removeItem('cart');

        const duration = 4 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 40, spread: 360, ticks: 100, zIndex: 999 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 60 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, colors: ['#ec4899', '#fbcfe8', '#ffffff'], origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, colors: ['#ec4899', '#fbcfe8', '#ffffff'], origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    }, [setCarrito]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 bg-pink-50/30">
            <div className="max-w-2xl w-full bg-white rounded-[4rem] shadow-[0_40px_80px_rgba(0,0,0,0.08)] p-12 text-center border-8 border-white animate-fade-in relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50"></div>
                
                <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <span className="text-6xl animate-bounce">🎉</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-black italic uppercase text-gray-900 tracking-tighter mb-6 leading-none">
                    ¡Pedido <span className="text-pink-600 underline decoration-pink-200 underline-offset-8">Confirmado</span>!
                </h1>
                
                <p className="text-gray-500 font-bold text-lg mb-10 leading-relaxed max-w-lg mx-auto">
                    ¡Gracias por elegir <span className="text-pink-600 italic">Globos Misiones</span>! 
                    Tu pedido ya está en nuestro radar y estamos listos para preparar algo increíble.
                </p>

                <div className="bg-gradient-to-r from-pink-600 to-pink-500 rounded-[2.5rem] p-8 mb-10 text-white shadow-xl shadow-pink-100 relative">
                    <div className="absolute top-2 left-4 text-2xl opacity-20">🎈</div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-3 opacity-90">Próximos Pasos</p>
                    <p className="text-sm font-bold italic">
                        Nos pondremos en contacto vía WhatsApp para coordinar el horario de entrega en Posadas o pasarte el seguimiento del envío al interior.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        to="/" 
                        className="bg-gray-900 hover:bg-black text-white font-black py-5 px-10 rounded-2xl transition-all shadow-xl hover:-translate-y-1 uppercase text-xs tracking-widest"
                    >
                        Seguir Comprando
                    </Link>
                    <a 
                        href="https://wa.me/543764900821" 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white font-black py-5 px-10 rounded-2xl transition-all shadow-xl hover:-translate-y-1 uppercase text-xs tracking-widest flex items-center justify-center gap-3"
                    >
                        <span>WhatsApp Soporte</span>
                        <span className="text-lg">📱</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;