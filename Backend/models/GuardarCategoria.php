<?php
// 1. Impedir que errores de texto ensucien la salida
error_reporting(0);
ini_set('display_errors', 0);
ob_start(); 

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { 
    ob_end_clean();
    exit; 
}

$conn = new mysqli("localhost", "root", "", "globosmisiones");

if ($conn->connect_error) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (isset($data['nombre']) && !empty($data['nombre'])) {
    $nombre = $data['nombre'];
    $stmt = $conn->prepare("INSERT INTO categorias (nombre) VALUES (?)");
    $stmt->bind_param("s", $nombre);
    
    if ($stmt->execute()) {
        $res = ["success" => true];
    } else {
        $res = ["success" => false, "message" => $stmt->error];
    }
    $stmt->close();
} else {
    $res = ["success" => false, "message" => "Nombre de categoria vacio"];
}

$conn->close();

// 2. Limpiar cualquier basura del buffer y enviar solo el JSON
ob_end_clean(); 
echo json_encode($res);
exit;