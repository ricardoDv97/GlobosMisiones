<?php
// Backend/models/Producto.php

// 1. Permitir que React acceda a los datos
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// 2. Importar la conexión centralizada (PDO)
require_once __DIR__ . '/../config/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        throw new Exception("No se pudo establecer conexión con la base de datos.");
    }

    // 3. Consulta incluyendo categoria_id y stock para filtrado y disponibilidad
    // Usamos PDO para la consulta
    $query = "SELECT id, titulo, precio, descripcion, imagen_url, categoria_id, stock FROM items ORDER BY id DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();

    // 4. Obtener todos los resultados
    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 5. Normalización de rutas de imagen
    // Esto asegura que si la imagen es local (ej: /productos/globo.jpg), 
    // el Frontend sepa dónde buscarla.
    foreach ($productos as &$p) {
        if (!empty($p['imagen_url'])) {
            // Si no es una URL externa (http), nos aseguramos de que empiece con /
            if (!filter_var($p['imagen_url'], FILTER_VALIDATE_URL)) {
                // Si por algún motivo se guardó sin la barra inicial, se la agregamos
                if (substr($p['imagen_url'], 0, 1) !== '/') {
                    $p['imagen_url'] = "/" . $p['imagen_url'];
                }
            }
        } else {
            // Imagen por defecto si está vacío
            $p['imagen_url'] = "https://via.placeholder.com/400x400?text=Globo+Misiones";
        }
    }

    // 6. Enviar el JSON limpio
    echo json_encode($productos);

} catch (Exception $e) {
    // En caso de error, enviamos un JSON con el error para que React no falle al parsear
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error en el servidor: " . $e->getMessage()
    ]);
}
exit;