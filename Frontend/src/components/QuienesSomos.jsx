import React from 'react';

const QuienesSomos = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                
                {/* Imagen con el estilo del proyecto */}
                <div className="relative">
                    <div className="absolute -bottom-6 -right-6 w-full h-full bg-globo-pink/10 rounded-[50px] -z-10"></div>
                    <img 
                        src="/quienesSomos.jpeg" 
                        alt="Nuestro taller" 
                        className="rounded-[50px] shadow-2xl object-cover h-[500px] w-full border-8 border-white"
                    />
                </div>

                {/* Texto basado fielmente en tu archivo */}
                <div className="space-y-8">
                    <h2 className="text-5xl font-black text-slate-800 uppercase italic tracking-tighter">
                        ¿Quiénes <span className="text-globo-pink">Somos?</span>
                    </h2>
                    
                    <p className="text-gray-600 leading-relaxed text-xl font-medium">
                        <span className="font-black text-globo-pink">Globos Misiones</span>, tienda virtual dedicada a la venta por menor y por mayor de globos, artículos para decoración y también realizamos trabajos personalizados y decoraciones con globos.
                    </p>

                    <div className="bg-gray-50 p-8 rounded-[40px] border-l-[12px] border-globo-pink shadow-sm">
                        <p className="italic text-slate-700 text-lg font-bold leading-snug">
                            "Tenemos mas de 6 años de experiencia comercializando los productos más innovadores, para proveer a los clientes más destacados y relevantes del país."
                        </p>
                    </div>

                    <p className="text-gray-500 font-bold italic text-lg">
                        Especialistas en arcos orgánicos, bouquets personalizados y sets de cumpleaños que marcan tendencia en toda la provincia.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default QuienesSomos;