import React, { useEffect, useState } from 'react'

function App() {
  // Aquí guardaremos los globos que traigamos de PHP
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // IMPORTANTE: Cambia esta URL por la que te funcionó en el navegador
    // Probablemente sea: http://localhost/GlobosMisiones/Backend/models/Producto.php
    fetch('http://localhost/GlobosMisiones/Backend/models/Producto.php')
      .then(res => res.json())
      .then(data => {
        console.log("Datos cargados:", data);
        setProductos(data);
      })
      .catch(err => console.error("Error al conectar con PHP:", err));
  }, []);

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Encabezado Estilo Misiones */}
      <header className="bg-pink-600 p-8 text-white text-center shadow-lg">
        <h1 className="text-5xl font-black italic drop-shadow-md underline decoration-pink-300">
          GLOBOS MISIONES 🎈
        </h1>
        <p className="mt-2 font-bold text-pink-100 uppercase tracking-widest">Tienda Oficial - Posadas</p>
      </header>

      {/* Contenedor de Productos */}
      <main className="p-10 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 border-l-8 border-pink-500 pl-4">
          Nuestro Catálogo
        </h2>

        {/* Si no hay productos todavía, mostramos un mensaje */}
        {productos.length === 0 ? (
          <div className="text-center p-20 bg-white rounded-3xl shadow-xl">
            <p className="text-2xl text-gray-400">Cargando globos mágicos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productos.map((globo) => (
              <div key={globo.id} className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all border border-pink-100 flex flex-col items-center">
                <div className="text-7xl mb-4 transform hover:rotate-12 transition-transform cursor-pointer">🎈</div>
                <h3 className="text-2xl font-black text-gray-800">{globo.titulo}</h3>
                <p className="text-gray-500 text-center mt-2 font-medium">{globo.descripcion}</p>
                <div className="mt-6 w-full flex justify-between items-center bg-pink-50 p-4 rounded-2xl">
                  <span className="text-3xl font-black text-pink-600">${globo.precio}</span>
                  <button className="bg-pink-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-pink-700 active:scale-95 transition-all">
                    Añadir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App