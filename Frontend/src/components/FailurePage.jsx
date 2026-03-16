import React from 'react';
import { Link } from 'react-router-dom';

const FailurePage = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-red-100 animate-fade-up">
                {/* Header del Card */}
                <div className="bg-red-500 p-8 text-white text-center relative">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-2 left-4 text-2xl">🎈</div>
                        <div className="absolute bottom-4 right-6 text-xl">🎈</div>
                    </div>
                    
                    <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <span className="text-4xl">❌</span>
                    </div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">¡Ups! Algo falló</h2>
                    <p className="text-red-100 text-[10px] font-bold uppercase tracking-widest mt-1">Globos Misiones - Pago no procesado</p>
                </div>

                {/* Contenido */}
                <div className="p-10 text-center">
                    <p className="text-gray-600 font-medium leading-relaxed mb-8">
                        No pudimos completar tu pago en este momento. Puede deberse a un problema con la tarjeta o una interrupción en la conexión.
                    </p>

                    <div className="space-y-4">
                        <Link 
                            to="/" 
                            className="block w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-red-200 transition-all uppercase tracking-widest text-sm"
                        >
                            Reintentar Compra 🛒
                        </Link>

                        <a 
                            href="https://wa.me/543764900821" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-green-100 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                        >
                            <span>Ayuda por WhatsApp</span>
                            <span className="text-lg">📱</span>
                        </a>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter italic">
                            Si el dinero se debitó de tu cuenta, por favor contáctanos con el comprobante.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FailurePage;