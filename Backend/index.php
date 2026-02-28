<?php
// Usamos __DIR__ para que PHP sepa que debe buscar DESDE donde está este index.php
require_once __DIR__ . '/config/Database.php';

$database = new Database();
$db = $database->getConnection();

if($db){
    echo "<h1 style='color: #2ecc71;'>🎈 ¡Conexión Exitosa a GlobosMisiones!</h1>";
    echo "<p>El sistema MVC está listo para despegar.</p>";
} else {
    echo "<h1 style='color: #e74c3c;'>❌ Error de conexión.</h1>";
}
?>


