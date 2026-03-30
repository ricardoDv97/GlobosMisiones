import React from 'react';
import { Instagram, Facebook, MessageCircle, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t-4 border-globo-pink pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Branding */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
            <h2 className="text-2xl font-black italic text-slate-800 tracking-tighter leading-none">
              GLOBOS<br/><span className="text-globo-pink">MISIONES</span>
            </h2>
          </div>
          <p className="text-gray-500 text-sm font-medium">
            Hacemos que tus momentos especiales brillen más. Decoraciones exclusivas con envíos a toda la provincia.
          </p>
        </div>

        {/* Enlaces Rápidos */}
        <div>
          <h4 className="text-slate-800 font-black italic uppercase text-sm mb-6">Navegación</h4>
          <ul className="space-y-3 text-gray-500 text-sm font-bold">
            <li className="hover:text-globo-pink cursor-pointer transition-colors">Inicio</li>
            <li className="hover:text-globo-pink cursor-pointer transition-colors">Categorías</li>
            <li className="hover:text-globo-pink cursor-pointer transition-colors">Ofertas</li>
            <li className="hover:text-globo-pink cursor-pointer transition-colors">¿Quiénes Somos?</li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="text-slate-800 font-black italic uppercase text-sm mb-6">Contacto</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-gray-500 text-sm font-medium">
              <MapPin size={18} className="text-globo-pink" />
              Posadas, Misiones, Argentina
            </li>
            <li className="flex items-center gap-3 text-gray-500 text-sm font-medium">
              <MessageCircle size={18} className="text-globo-pink" />
              +54 376 400-0000
            </li>
          </ul>
        </div>

        {/* Redes Sociales */}
        <div>
          <h4 className="text-slate-800 font-black italic uppercase text-sm mb-6">Seguinos</h4>
          <div className="flex gap-4">
            <a href="#" className="bg-globo-pink p-3 rounded-2xl text-white hover:scale-110 transition-transform shadow-lg">
              <Instagram size={20} />
            </a>
            <a href="#" className="bg-slate-800 p-3 rounded-2xl text-white hover:scale-110 transition-transform shadow-lg">
              <Facebook size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-100 flex flex-col md:row justify-between items-center gap-4">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} Globos Misiones - Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-2 grayscale opacity-50">
           {/* Aquí podrías poner mini logos de métodos de pago */}
           <span className="text-[10px] font-black italic">PAGOS SEGUROS CON MERCADO PAGO</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;