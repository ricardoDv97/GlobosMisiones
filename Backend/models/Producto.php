<?php
// Permitir que React acceda a los datos
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Importar la conexión a la base de datos
require_once __DIR__ . '/../config/Database.php';

$database = new Database();
$db = $database->getConnection();

// Consulta incluyendo categoria_id y stock para que React pueda filtrar y mostrar disponibilidad
$query = "SELECT id, titulo, precio, descripcion, imagen_url, categoria_id, stock FROM items";
$stmt = $db->prepare($query);
$stmt->execute();

// Obtener todos los resultados como un array asociativo
$productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Enviar el JSON
echo json_encode($productos);
