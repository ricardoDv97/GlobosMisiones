<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once "../config/Database.php";

$database = new Database();
$db = $database->getConnection();

// Traemos las ventas unidas con el nombre del usuario para saber quién compró
$query = "SELECT v.*, u.nombre as cliente_nombre 
          FROM ventas v 
          JOIN usuarios u ON v.usuario_id = u.id 
          ORDER BY v.fecha DESC";

$stmt = $db->prepare($query);
$stmt->execute();
$ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($ventas);
