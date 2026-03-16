<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include_once "../config/Database.php"; 

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    echo json_encode(["error" => "No se pudo conectar a la base de datos"]);
    exit;
}

$access_token = "APP_USR-552135341638877-031114-bfbf505cdeed855329ed27c49d547669-3259264987";
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['items']) || !isset($input['envio'])) {
    echo json_encode(["error" => "Datos de compra o envío incompletos"]);
    exit;
}

$items_carrito = $input['items'];
$usuario_id = $input['usuario_id'] ?? null;
$envio = $input['envio']; 

$total_venta = 0;
$items_mp = [];

foreach ($items_carrito as $item) {
    $items_mp[] = [
        "title" => $item['titulo'],
        "quantity" => (int)$item['cantidad'],
        "unit_price" => (float)$item['precio'],
        "currency_id" => "ARS"
    ];
    $total_venta += ($item['precio'] * $item['cantidad']);
}

// Formateamos la dirección con los datos de la API del Gobierno
$provincia = $envio['provincia'] ?? 'Misiones';
$localidad = $envio['localidad'] ?? 'Posadas';
$direccion_completa = "Prov: " . $provincia . " - Loc: " . $localidad . " - Dir: " . $envio['direccion'];
$nombre_completo = $envio['nombre'] . " " . $envio['apellido'];
$notas = $envio['observaciones'] ?? '';
$telefono = $envio['telefono'] ?? '';
$tipo_envio = $envio['tipo']; // 'Posadas' o 'Interior'

try {
    // Insertamos la venta (mp_preference_id queda vacío momentáneamente)
    $query = "INSERT INTO ventas (usuario_id, nombre_cliente, telefono, metodo_envio, direccion_envio, notas, total, estado_pago, mp_preference_id) 
              VALUES (:usuario_id, :nombre, :tel, :metodo, :direccion, :notas, :total, 'pendiente', '')";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':usuario_id', $usuario_id);
    $stmt->bindParam(':nombre', $nombre_completo);
    $stmt->bindParam(':tel', $telefono);
    $stmt->bindParam(':metodo', $tipo_envio);
    $stmt->bindParam(':direccion', $direccion_completa);
    $stmt->bindParam(':notas', $notas);
    $stmt->bindParam(':total', $total_venta);
    $stmt->execute();
    
    $venta_id = $db->lastInsertId(); 

    // SI ES POSADAS: Finalizamos aquí para que React dispare el WhatsApp
    if ($tipo_envio === "Posadas") {
        echo json_encode([
            "status" => "success", 
            "message" => "Venta local registrada",
            "venta_id" => $venta_id
        ]);
        exit;
    }

    // SI ES INTERIOR: Procedemos con Mercado Pago
    $preference_data = [
        "items" => $items_mp,
        "payer" => [
            "name" => $envio['nombre'],
            "surname" => $envio['apellido'],
            "email" => "cliente_misiones@test.com", // MP requiere email
            "phone" => ["number" => $telefono]
        ],
        "back_urls" => [
            "success" => "http://127.0.0.1:5173/pago-exitoso",
            "failure" => "http://127.0.0.1:5173/pago-fallido",
            "pending" => "http://127.0.0.1:5173/pago-pendiente"
        ],
        "auto_return" => "approved",
        "external_reference" => (string)$venta_id,
        "notification_url" => "https://tu-dominio.com/Backend/models/Webhooks.php" // Reemplaza por tu URL real cuando subas a internet
    ];

    $ch = curl_init("https://api.mercadopago.com/checkout/preferences");
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json", "Authorization: Bearer $access_token"]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($preference_data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response_raw = curl_exec($ch);
    $response_mp = json_decode($response_raw, true);
    curl_close($ch);

    if (isset($response_mp['id'])) {
        $real_pref_id = $response_mp['id'];
        // Actualizamos el ID de preferencia en la venta
        $update = $db->prepare("UPDATE ventas SET mp_preference_id = :real_id WHERE id = :v_id");
        $update->bindParam(':real_id', $real_pref_id);
        $update->bindParam(':v_id', $venta_id);
        $update->execute();

        echo json_encode(["init_point" => $response_mp['init_point']]);
    } else {
        echo json_encode(["error" => "Fallo en MP", "detalle" => $response_mp]);
    }

} catch (PDOException $e) {
    echo json_encode(["error" => "Error DB: " . $e->getMessage()]);
    exit;
}