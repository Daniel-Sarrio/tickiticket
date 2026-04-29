<?php
$path = '/opt/lampp/htdocs/tickiticket_v7/';
include($path . "model/connect.php");

class DAO_search {
    function search_brand(){
        $sql = "SELECT id_equipo AS id_brand, nombre_equipo AS brand_name
                FROM equipos
                ORDER BY nombre_equipo ASC";

        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $res;
    }

    function search_category_null(){
        $sql = "SELECT id_categoria, tipo_categoria AS cat_name
                FROM categorias_evento
                ORDER BY tipo_categoria ASC";

        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $res;
    }

    function search_category($brand){
        $sql = "SELECT DISTINCT cat.id_categoria, cat.tipo_categoria AS cat_name
                FROM eventos e
                JOIN categorias_evento cat ON e.id_categoria = cat.id_categoria
                WHERE e.id_equipo_local = :brand OR e.id_equipo_visitante = :brand
                ORDER BY cat.tipo_categoria ASC";

        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':brand', $brand, PDO::PARAM_INT);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $res;
    }

    function select_only_brand($complete, $brand){
        $sql = "SELECT DISTINCT c.nombre_ciudad AS ciudad
                FROM eventos e
                JOIN estadios es ON e.id_estadio = es.id_estadio
                JOIN ciudades c ON es.id_ciudad = c.id_ciudad
                WHERE (e.id_equipo_local = :brand OR e.id_equipo_visitante = :brand)
                AND c.nombre_ciudad LIKE :complete
                ORDER BY c.nombre_ciudad ASC";
        $completeLike = $complete . '%';

        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':brand', $brand, PDO::PARAM_INT);
        $stmt->bindParam(':complete', $completeLike, PDO::PARAM_STR);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $res;
    }

    function select_only_category($category, $complete){
        $sql = "SELECT DISTINCT c.nombre_ciudad AS ciudad
                FROM eventos e
                JOIN estadios es ON e.id_estadio = es.id_estadio
                JOIN ciudades c ON es.id_ciudad = c.id_ciudad
                WHERE e.id_categoria = :category
                AND c.nombre_ciudad LIKE :complete
                ORDER BY c.nombre_ciudad ASC";
        $completeLike = $complete . '%';

        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':category', $category, PDO::PARAM_INT);
        $stmt->bindParam(':complete', $completeLike, PDO::PARAM_STR);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $res;
    }


    function select_brand_category($complete, $brand, $category){
        $sql = "SELECT DISTINCT c.nombre_ciudad AS ciudad
                FROM eventos e
                JOIN estadios es ON e.id_estadio = es.id_estadio
                JOIN ciudades c ON es.id_ciudad = c.id_ciudad
                WHERE e.id_categoria = :category
                AND (e.id_equipo_local = :brand OR e.id_equipo_visitante = :brand)
                AND c.nombre_ciudad LIKE :complete
                ORDER BY c.nombre_ciudad ASC";
        $completeLike = $complete . '%';

        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':category', $category, PDO::PARAM_INT);
        $stmt->bindParam(':brand', $brand, PDO::PARAM_INT);
        $stmt->bindParam(':complete', $completeLike, PDO::PARAM_STR);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $res;
    }

    function select_city($complete){
        $sql = "SELECT DISTINCT nombre_ciudad AS ciudad
                FROM ciudades
                WHERE nombre_ciudad LIKE :complete
                ORDER BY nombre_ciudad ASC";
        $completeLike = $complete . '%';

        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':complete', $completeLike, PDO::PARAM_STR);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $res;
    }
}