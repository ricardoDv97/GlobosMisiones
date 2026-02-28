<?php
class Database {
    private $host = "localhost";
    private $db_name = "globosmisiones";
    private $username = "root";
    private $password = ""; // En WAMP suele ser vacío
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            // Esto es CLAVE para la seguridad:
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8mb4");
        } catch(PDOException $exception) {
            echo "Error de conexión: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>

