<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/Database.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos."]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Datos inválidos."]);
    exit;
}

try {
    $titulo      = $data['titulo'];
    $descripcion = $data['descripcion'] ?? '';
    $precio      = (float)$data['precio'];
    $stock       = (int)$data['stock'];
    $imagen_url  = $data['imagen_url'] ?? '';
    $categoria_id = (!empty($data['categoria_id'])) ? (int)$data['categoria_id'] : 1;

    $sql = "INSERT INTO items (titulo, descripcion, precio, stock, imagen_url, categoria_id) 
            VALUES (:titulo, :descripcion, :precio, :stock, :imagen_url, :categoria_id)";
    
    $stmt = $db->prepare($sql);
    
    $stmt->bindParam(':titulo', $titulo);
    $stmt->bindParam(':descripcion', $descripcion);
    $stmt->bindParam(':precio', $precio);
    $stmt->bindParam(':stock', $stock);
    $stmt->bindParam(':imagen_url', $imagen_url);
    $stmt->bindParam(':categoria_id', $categoria_id);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true, 
            "message" => "¡Producto guardado correctamente! 🎈",
            "id" => $db->lastInsertId()
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "No se pudo guardar el producto."]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}