<?php
// Permitimos que React acceda
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Conexión a la base de datos
$servidor = "localhost";
$usuario  = "root";
$password = ""; 
$base_datos = "globosmisiones"; 

$conn = new mysqli($servidor, $usuario, $password, $base_datos);

// Si falla la conexión, enviamos el error en formato JSON para que React no explote
if ($conn->connect_error) {
    echo json_encode(["error" => "Error de conexión: " . $conn->connect_error]);
    exit;
}

// Consulta a la tabla categorias
$sql = "SELECT id, nombre FROM categorias ORDER BY nombre ASC";
$result = $conn->query($sql);

$categorias = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $categorias[] = [
            "id" => $row['id'],
            "nombre" => $row['nombre']
        ];
    }
}

// Enviamos los datos
echo json_encode($categorias);

// Cerramos conexión
$conn->close();
exit;