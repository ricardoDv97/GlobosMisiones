import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ carrito, setCarrito, isOpen, setIsOpen, user }) => {
    const navigate = useNavigate();
    const [ubicacionTipo, setUbicacionTipo] = useState(""); 
    const [mostrarFormEnvio, setMostrarFormEnvio] = useState(false);
    const [cargandoPedido, setCargandoPedido] = useState(false);

    // Estados para la API de Georef (Gobierno)
    const [provincias, setProvincias] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    const [cargandoGeo, setCargandoGeo] = useState(false);

    const [datosEnvio, setDatosEnvio] = useState({
        nombre: user?.nombre || '',
        apellido: '',
        telefono: '',
        provinciaId: '', 
        provinciaNombre: '', 
        localidad: '',
        direccion: '',
        observaciones: ''
    });

    useEffect(() => {
        fetch("https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre")
            .then(res => res.json())
            .then(data => {
                const lista = data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre));
                setProvincias(lista);
            })
            .catch(err => console.error("Error provincias:", err));
    }, []);

    useEffect(() => {
        if (datosEnvio.provinciaId && ubicacionTipo === "Interior") {
            setCargandoGeo(true);
            fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${datosEnvio.provinciaId}&campos=nombre&max=500`)
                .then(res => res.json())
                .then(data => {
                    const lista = data.municipios.sort((a, b) => a.nombre.localeCompare(b.nombre));
                    setLocalidades(lista);
                    setCargandoGeo(false);
                })
                .catch(err => {
                    console.error("Error localidades:", err);
                    setCargandoGeo(false);
                });
        }
    }, [datosEnvio.provinciaId, ubicacionTipo]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "provinciaId") {
            const nombreProv = provincias.find(p => p.id === value)?.nombre || "";
            setDatosEnvio(prev => ({ ...prev, provinciaId: value, provinciaNombre: nombreProv, localidad: "" }));
        } else {
            setDatosEnvio(prev => ({ ...prev, [name]: value }));
        }
    };

    const eliminarDelCarrito = (id) => {
        setCarrito(prev => prev.filter(item => item.id !== id));
    };

    const total = useMemo(() => {
        return carrito.reduce((acc, item) => acc + (parseFloat(item.precio) * item.cantidad), 0);
    }, [carrito]);

    const finalizarCompra = async () => {
        setCargandoPedido(true);
        const pedidoFinal = {
            items: carrito,
            usuario_id: user?.id,
            envio: {
                ...datosEnvio,
                tipo: ubicacionTipo,
                localidad: ubicacionTipo === "Posadas" ? "Posadas" : datosEnvio.localidad,
                provincia: ubicacionTipo === "Posadas" ? "Misiones" : datosEnvio.provinciaNombre
            },
            total: total
        };

        try {
            const response = await fetch('http://localhost/GlobosMisiones/Backend/models/MercadoPagoController.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedidoFinal)
            });
            const data = await response.json();

            if (ubicacionTipo === "Posadas") {
                const mensaje = `🎈 *Nuevo Pedido - Globos Misiones*\n\n` +
                    `*CLIENTE:* ${datosEnvio.nombre} ${datosEnvio.apellido}\n` +
                    `*DIRECCIÓN:* ${datosEnvio.direccion}, Posadas\n` +
                    `*PRODUCTOS:*\n` +
                    carrito.map(i => `- ${i.titulo} (x${i.cantidad})`).join('\n') +
                    `\n*TOTAL:* $${total.toLocaleString('es-AR')}`;
                
                window.open(`https://wa.me/543764900821?text=${encodeURIComponent(mensaje)}`, '_blank');
                setIsOpen(false);
                navigate('/pago-exitoso');
            } else if (data.init_point) {
                window.location.href = data.init_point;
            }
        } catch (error) {
            alert("Error al procesar el pago.");
        } finally {
            setCargandoPedido(false);
        }
    };

    if (!isOpen) return null;

    const formularioValido = datosEnvio.nombre && datosEnvio.telefono && datosEnvio.direccion && (ubicacionTipo === 'Posadas' || datosEnvio.localidad);

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
            
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-fade-left">
                {/* Header */}
                <div className="p-6 bg-pink-600 text-white flex justify-between items-center shadow-lg shrink-0">
                    <div>
                        <h2 className="text-xl font-black uppercase italic tracking-tighter">Mi Carrito</h2>
                        <p className="text-[9px] font-bold opacity-80 uppercase tracking-widest text-pink-100">Globos Misiones</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="bg-white/20 w-10 h-10 rounded-full hover:bg-white/40 transition-all flex items-center justify-center">✕</button>
                </div>

                {/* Contenido Scrollable */}
                <div className="flex-grow overflow-y-auto p-5 space-y-4">
                    {!mostrarFormEnvio ? (
                        <>
                            {carrito.length === 0 ? (
                                <p className="text-center text-gray-400 py-10 font-bold uppercase text-[10px]">Tu carrito está vacío 🎈</p>
                            ) : (
                                carrito.map(item => (
                                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-[1.5rem] border border-gray-100 items-center animate-fade-in">
                                        <img src={item.imagen_url} className="w-16 h-16 object-cover rounded-xl shadow-sm" alt="" />
                                        <div className="flex-grow">
                                            <p className="font-black text-[11px] uppercase text-gray-700 leading-tight">{item.titulo}</p>
                                            <p className="text-pink-600 font-black text-sm">${parseFloat(item.precio).toLocaleString('es-AR')}</p>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase">Cant: {item.cantidad}</p>
                                        </div>
                                        <button onClick={() => eliminarDelCarrito(item.id)} className="p-2 text-red-300 hover:text-red-500 transition-colors">🗑️</button>
                                    </div>
                                ))
                            )}
                            
                            {carrito.length > 0 && (
                                <div className="grid grid-cols-2 gap-3 pt-4">
                                    <button onClick={() => { setUbicacionTipo("Posadas"); setMostrarFormEnvio(true); }} className="p-5 border-2 border-gray-100 rounded-[2rem] hover:border-pink-500 hover:bg-pink-50 transition-all flex flex-col items-center group">
                                        <span className="text-3xl group-hover:scale-110 transition-transform">🛵</span>
                                        <span className="font-black text-[9px] uppercase mt-2 text-gray-500">Posadas</span>
                                    </button>
                                    <button onClick={() => { setUbicacionTipo("Interior"); setMostrarFormEnvio(true); }} className="p-5 border-2 border-gray-100 rounded-[2rem] hover:border-pink-500 hover:bg-pink-50 transition-all flex flex-col items-center group">
                                        <span className="text-3xl group-hover:scale-110 transition-transform">🚚</span>
                                        <span className="font-black text-[9px] uppercase mt-2 text-gray-500">Interior</span>
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="space-y-4 animate-fade-up">
                            <button onClick={() => setMostrarFormEnvio(false)} className="text-pink-600 font-black text-[10px] uppercase underline mb-2">← Editar pedido</button>
                            <div className="grid grid-cols-2 gap-2">
                                <input name="nombre" value={datosEnvio.nombre} onChange={handleInputChange} placeholder="Nombre" className="w-full p-4 bg-gray-50 rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-pink-100" />
                                <input name="apellido" placeholder="Apellido" onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-pink-100" />
                            </div>
                            <input name="telefono" placeholder="WhatsApp" onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-pink-100" />
                            
                            {ubicacionTipo === "Interior" && (
                                <div className="space-y-2">
                                    <select name="provinciaId" value={datosEnvio.provinciaId} onChange={handleInputChange} className="w-full p-4 bg-gray-100 rounded-2xl text-xs font-black uppercase outline-none">
                                        <option value="">Provincia</option>
                                        {provincias.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                    </select>
                                    <select name="localidad" value={datosEnvio.localidad} onChange={handleInputChange} disabled={!datosEnvio.provinciaId || cargandoGeo} className="w-full p-4 bg-gray-100 rounded-2xl text-xs font-black uppercase outline-none disabled:opacity-50">
                                        <option value="">{cargandoGeo ? "Cargando..." : "Localidad"}</option>
                                        {localidades.map((l, i) => <option key={i} value={l.nombre}>{l.nombre}</option>)}
                                    </select>
                                </div>
                            )}
                            <input name="direccion" placeholder="Calle y Nro" onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-pink-100" />
                            <textarea name="observaciones" placeholder="Notas..." onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-2xl text-xs font-bold h-20 resize-none outline-none" />
                        </div>
                    )}
                </div>

                {/* Footer Fijo y Prolijo */}
                <div className="p-6 border-t bg-white rounded-t-[2.5rem] shadow-[0_-15px_30px_rgba(0,0,0,0.05)] shrink-0">
                    <div className="flex justify-between items-center mb-5 px-4">
                        <span className="font-black text-gray-300 uppercase text-[9px] tracking-widest">Total</span>
                        <span className="text-3xl font-black italic tracking-tighter text-gray-800">${total.toLocaleString('es-AR')}</span>
                    </div>

                    {mostrarFormEnvio && (
                        <div className="max-w-[280px] mx-auto space-y-3">
                            {ubicacionTipo === "Posadas" ? (
                                <button 
                                    onClick={finalizarCompra}
                                    disabled={!formularioValido || cargandoPedido}
                                    className="w-full bg-[#25D366] py-4 rounded-2xl font-black uppercase text-[11px] text-white shadow-lg shadow-green-100 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    WhatsApp 📱
                                </button>
                            ) : (
                                <button 
                                    onClick={finalizarCompra}
                                    disabled={!formularioValido || cargandoPedido}
                                    className="w-full bg-[#009EE3] py-4 rounded-2xl font-black uppercase text-[11px] text-white shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    <img src="https://imgmp.mlstatic.com/resources/mp-logo.png" alt="" className="h-4 w-auto brightness-200" />
                                    <span>Pagar</span>
                                </button>
                            )}
                            <p className="text-[7px] text-center text-gray-400 font-bold uppercase tracking-widest leading-tight">
                                Al confirmar, procesaremos tu pedido <br/> de Globos Misiones
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;