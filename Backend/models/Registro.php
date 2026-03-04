<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/../config/Database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['nombre']) && !empty($data['email']) && !empty($data['password'])) {
    $nombre = $data['nombre'];
    $email = $data['email'];
    $password = password_hash($data['password'], PASSWORD_BCRYPT); // Encriptación
    $rol = 'cliente'; // Por defecto todos son clientes

    $query = "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)";
    $stmt = $db->prepare($query);

    try {
        if ($stmt->execute([$nombre, $email, $password, $rol])) {
            echo json_encode(["success" => true, "message" => "Usuario creado con éxito"]);
        }
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "El correo ya está registrado"]);
    }
}
