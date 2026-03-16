<?php
// Backend/models/Webhooks.php
include_once "../config/Database.php"; 

$access_token = "APP_USR-552135341638877-031114-bfbf505cdeed855329ed27c49d547669-3259264987";

$json_event = file_get_contents('php://input');
$event = json_decode($json_event, true);

// Respondemos a MP que recibimos la notificación inmediatamente
http_response_code(200);

if (isset($event['type']) && $event['type'] == 'payment') {
    $payment_id = $event['data']['id'];

    // Consultamos el estado del pago a la API de Mercado Pago
    $ch = curl_init("https://api.mercadopago.com/v1/payments/$payment_id");
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $access_token"]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $payment_info = json_decode(curl_exec($ch), true);
    curl_close($ch);

    if (isset($payment_info['status']) && $payment_info['status'] == 'approved') {
        
        $database = new Database();
        $db = $database->getConnection();

        // 1. Intentamos identificar por external_reference (ID de la venta)
        $venta_id = $payment_info['external_reference'] ?? null;
        // 2. Intentamos identificar por preference_id (por si falla el anterior)
        $pref_id = $payment_info['preference_id'] ?? null;
        
        if ($venta_id) {
            $query = "UPDATE ventas SET estado_pago = 'aprobado' WHERE id = :venta_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':venta_id', $venta_id);
            $stmt->execute();
        } else if ($pref_id) {
            $query = "UPDATE ventas SET estado_pago = 'aprobado' WHERE mp_preference_id = :pref_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':pref_id', $pref_id);
            $stmt->execute();
        }
    }
}
