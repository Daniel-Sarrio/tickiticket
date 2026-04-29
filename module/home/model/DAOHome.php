<?php
$path = '/opt/lampp/htdocs/tickiticket_v7/';
include($path . "model/connect.php");

class DAOHome
{
    function select_all_games()
    {
        // echo json_encode("select_all_events");
        // exit();
        $sql = "SELECT * FROM eventos";
        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $res;
    }
    function select_all_categories()
    {
        $sql = "SELECT * FROM categorias_evento";
        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $res;
    }
    function select_all_equipos()
    {
        $sql = "SELECT * FROM equipos";
        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $res;
    }
    function select_all_estadios()
    {
        $sql = "SELECT * FROM estadios";
        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $res;
    }

}