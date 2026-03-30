<?php
include_once "../config/Database.php"; 

$access_token = "APP_USR-552135341638877-031114-bfbf505cdeed855329ed27c49d547669-3259264987";
$json_event = file_get_contents('php://input');
$event = json_decode($json_event, true);

http_response_code(200);

if (isset($event['type']) && $event['type'] == 'payment') {
    $payment_id = $event['data']['id'];

    $ch = curl_init("https://api.mercadopago.com/v1/payments/$payment_id");
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $access_token"]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $payment_info = json_decode(curl_exec($ch), true);
    curl_close($ch);

    if (isset($payment_info['status']) && $payment_info['status'] == 'approved') {
        $database = new Database();
        $db = $database->getConnection();
        
        $venta_id = $payment_info['external_reference'] ?? null;
        
        if ($venta_id) {
            // 1. Marcar venta como aprobada
            $query = "UPDATE ventas SET estado_pago = 'aprobado' WHERE id = :venta_id AND estado_pago != 'aprobado'";
            $stmt = $db->prepare($query);
            $stmt->execute([':venta_id' => $venta_id]);

            // 2. Restar Stock (Si la actualización anterior tuvo éxito)
            if($stmt->rowCount() > 0) {
                // Aquí podrías tener una tabla intermedia 'venta_items' para restar cada producto
                // Por ahora, si registraste el item en la descripción del pago:
                // Lógica de reducción de stock según tu estructura de base de datos
            }
        }
    }
}