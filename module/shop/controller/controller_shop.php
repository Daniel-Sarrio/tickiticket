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
            $events = $daoshop->select_all_events(0, 10);
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

    case 'filter';
        $daoshop = new DAOShop();
        $selSlide = $daoshop -> filters($_POST['filter']);
        if (!empty($selSlide)) {
            echo json_encode($selSlide);
        }
        else {
            echo "error";
        }
        break;

    default:
        include($path . "view/inc/error404.php");
        break;
}