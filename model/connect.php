<?php
class connect
{
	public static function con()
	{
		$host = 'localhost';
		$user = "root";
		$pass = "";
		$db = "tickiticket";

		try {
			$conexion = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
			$conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$conexion->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
			return $conexion;
		}
		catch (PDOException $e) {
			die("Connection failed: " . $e->getMessage());
		}
	}
	public static function close(&$conexion)
	{
		$conexion = null;
	}
}