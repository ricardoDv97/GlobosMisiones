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
        
        const url = isLogin 
            ? 'http://localhost/GlobosMisiones/Backend/models/Login.php' 
            : 'http://localhost/GlobosMisiones/Backend/models/Registro.php';

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
                    navigate('/'); // Volver a la tienda al loguearse
                } else {
                    alert("Registro exitoso, ahora inicia sesión");
                    setIsLogin(true);
                }
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
        }
    };

    return (
        <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl shadow-2xl border border-pink-100">
            <h2 className="text-3xl font-black text-gray-800 text-center uppercase italic mb-6">
                {isLogin ? '¡Hola de nuevo!' : 'Crea tu cuenta'}
            </h2>
            
            {error && <p className="bg-red-100 text-red-600 p-3 rounded-lg text-center mb-4 font-bold">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {!isLogin && (
                    <input 
                        type="text" placeholder="Tu Nombre" 
                        className="p-3 rounded-xl border-2 border-pink-50 outline-none focus:border-pink-500 transition-all"
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        required
                    />
                )}
                <input 
                    type="email" placeholder="Email" 
                    className="p-3 rounded-xl border-2 border-pink-50 outline-none focus:border-pink-500 transition-all"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                />
                <input 
                    type="password" placeholder="Contraseña" 
                    className="p-3 rounded-xl border-2 border-pink-50 outline-none focus:border-pink-500 transition-all"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                />
                <button className="bg-pink-600 text-white p-3 rounded-xl font-black uppercase hover:bg-pink-700 transition-all shadow-lg mt-2">
                    {isLogin ? 'Entrar' : 'Registrarme'}
                </button>
            </form>

            <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="w-full text-center mt-6 text-pink-500 font-bold hover:underline"
            >
                {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
        </div>
    );
};

export default Auth;