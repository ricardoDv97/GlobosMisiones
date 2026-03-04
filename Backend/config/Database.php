<?php
class Database {
    private $host = "localhost";
    private $db_name = "globosmisiones";
    private $username = "root";
    private $password = ""; 
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8mb4");
        } catch(PDOException $exception) {
            // Error en log, no con echo, para no romper el JSON de salida
            error_log("Error de conexión: " . $exception->getMessage());
        }
        return $this->conn;
    }
}
