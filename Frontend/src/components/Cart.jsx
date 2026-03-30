import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ carrito, setCarrito, isOpen, setIsOpen, user }) => {
    const navigate = useNavigate();
    const [ubicacionTipo, setUbicacionTipo] = useState(""); 
    const [mostrarFormEnvio, setMostrarFormEnvio] = useState(false);
    const [cargandoPedido, setCargandoPedido] = useState(false);

    const [provincias, setProvincias] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    const [cargandoGeo, setCargandoGeo] = useState(false);

    const [datosEnvio, setDatosEnvio] = useState({
        nombre: user?.nombre || '', apellido: '', telefono: '', provinciaId: '', provinciaNombre: '', localidad: '', direccion: '', observaciones: ''
    });

    useEffect(() => {
        fetch("https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre")
            .then(res => res.json())
            .then(data => setProvincias(data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre))));
    }, []);

    useEffect(() => {
        if (datosEnvio.provinciaId && ubicacionTipo === "Interior") {
            setCargandoGeo(true);
            fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${datosEnvio.provinciaId}&campos=nombre&max=500`)
                .then(res => res.json())
                .then(data => {
                    setLocalidades(data.municipios.sort((a, b) => a.nombre.localeCompare(b.nombre)));
                    setCargandoGeo(false);
                });
        }
    }, [datosEnvio.provinciaId, ubicacionTipo]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "provinciaId") {
            const nombreProv = provincias.find(p => p.id === value)?.nombre || "";
            setDatosEnvio(prev => ({ ...prev, provinciaId: value, provinciaNombre: nombreProv, localidad: "" }));
        } else { setDatosEnvio(prev => ({ ...prev, [name]: value })); }
    };

    const eliminarDelCarrito = (id) => setCarrito(prev => prev.filter(item => item.id !== id));
    const total = useMemo(() => carrito.reduce((acc, item) => acc + (parseFloat(item.precio) * item.cantidad), 0), [carrito]);

    const finalizarCompra = async () => {
        setCargandoPedido(true);
        const pedidoFinal = {
            items: carrito, usuario_id: user?.id,
            envio: { ...datosEnvio, tipo: ubicacionTipo, localidad: ubicacionTipo === "Posadas" ? "Posadas" : datosEnvio.localidad, provincia: ubicacionTipo === "Posadas" ? "Misiones" : datosEnvio.provinciaNombre },
            total: total
        };

        try {
            const response = await fetch('http://localhost/GlobosMisiones/Backend/models/MercadoPagoController.php', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedidoFinal)
            });
            const data = await response.json();

            if (ubicacionTipo === "Posadas") {
                const mensaje = `🎈 *Nuevo Pedido - Globos Misiones*\n\n*CLIENTE:* ${datosEnvio.nombre}\n*DIRECCIÓN:* ${datosEnvio.direccion}, Posadas\n*PRODUCTOS:*\n` + carrito.map(i => `- ${i.titulo} (x${i.cantidad})`).join('\n') + `\n*TOTAL:* $${total.toLocaleString('es-AR')}`;
                window.open(`https://wa.me/543764900821?text=${encodeURIComponent(mensaje)}`, '_blank');
                setIsOpen(false); navigate('/pago-exitoso');
            } else if (data.init_point) { window.location.href = data.init_point; }
        } catch (error) { alert("Error al procesar el pago."); }
        finally { setCargandoPedido(false); }
    };

    if (!isOpen) return null;
    const formularioValido = datosEnvio.nombre && datosEnvio.telefono && datosEnvio.direccion && (ubicacionTipo === 'Posadas' || datosEnvio.localidad);

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-pink-900/40 backdrop-blur-md transition-opacity" onClick={() => setIsOpen(false)}></div>
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right overflow-hidden rounded-l-[3rem]">
                
                <div className="p-8 bg-pink-600 text-white shrink-0 relative">
                    <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 bg-white/20 hover:bg-white text-white hover:text-pink-600 w-10 h-10 rounded-full transition-all flex items-center justify-center font-bold">✕</button>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Mi Pedido</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80 mt-1">Bolsa de Compras</p>
                </div>

                <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                    {!mostrarFormEnvio ? (
                        <>
                            {carrito.length === 0 ? (
                                <div className="text-center py-20 animate-bounce">
                                    <span className="text-6xl block mb-4">🎈</span>
                                    <p className="font-black text-gray-400 uppercase text-xs tracking-widest">¿Aún no elegiste tus globos?</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {carrito.map(item => (
                                        <div key={item.id} className="flex gap-4 p-4 bg-white rounded-[2rem] border-2 border-pink-50 items-center shadow-sm">
                                            <img src={item.imagen_url} className="w-20 h-20 object-cover rounded-2xl shadow-inner" alt="" />
                                            <div className="flex-grow">
                                                <p className="font-black text-[12px] uppercase text-gray-700 leading-none mb-1">{item.titulo}</p>
                                                <p className="text-pink-600 font-black text-lg tracking-tighter">${parseFloat(item.precio).toLocaleString('es-AR')}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="bg-pink-50 text-pink-500 text-[10px] font-black px-3 py-1 rounded-full uppercase">Cant: {item.cantidad}</span>
                                                </div>
                                            </div>
                                            <button onClick={() => eliminarDelCarrito(item.id)} className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-all">✕</button>
                                        </div>
                                    ))}
                                    <div className="grid grid-cols-2 gap-4 pt-6">
                                        <button onClick={() => { setUbicacionTipo("Posadas"); setMostrarFormEnvio(true); }} className="p-6 bg-white border-4 border-pink-50 rounded-[2.5rem] hover:border-pink-500 hover:scale-105 transition-all flex flex-col items-center shadow-md">
                                            <span className="text-4xl mb-2">🛵</span>
                                            <span className="font-black text-[10px] uppercase tracking-widest text-gray-600">Posadas (WA)</span>
                                        </button>
                                        <button onClick={() => { setUbicacionTipo("Interior"); setMostrarFormEnvio(true); }} className="p-6 bg-white border-4 border-pink-50 rounded-[2.5rem] hover:border-pink-500 hover:scale-105 transition-all flex flex-col items-center shadow-md">
                                            <span className="text-4xl mb-2">🚚</span>
                                            <span className="font-black text-[10px] uppercase tracking-widest text-gray-600">Interior (MP)</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="space-y-4 animate-fade-in pb-10">
                            <button onClick={() => setMostrarFormEnvio(false)} className="bg-pink-100 text-pink-600 font-black text-[10px] uppercase px-4 py-2 rounded-full mb-4">← Volver al carrito</button>
                            <h3 className="font-black text-gray-700 uppercase italic text-lg mb-4">Datos de Envío</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <input name="nombre" value={datosEnvio.nombre} onChange={handleInputChange} placeholder="Nombre" className="w-full p-5 bg-white rounded-2xl text-xs font-bold border-2 border-pink-50 outline-none focus:border-pink-400 shadow-sm" />
                                <input name="apellido" placeholder="Apellido" onChange={handleInputChange} className="w-full p-5 bg-white rounded-2xl text-xs font-bold border-2 border-pink-50 outline-none focus:border-pink-400 shadow-sm" />
                            </div>
                            <input name="telefono" placeholder="WhatsApp (Ej: 3764...)" onChange={handleInputChange} className="w-full p-5 bg-white rounded-2xl text-xs font-bold border-2 border-pink-50 outline-none focus:border-pink-400 shadow-sm" />
                            {ubicacionTipo === "Interior" && (
                                <div className="space-y-3">
                                    <select name="provinciaId" value={datosEnvio.provinciaId} onChange={handleInputChange} className="w-full p-5 bg-white rounded-2xl text-[10px] font-black uppercase border-2 border-pink-50 outline-none shadow-sm">
                                        <option value="">Provincia</option>
                                        {provincias.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                    </select>
                                    <select name="localidad" value={datosEnvio.localidad} onChange={handleInputChange} disabled={!datosEnvio.provinciaId || cargandoGeo} className="w-full p-5 bg-white rounded-2xl text-[10px] font-black uppercase border-2 border-pink-50 outline-none shadow-sm disabled:opacity-50">
                                        <option value="">{cargandoGeo ? "Cargando ciudades..." : "Seleccionar Localidad"}</option>
                                        {localidades.map((l, i) => <option key={i} value={l.nombre}>{l.nombre}</option>)}
                                    </select>
                                </div>
                            )}
                            <input name="direccion" placeholder="Calle, Número y Referencias" onChange={handleInputChange} className="w-full p-5 bg-white rounded-2xl text-xs font-bold border-2 border-pink-50 outline-none focus:border-pink-400 shadow-sm" />
                            <textarea name="observaciones" placeholder="¿Alguna nota especial?" onChange={handleInputChange} className="w-full p-5 bg-white rounded-2xl text-xs font-bold border-2 border-pink-50 h-24 resize-none outline-none focus:border-pink-400 shadow-sm" />
                        </div>
                    )}
                </div>

                <div className="p-8 bg-white border-t border-pink-50 rounded-t-[3.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.03)] shrink-0">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Total a pagar</p>
                            <p className="text-4xl font-black italic tracking-tighter text-gray-800">${total.toLocaleString('es-AR')}</p>
                        </div>
                        <span className="text-3xl">🎈</span>
                    </div>

                    {mostrarFormEnvio && (
                        <div className="space-y-4">
                            <button 
                                onClick={finalizarCompra}
                                disabled={!formularioValido || cargandoPedido}
                                className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] text-white shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 ${ubicacionTipo === "Posadas" ? 'bg-green-500 shadow-green-100 hover:bg-green-600' : 'bg-[#009EE3] shadow-blue-100 hover:bg-blue-600'}`}
                            >
                                {ubicacionTipo === "Posadas" ? 'Finalizar por WhatsApp 📱' : 'Pagar con Mercado Pago'}
                            </button>
                            <p className="text-[8px] text-center text-gray-400 font-black uppercase tracking-[0.2em]">Seguridad 100% garantizada</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;