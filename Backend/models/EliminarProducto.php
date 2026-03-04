<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/../config/Database.php';

$database = new Database();
$db = $database->getConnection();

// Obtenemos el ID (ya sea por POST o por el cuerpo del JSON)
$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;

if ($id) {
    $query = "DELETE FROM items WHERE id = ?";
    $stmt = $db->prepare($query);
    
    if ($stmt->execute([$id])) {
        echo json_encode(["success" => true, "message" => "Producto eliminado correctamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al eliminar"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "ID no proporcionado"]);
}
