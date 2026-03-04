import React from 'react';

const QuienesSomos = () => {
    return (
        <section className="py-16 bg-gradient-to-b from-white to-pink-50">
            <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                
                {/* Imagen decorativa */}
                <div className="relative">
                    <div className="absolute -top-4 -left-4 w-full h-full border-4 border-pink-200 rounded-3xl"></div>
                    <img 
                        src="/quienesSomos.jpeg" 
                        alt="Nuestro taller" 
                        className="relative z-10 rounded-3xl shadow-xl object-cover h-96 w-full"
                    />
                </div>

                {/* Texto */}
                <div className="space-y-6">
                    <h2 className="text-4xl font-black text-pink-600 uppercase italic tracking-tighter">
                        ¿Quiénes Somos?
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        <span className="font-bold text-pink-500">Globos Misiones</span>, tienda virtual dedicada a la venta por menor y por mayor de globos, artículos para decoración y también realizamos trabajos personalizados y decoraciones con globos.
                    </p>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-pink-400">
                        <p className="italic text-gray-500 text-md">
                            "𝖳𝖾𝗇𝖾𝗆𝗈𝗌 𝗆𝖺𝗌 𝖽𝖾 6 𝖺ñ𝗈𝗌 𝖽𝖾 𝖾𝗑𝗉𝖾𝗋𝗂𝖾𝗇𝖼𝗂𝖺 𝖼𝗈𝗆𝖾𝗋𝖼𝗂𝖺𝗅𝗂𝗓𝖺𝗇𝖽𝗈 𝗅𝗈𝗌 𝗉𝗋𝗈𝖽𝗎𝖼𝗍𝗈𝗌 𝗆á𝗌 𝗂𝗇𝗇𝗈𝗏𝖺𝖽𝗈𝗋𝖾𝗌, 𝗉𝖺𝗋𝖺 𝗉𝗋𝗈𝗏𝖾𝖾𝗋 𝖺 𝗅𝗈𝗌 𝖼𝗅𝗂𝖾𝗇𝗍𝖾𝗌 𝗆á𝗌 𝖽𝖾𝗌𝗍𝖺𝖼𝖺𝖽𝗈𝗌 𝗒 𝗋𝖾𝗅𝖾𝗏𝖺𝗇𝗍𝖾𝗌 𝖽𝖾𝗅 𝗉𝖺í𝗌."
                        </p>
                    </div>
                    <p className="text-gray-600">
                        Especialistas en arcos orgánicos, bouquets personalizados y sets de cumpleaños que marcan tendencia en toda la provincia.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default QuienesSomos;