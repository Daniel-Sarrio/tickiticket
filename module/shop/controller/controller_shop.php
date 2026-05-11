<?php
$path = '/opt/lampp/htdocs/tickiticket_v7/';
include($path . "module/shop/model/DAOShop.php");

switch ($_GET['op']) {
    case 'view':
        include($path . "module/shop/view/shop.html");
        break;

    case 'all_extras':
        $daoshop = new DAOShop();
        $extras = $daoshop->select_all_extras();
        echo json_encode($extras);
        break;

    case 'all_estadios':
        $daoshop = new DAOShop();
        $estadios = $daoshop->select_all_estadios();
        if (!empty($estadios)) {
            echo json_encode($estadios);
        }
        else {
            echo json_encode("error");
        }
        break;

    case 'all_events':
        try {
            $daoshop = new DAOShop();
            $events = $daoshop->select_all_events($_POST['offset'], $_POST['limit']);
            $all_images = $daoshop->select_imgs_all_events();
        }
        catch (Exception $e) {
            echo json_encode("error");
            exit();
        }
        if (!empty($events)) {
            // Agrupar imágenes por id_evento
            $imgs_by_event = array();
            if (!empty($all_images)) {
                foreach ($all_images as $img) {
                    $imgs_by_event[$img['id_evento']][] = $img;
                }
            }
            // Añadir imágenes a cada evento
            foreach ($events as &$event) {
                $eid = $event['id_evento'];
                $event['imagenes'] = isset($imgs_by_event[$eid]) ? $imgs_by_event[$eid] : array();
            }
            echo json_encode($events);
        }
        else {
            echo json_encode("error");
        }
        break;
    case 'all_events_count':
        try {
            $daoshop = new DAOShop();
            $events_count = $daoshop->count_events();
        }
        catch (Exception $e) {
            echo json_encode("error");
            exit();
        }
        if (!empty($events_count)) {
            echo json_encode($events_count);
        }
        else {
            echo json_encode("error");
        }
        break;

    case 'details_event':
        try {
            $daoshop = new DAOShop();
            $Date_event = $daoshop->select_one_event($_GET['id']);
        }
        catch (Exception $e) {
            echo json_encode("error");
        }
        try {
            $daoshop_img = new DAOShop();
            $Date_images = $daoshop_img->select_imgs_event($_GET['id']);
        }
        catch (Exception $e) {
            echo json_encode("error");
        }
        try {
            $daoshop_extras = new DAOShop();
            $Date_extras = $daoshop_extras->select_extras_event($_GET['id']);
        }
        catch (Exception $e) {
            echo json_encode("error");
        }

        if (!empty($Date_event)) {
            $rdo = array();
            $rdo[0] = $Date_event;
            $rdo[1][] = $Date_images;
            $rdo[2] = $Date_extras;
            echo json_encode($rdo);
        }
        else {
            echo json_encode("error");
        }
        break;

    case 'eventos_relacionados':
        $daoshop = new DAOShop();
        $eventos = $daoshop->select_eventos_relacionados($_POST['id_categoria'], $_POST['id_evento'], $_POST['inicio'], 3);

        if (!empty($eventos)) {
            echo json_encode($eventos);
        }
        else {
            echo json_encode("error");
        }
        break;

    case 'count_eventos_relacionados':
        $daoshop = new DAOShop();
        $total = $daoshop->count_eventos_relacionados($_POST['id_categoria'], $_POST['id_evento']);
        echo json_encode($total);
        break;

    case 'filter';
        $daoshop = new DAOShop();
        $total_prod = isset($_POST['offset']) ? $_POST['offset'] : 0;
        $items_page = isset($_POST['limit']) ? $_POST['limit'] : 9;
        
        $selSlide = $daoshop->filters($_POST['filter'], $total_prod, $items_page);
        
        if (!empty($selSlide)) {
            echo json_encode($selSlide);
        }
        else {
            echo "error";
        }
        break;
    case 'filters_count';
        $daoshop = new DAOShop();
        $res = 0;
        if (isset($_POST['filter']) && !empty($_POST['filter'])) {
            $res = $daoshop->count_events_filters($_POST['filter']);
        } else {
            $res = $daoshop->count_events();
        }
        echo json_encode($res);
        break;
    case 'contador_eventos_visitados':
        $id_evento = isset($_POST['id_evento']) ? (int) $_POST['id_evento'] : 0;
        if ($id_evento <= 0) {
            echo json_encode(false);
            break;
        }

        $daoshop = new DAOShop();
        $res = $daoshop->count_more_visit($id_evento);
        echo json_encode($res);
        break;
    default:
        include($path . "view/inc/error404.php");
        break;
}
