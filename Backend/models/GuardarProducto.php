<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$servidor = "localhost";
$usuario  = "root";
$password = ""; 
$base_datos = "globosmisiones"; 

$conn = new mysqli($servidor, $usuario, $password, $base_datos);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión: " . $conn->connect_error]);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Datos inválidos."]);
    exit;
}

// Mapeo según tus columnas exactas
$titulo      = $data['titulo'];
$descripcion = $data['descripcion'] ?? '';
$precio      = (float)$data['precio'];
$stock       = (int)$data['stock'];
$imagen_url  = $data['imagen_url'] ?? '';
// Si no viene categoría, le asigna la 1 por defecto para evitar errores de base de datos
$categoria_id = (!empty($data['categoria_id'])) ? (int)$data['categoria_id'] : 1;

// La consulta con las 7 columnas (id es autoincremental, no se pone)
$sql = "INSERT INTO items (titulo, descripcion, precio, stock, imagen_url, categoria_id) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

// "ssdisi" -> string, string, double (precio), integer (stock), string (url), integer (categoria)
$stmt->bind_param("ssdisi", $titulo, $descripcion, $precio, $stock, $imagen_url, $categoria_id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true, 
        "message" => "¡Producto guardado correctamente! 🎈",
        "id" => $conn->insert_id
    ]);
} else {
    echo json_encode([
        "success" => false, 
        "message" => "Error al insertar: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
