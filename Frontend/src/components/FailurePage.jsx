import React from 'react';
import { Link } from 'react-router-dom';

const FailurePage = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 bg-gray-50/50">
            <div className="max-w-md w-full bg-white rounded-[4rem] shadow-2xl overflow-hidden border-8 border-white animate-fade-in">
                {/* Header Rojo Pastel / Intenso */}
                <div className="bg-red-500 p-12 text-white text-center relative">
                    <div className="absolute inset-0 opacity-10 flex flex-wrap gap-4 p-4 pointer-events-none">
                        {[...Array(6)].map((_, i) => <span key={i} className="text-3xl">🎈</span>)}
                    </div>
                    
                    <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md shadow-lg">
                        <span className="text-5xl">⚠️</span>
                    </div>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Algo salió mal</h2>
                    <p className="text-red-100 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Pago no procesado</p>
                </div>

                {/* Contenido */}
                <div className="p-12 text-center bg-white">
                    <p className="text-gray-500 font-bold leading-relaxed mb-10 text-lg">
                        No pudimos completar la transacción. Puede ser un problema temporal de conexión o de la tarjeta. ¡No te preocupes!
                    </p>

                    <div className="space-y-4">
                        <Link 
                            to="/" 
                            className="block w-full bg-pink-600 hover:bg-pink-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-pink-100 transition-all uppercase tracking-widest text-xs"
                        >
                            Reintentar Compra 🛒
                        </Link>

                        <a 
                            href="https://wa.me/543764900821" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block w-full border-4 border-green-500 text-green-600 hover:bg-green-50 font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                        >
                            <span>Ayuda por WhatsApp</span>
                            <span className="text-xl">📱</span>
                        </a>
                    </div>

                    <p className="mt-10 text-[9px] text-gray-400 font-black uppercase tracking-widest italic border-t border-gray-100 pt-6">
                        Si crees que es un error, envíanos un mensaje con el comprobante de tu banco.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FailurePage;