import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = ({ setUser }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const url = isLogin ? 'http://localhost/GlobosMisiones/Backend/models/Login.php' : 'http://localhost/GlobosMisiones/Backend/models/Registro.php';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.success) {
                if (isLogin) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setUser(data.user);
                    navigate('/');
                } else {
                    alert("¡Cuenta creada! Ahora inicia sesión.");
                    setIsLogin(true);
                }
            } else { setError(data.message); }
        } catch (err) { setError("Error de conexión con el servidor"); }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-10 border-8 border-pink-50 border-double">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-black text-gray-800 uppercase italic tracking-tighter">
                        {isLogin ? '¡Hola!' : 'Unete'}
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-500 mt-2">Mundo de Globos</p>
                </div>
                
                {error && <p className="bg-red-50 text-red-500 p-4 rounded-2xl text-center mb-6 font-black text-[10px] uppercase tracking-widest border border-red-100">{error}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {!isLogin && (
                        <input 
                            type="text" placeholder="Nombre Completo" 
                            className="p-5 rounded-2xl bg-pink-50/50 border-2 border-transparent outline-none focus:border-pink-500 focus:bg-white transition-all font-bold"
                            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                            required
                        />
                    )}
                    <input 
                        type="email" placeholder="Correo Electrónico" 
                        className="p-5 rounded-2xl bg-pink-50/50 border-2 border-transparent outline-none focus:border-pink-500 focus:bg-white transition-all font-bold"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                    <input 
                        type="password" placeholder="Tu Contraseña" 
                        className="p-5 rounded-2xl bg-pink-50/50 border-2 border-transparent outline-none focus:border-pink-500 focus:bg-white transition-all font-bold"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />
                    <button className="bg-pink-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-pink-700 transition-all shadow-xl shadow-pink-100 mt-4 active:scale-95">
                        {isLogin ? 'Ingresar Ahora' : 'Crear mi Cuenta'}
                    </button>
                </form>

                <button 
                    onClick={() => setIsLogin(!isLogin)} 
                    className="w-full text-center mt-8 text-pink-400 font-black uppercase text-[10px] tracking-widest hover:text-pink-600 transition-colors"
                >
                    {isLogin ? '¿No tienes cuenta? Registrate gratis' : '¿Ya eres cliente? Inicia sesión'}
                </button>
            </div>
        </div>
    );
};

export default Auth;