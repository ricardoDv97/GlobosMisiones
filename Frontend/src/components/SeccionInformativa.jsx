import React from 'react';

const SeccionInformativa = ({ titulo, subrayado, texto }) => {
    return (
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
            {/* Título con espacio entre palabras */}
            <h2 className="text-5xl md:text-6xl font-black italic text-slate-800 uppercase tracking-tighter mb-10">
                {titulo} <span className="text-globo-pink ml-4">{subrayado}</span>
            </h2>
            
            {/* Contenedor de imagen con margen arriba y abajo */}
            <div className="bg-gray-100 w-full h-80 rounded-[50px] mb-12 flex items-center justify-center border-4 border-dashed border-gray-300">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-xl">
                    Imagen de {subrayado}
                </span>
            </div>

            {/* Texto descriptivo con buen ancho de lectura */}
            <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-500 font-medium italic leading-relaxed">
                {texto}
            </p>
        </section>
    );
};

export default SeccionInformativa;