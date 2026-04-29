<?php
$path = '/opt/lampp/htdocs/tickiticket_v7/';
include($path . "model/connect.php");

class DAOShop
{

    function select_all_events($total_prod, $items_page)
    {
        $sql = "SELECT * FROM eventos 
                ORDER BY fecha_evento ASC 
                LIMIT :total_prod, :items_page";
        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':total_prod', $total_prod, PDO::PARAM_INT);
        $stmt->bindParam(':items_page', $items_page, PDO::PARAM_INT);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $res;
    }

    function select_one_event($id)
    {
        $sql = "SELECT e.*, 
                   es.nombre_estadio, 
                   eq1.nombre_equipo AS equipo_local, 
                   eq2.nombre_equipo AS equipo_visitante,
                   c.nombre_ciudad,
                   cat.tipo_categoria
            FROM eventos e
            JOIN estadios es ON e.id_estadio = es.id_estadio
            JOIN equipos eq1 ON e.id_equipo_local = eq1.id_equipo
            JOIN equipos eq2 ON e.id_equipo_visitante = eq2.id_equipo
            JOIN ciudades c ON es.id_ciudad = c.id_ciudad
            JOIN categorias_evento cat ON e.id_categoria = cat.id_categoria
            WHERE e.id_evento = :id";
        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $res;
    }
    function select_imgs_event($id)
    {
        $sql = "SELECT id_imagen, id_evento, ruta_imagen
            FROM img_eventos
            WHERE id_evento = :id";

        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $res;
    }
    function select_imgs_all_events()
    {
        $sql = "SELECT id_imagen, id_evento, ruta_imagen FROM img_eventos ORDER BY id_evento, id_imagen";
        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $res;
    }
    function select_extras_event($id)
    {
        $sql = "SELECT e.nombre_extra, e.icon_extra 
            FROM extras e
            JOIN eventos_extras ee ON e.id_extra = ee.id_extra
            WHERE ee.id_evento = :id";
        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $res;
    }
    function select_all_extras()
    {
        $sql = "SELECT id_extra, nombre_extra FROM extras ORDER BY nombre_extra ASC";
        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $res;
    }

    function select_all_estadios()
    {
        $sql = "SELECT id_estadio, nombre_estadio FROM estadios ORDER BY nombre_estadio ASC";
        $conexion = connect::con();
        $stmt = $conexion->prepare($sql);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);
        return $res;
    }

    function filters($filter)
    {
        $consulta = "SELECT e.*, cat.tipo_categoria, es.nombre_estadio, ciu.nombre_ciudad, eq1.nombre_equipo AS local_name, eq2.nombre_equipo AS visitor_name
            FROM eventos e
            LEFT JOIN categorias_evento cat ON e.id_categoria = cat.id_categoria
            LEFT JOIN estadios es ON e.id_estadio = es.id_estadio
            LEFT JOIN ciudades ciu ON es.id_ciudad = ciu.id_ciudad
            LEFT JOIN equipos eq1 ON e.id_equipo_local = eq1.id_equipo
            LEFT JOIN equipos eq2 ON e.id_equipo_visitante = eq2.id_equipo";

        for ($i = 0; $i < count($filter); $i++) {
            $column = $filter[$i][0];
            $value = $filter[$i][1];
            $condition = "";

            if ($column == 'tipo_categoria') {
                $condition = "cat.tipo_categoria = '" . $value . "'";
            }
            else if ($column == 'nombre_equipo') {
                if (is_array($value)) {
                    $teams = implode("','", $value);
                    $condition = "(eq1.nombre_equipo IN ('" . $teams . "') OR eq2.nombre_equipo IN ('" . $teams . "'))";
                }
                else {
                    $condition = "(eq1.nombre_equipo = '" . $value . "' OR eq2.nombre_equipo = '" . $value . "')";
                }
            }
            else if ($column == 'estado') {
                $condition = "e.estado = '" . $value . "'";
            }
            else if ($column == 'id_estadio') {
                if (is_array($value)) {
                    $stadiums = implode("','", $value);
                    $condition = "e.id_estadio IN ('" . $stadiums . "')";
                }
                else {
                    $condition = "e.id_estadio = '" . $value . "'";
                }
            }
            else if ($column == 'nombre_ciudad') {
                $condition = "ciu.nombre_ciudad = '" . $value . "'";
            }
            else {
                $condition = "e." . $column . " = '" . $value . "'";
            }

            if ($i == 0) {
                $consulta .= " WHERE " . $condition;
            }
            else {
                $consulta .= " AND " . $condition;
            }
        }

        $consulta .= " ORDER BY e.fecha_evento ASC";

        $conexion = connect::con();
        $res = $conexion->prepare($consulta);
        $res->execute();
        $retrArray = $res->fetchAll(PDO::FETCH_ASSOC);
        connect::close($conexion);

        return $retrArray;
    }
}
