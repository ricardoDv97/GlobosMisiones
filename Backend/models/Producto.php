<?php
// Permite que React (en el puerto 5173) acceda a los datos
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// El "../" le dice a PHP: "Sal de la carpeta models y busca la carpeta config"
require_once __DIR__ . '/../config/Database.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT id, titulo, precio, descripcion, imagen_url FROM items";
$stmt = $db->prepare($query);
$stmt->execute();
$productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($productos);
?>